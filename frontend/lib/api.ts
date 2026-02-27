const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const getToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('af_token');
};

const headers = (withAuth = false) => {
    const h: Record<string, string> = { 'Content-Type': 'application/json' };
    if (withAuth) {
        const token = getToken();
        if (token) h['Authorization'] = `Bearer ${token}`;
    }
    return h;
};

export const api = {
    // Auth
    register: (data: { name: string; email: string; password: string }) =>
        fetch(`${API_URL}/api/auth/register`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(r => r.json()),

    login: (data: { email: string; password: string }) =>
        fetch(`${API_URL}/api/auth/login`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(r => r.json()),

    me: () =>
        fetch(`${API_URL}/api/auth/me`, { headers: headers(true) }).then(r => r.json()),

    // Forms
    getForms: () =>
        fetch(`${API_URL}/api/forms`, { headers: headers(true) }).then(r => r.json()),

    getForm: (id: string) =>
        fetch(`${API_URL}/api/forms/${id}`, { headers: headers(false) }).then(r => r.json()),

    createForm: (data: object) =>
        fetch(`${API_URL}/api/forms`, { method: 'POST', headers: headers(true), body: JSON.stringify(data) }).then(r => r.json()),

    updateForm: (id: string, data: object) =>
        fetch(`${API_URL}/api/forms/${id}`, { method: 'PUT', headers: headers(true), body: JSON.stringify(data) }).then(r => r.json()),

    deleteForm: (id: string) =>
        fetch(`${API_URL}/api/forms/${id}`, { method: 'DELETE', headers: headers(true) }).then(r => r.json()),

    publishForm: (id: string) =>
        fetch(`${API_URL}/api/forms/${id}/publish`, { method: 'POST', headers: headers(true) }).then(r => r.json()),

    // Responses
    submitResponse: (formId: string, data: object) =>
        fetch(`${API_URL}/api/responses/${formId}`, { method: 'POST', headers: headers(false), body: JSON.stringify(data) }).then(r => r.json()),

    getResponses: (formId: string) =>
        fetch(`${API_URL}/api/responses/${formId}`, { headers: headers(true) }).then(r => r.json()),

    // AI
    generateForm: (goal: string) =>
        fetch(`${API_URL}/api/ai/generate-form`, { method: 'POST', headers: headers(true), body: JSON.stringify({ goal }) }).then(r => r.json()),

    generateInsights: (formId: string) =>
        fetch(`${API_URL}/api/ai/insights/${formId}`, { method: 'POST', headers: headers(true) }).then(r => r.json()),

    getInsights: (formId: string) =>
        fetch(`${API_URL}/api/ai/insights/${formId}`, { headers: headers(false) }).then(r => r.json()),

    generateSummary: (formId: string) =>
        fetch(`${API_URL}/api/ai/summary/${formId}`, { method: 'POST', headers: headers(true) }).then(r => r.json()),

    adaptiveNext: (data: object) =>
        fetch(`${API_URL}/api/ai/adaptive-next`, { method: 'POST', headers: headers(false), body: JSON.stringify(data) }).then(r => r.json()),

    askAI: (message: string) =>
        fetch(`${API_URL}/api/ai/chat`, { method: 'POST', headers: headers(true), body: JSON.stringify({ message }) }).then(r => r.json()),
};
