const fs = require('fs');
const path = require('path');

const rootDir = process.argv[2] || process.cwd();
const ignoreDirs = ['node_modules', '.git', '.next', 'venv', 'dist', 'build', '.cache'];

const getAllFiles = (dir, fileList = []) => {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            if (!ignoreDirs.includes(file)) {
                getAllFiles(filePath, fileList);
            }
        } else {
            fileList.push(filePath);
        }
    }
    return fileList;
};

const allFiles = getAllFiles(rootDir);
const sourceFiles = allFiles.filter(f => /\.(js|jsx|ts|tsx|html|css|md)$/i.test(f));
const assetFiles = allFiles.filter(f => /\.(png|jpg|jpeg|svg|webp|gif|ico)$/i.test(f));
const otherFiles = allFiles.filter(f => !sourceFiles.includes(f) && !assetFiles.includes(f));

console.log(`Scanning ${sourceFiles.length} source files for references...`);

// 1. Unused Assets
const unusedAssets = [];
for (const asset of assetFiles) {
    const assetName = path.basename(asset);
    let isUsed = false;
    for (const source of sourceFiles) {
        const content = fs.readFileSync(source, 'utf8');
        if (content.includes(assetName)) {
            isUsed = true;
            break;
        }
    }
    if (!isUsed) unusedAssets.push(asset);
}

// 2. Unused Source Components (Naive check: if filename is exported but never imported)
const unusedSource = [];
const indexFiles = sourceFiles.filter(f => /index\.(js|jsx|ts|tsx)$/i.test(f));
for (const source of sourceFiles) {
    // Skip entry points, config files, and layouts
    if (/page\.(tsx|jsx)$/i.test(source) || /layout\.(tsx|jsx)$/i.test(source) || /globals\.css$/i.test(source)) continue;
    if (source.includes('server.js') || source.includes('next.config.ts') || source.includes('tailwind.config')) continue;
    if (source.includes('package.json') || source.includes('.env')) continue;

    const baseName = path.basename(source, path.extname(source));
    let isImported = false;

    // Check if imported by name
    for (const otherSource of sourceFiles) {
        if (source === otherSource) continue;
        const content = fs.readFileSync(otherSource, 'utf8');
        // Simple regex to check for import or require
        const importRegex = new RegExp(`(?:import|require).*['"](?:.*\\/)?${baseName}['"]`, 'i');
        if (importRegex.test(content) || content.includes(baseName)) {
            isImported = true;
            break;
        }
    }

    if (!isImported) unusedSource.push(source);
}

// 3. Backup and Cache Files
const backupFiles = otherFiles.filter(f => /\.(bak|old|tmp|log)$/i.test(f) && !f.includes('package-lock.json'));

const report = {
    unusedAssets,
    unusedSource,
    backupFiles
};

fs.writeFileSync('cleanup_report.json', JSON.stringify(report, null, 2));
console.log('Cleanup report generated: cleanup_report.json');
console.log('Unused Assets:', unusedAssets.length);
console.log('Unused Source:', unusedSource.length);
console.log('Backup/Log Files:', backupFiles.length);
