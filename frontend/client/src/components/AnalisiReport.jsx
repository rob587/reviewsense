import React from "react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from "recharts";

const SENTIMENT_CONFIG = {
  positivo: {
    color: "#34d399",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    label: "Positivo",
  },
  neutro: {
    color: "#fbbf24",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    label: "Neutro",
  },
  negativo: {
    color: "#ef4444",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    label: "Negativo",
  },
  misto: {
    color: "#a78bfa",
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
    label: "Misto",
  },
};

const ScoreGauge = ({ score }) => {
  const color = score >= 7 ? "#34d399" : score >= 5 ? "#fbbf24" : "#ef4444";
  const data = [{ value: score * 10, fill: color }];

  return (
    <div style={{ width: "160px", height: "160px", position: "relative" }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="70%"
          outerRadius="100%"
          data={data}
          startAngle={180}
          endAngle={0}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar
            dataKey="value"
            cornerRadius={10}
            background={{ fill: "rgba(255,255,255,0.05)" }}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "20px",
        }}
      >
        <span style={{ fontSize: "2rem", fontWeight: "700", color }}>
          {score}
        </span>
        <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>/ 10</span>
      </div>
    </div>
  );
};

const AnalisiReport = () => {
  return (
    <>
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-gray-100 mb-1">
          Analizza Recensioni
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Incolla le recensioni di un prodotto e lascia che l'AI le analizzi per
          te
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
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-gray-400 text-sm">
                Recensioni <span className="text-red-400">*</span>
              </label>
              <span
                className={`text-xs ${charCount > 45000 ? "text-red-400" : "text-gray-500"}`}
              >
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
              Puoi incollare recensioni da Amazon, Google, Trustpilot o
              qualsiasi altra fonte
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
  );
};

export default AnalisiReport;
