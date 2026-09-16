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
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(56,189,248,0.15)",
        backdropFilter: "blur(20px)",
      }}
      className="rounded-2xl p-8"
    >
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div
            style={{ background: "linear-gradient(135deg, #0ea5e9, #06b6d4)" }}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
          ></div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Analizza Recensioni
            </h2>
            <p className="text-gray-500 text-sm">
              Cerca automaticamente recensioni online con AI
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
          }}
          className="text-red-400 rounded-xl px-4 py-3 text-sm mb-6 flex justify-between items-center"
        >
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 hover:text-red-300"
          >
            ✕
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-400 text-sm mb-2 font-medium">
            Nome prodotto <span className="text-cyan-400">*</span>
          </label>
          <input
            type="text"
            name="nome_prodotto"
            value={form.nome_prodotto}
            onChange={handleChange}
            placeholder="es. iPhone 15 Pro, Samsung QLED 55, Nike Air Max..."
            required
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(56,189,248,0.2)",
            }}
            className="w-full rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-400 placeholder-gray-600 transition-all"
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-2 font-medium">
            Categoria <span className="text-gray-600">(opzionale)</span>
          </label>
          <select
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(56,189,248,0.2)",
            }}
            className="w-full rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-400 transition-all"
          >
            <option value="" style={{ background: "#0d1b2a" }}>
              Seleziona categoria
            </option>
            {CATEGORIE.map((c) => (
              <option key={c} value={c} style={{ background: "#0d1b2a" }}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div
          style={{
            background: "rgba(14,165,233,0.05)",
            border: "1px solid rgba(14,165,233,0.15)",
          }}
          className="rounded-xl p-4"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">🤖</span>
            <div>
              <p className="text-cyan-400 text-sm font-medium mb-1">
                Come funziona
              </p>
              <p className="text-gray-500 text-xs leading-relaxed">
                ReviewSense cerca automaticamente recensioni, opinioni e
                valutazioni del prodotto su Google e le analizza con AI per
                darti un report dettagliato in pochi secondi.
              </p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !form.nome_prodotto.trim()}
          style={{
            background:
              loading || !form.nome_prodotto.trim()
                ? "rgba(14,165,233,0.3)"
                : "linear-gradient(135deg, #0ea5e9, #06b6d4)",
          }}
          className="w-full disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Ricerca e analisi in corso...
            </>
          ) : (
            <>Cerca e Analizza</>
          )}
        </button>
      </form>
    </div>
  );
};

export default AnalisiForm;
