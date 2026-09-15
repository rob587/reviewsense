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



    return (
        <div>AnalisiForm</div>
    )
}

export default AnalisiForm