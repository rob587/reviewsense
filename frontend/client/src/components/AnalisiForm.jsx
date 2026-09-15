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
        <>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-gray-100 mb-1">
                    Analizza Recensioni
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                    Incolla le recensioni di un prodotto e lascia che l'AI le analizzi per te
                </p>

                {error && (
                    <div className="bg-red-900/30 border border-red-500/40 text-red-400 rounded-lg px-4 py-3 text-sm mb-4 flex justify-between">
                        {error}
                        <button onClick={() => setError(null)}>✕</button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-400 text-sm mb-1">
                                Nome prodotto <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="nome_prodotto"
                                value={form.nome_prodotto}
                                onChange={handleChange}
                                placeholder="es. iPhone 15 Pro"
                                required
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 text-sm focus:outline-none focus:border-violet-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm mb-1">
                                Categoria
                            </label>
                            <select
                                name="categoria"
                                value={form.categoria}
                                onChange={handleChange}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 text-sm focus:outline-none focus:border-violet-500"
                            >
                                <option value="">Seleziona categoria</option>
                                {CATEGORIE.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-gray-400 text-sm">
                                Recensioni <span className="text-red-400">*</span>
                            </label>
                            <span className={`text-xs ${charCount > 45000 ? "text-red-400" : "text-gray-500"}`}>
                                {charCount.toLocaleString()} / 50.000
                            </span>
                        </div>
                        <textarea
                            name="recensioni"
                            value={form.recensioni}
                            onChange={handleChange}
                            placeholder="Incolla qui le recensioni del prodotto — più ne metti, più accurata sarà l'analisi..."
                            required
                            rows={10}
                            maxLength={50000}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 text-sm focus:outline-none focus:border-violet-500 resize-y font-mono"
                        />
                        <p className="text-gray-600 text-xs mt-1">
                            Puoi incollare recensioni da Amazon, Google, Trustpilot o qualsiasi altra fonte
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || form.recensioni.trim().length < 50}
                        className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Analisi in corso...
                            </>
                        ) : (
                            "Analizza Recensioni"
                        )}
                    </button>
                </form>
            </div>
        </>
    )
}

export default AnalisiForm