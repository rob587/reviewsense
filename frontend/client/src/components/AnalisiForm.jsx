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
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await analyzeRecensioni(form.nome_prodotto, form.categoria);
      onAnalisiComplete(data.analisi);
      setForm({ nome_prodotto: "", categoria: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-gray-100 mb-1">
        🔍 Analizza Recensioni
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        Inserisci il nome del prodotto e ReviewSense cercherà automaticamente le
        recensioni online
      </p>

      {error && (
        <div className="bg-red-900/30 border border-red-500/40 text-red-400 rounded-lg px-4 py-3 text-sm mb-4 flex justify-between">
          {error}
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-400 text-sm mb-1">
            Nome prodotto <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="nome_prodotto"
            value={form.nome_prodotto}
            onChange={handleChange}
            placeholder="es. iPhone 15 Pro, Samsung TV QLED 55, Nike Air Max..."
            required
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 text-sm focus:outline-none focus:border-violet-500"
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-1">
            Categoria (opzionale)
          </label>
          <select
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 text-sm focus:outline-none focus:border-violet-500"
          >
            <option value="">Seleziona categoria</option>
            {CATEGORIE.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <p className="text-gray-400 text-xs flex items-center gap-2">
            <span>🤖</span>
            ReviewSense cercherà automaticamente recensioni, opinioni e
            valutazioni del prodotto su Google e le analizzerà con AI
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || !form.nome_prodotto.trim()}
          className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Ricerca e analisi in corso...
            </>
          ) : (
            "🔍 Cerca e Analizza"
          )}
        </button>
      </form>
    </div>
  );
};

export default AnalisiForm;
