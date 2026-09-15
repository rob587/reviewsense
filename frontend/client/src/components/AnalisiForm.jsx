import { useState } from "react";
import { analyzeRecensioni } from "../services/apiService";

const CATEGORIE = [
    "Elettronica",
    "Abbigliamento",
    "Casa e cucina",
    "Sport e outdoor",
    "Bellezza e cura",
    "Libri",
    "Giocattoli",
    "Alimentari",
    "Automotive",
    "Altro",
];


const AnalisiForm = ({ onAnalisiComplete }) => {

    const [form, setForm] = useState({
        nome_prodotto: "",
        categoria: "",
        recensioni: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [charCount, setCharCount] = useState(0);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        if (name === "recensioni") setCharCount(value.length);
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.recensioni.trim().length < 50) {
            setError("Inserisci almeno 50 caratteri di recensioni");
            return;
        }
        setLoading(true);
        try {
            const data = await analyzeRecensioni(
                form.nome_prodotto,
                form.categoria,
                form.recensioni
            );
            onAnalisiComplete(data.analisi);
            setForm({ nome_prodotto: "", categoria: "", recensioni: "" });
            setCharCount(0);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };



    return (
        <div>AnalisiForm</div>
    )
}

export default AnalisiForm