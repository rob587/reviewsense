const BASE_URL = "http://localhost:5000/api";

const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

// autenticazione
export const registerUser = async (username, email, password) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Errore registrazione");
    return data;
};

export const loginUser = async (email, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Errore login");
    return data;
};


//analisi
export const analyzeRecensioni = async (nome_prodotto, categoria, recensioni) => {
    const res = await fetch(`${BASE_URL}/analisi/analyze`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ nome_prodotto, categoria, recensioni }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Errore analisi");
    return data;
};

export const getHistory = async () => {
    const res = await fetch(`${BASE_URL}/analisi/history`, {
        headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Errore fetch storico");
    return data;
};

export const getAnalisi = async (id) => {
    const res = await fetch(`${BASE_URL}/analisi/${id}`, {
        headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Errore fetch analisi");
    return data;
};

export const deleteAnalisi = async (id) => {
    const res = await fetch(`${BASE_URL}/analisi/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Errore eliminazione analisi");
    return data;
};