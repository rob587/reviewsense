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

const AnalisiReport = ({ analisi, onNuovaAnalisi }) => {
  const { nome_prodotto, categoria, risultato, created_at } = analisi;
  const r = typeof risultato === "string" ? JSON.parse(risultato) : risultato;
  const sentimentConfig =
    SENTIMENT_CONFIG[r.sentiment_generale] || SENTIMENT_CONFIG.neutro;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-100">{nome_prodotto}</h2>
            <div className="flex items-center gap-2 mt-1">
              {categoria && (
                <span className="bg-gray-800 text-gray-400 text-xs px-2 py-0.5 rounded-full">
                  {categoria}
                </span>
              )}
              <span className="text-gray-600 text-xs">
                {formatDate(created_at)}
              </span>
            </div>
          </div>
          <button
            onClick={onNuovaAnalisi}
            className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all"
          >
            + Nuova Analisi
          </button>
        </div>

        {/* Score + Sentiment */}
        <div className="flex items-center gap-8">
          <ScoreGauge score={r.sentiment_score} />
          <div className="flex-1">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-3 ${sentimentConfig.bg} ${sentimentConfig.border}`}
            >
              <span
                style={{ color: sentimentConfig.color }}
                className="font-semibold text-sm"
              >
                {sentimentConfig.label}
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-3">
              {r.sintesi}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>
                📊 ~{r.numero_recensioni_stimate} recensioni analizzate
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pro e Contro */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-emerald-400 font-semibold mb-4 flex items-center gap-2">
            ✅ Pro
          </h3>
          <ul className="space-y-2">
            {r.pro?.map((pro, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-gray-300"
              >
                <span className="text-emerald-400 mt-0.5 shrink-0">+</span>
                {pro}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-red-400 font-semibold mb-4 flex items-center gap-2">
            ❌ Contro
          </h3>
          <ul className="space-y-2">
            {r.contro?.map((contro, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-gray-300"
              >
                <span className="text-red-400 mt-0.5 shrink-0">−</span>
                {contro}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Temi ricorrenti */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-gray-100 font-semibold mb-4">🏷️ Temi Ricorrenti</h3>
        <div className="flex flex-wrap gap-2">
          {r.temi_ricorrenti?.map((tema, i) => (
            <span
              key={i}
              className="bg-violet-500/10 border border-violet-500/30 text-violet-300 text-sm px-3 py-1.5 rounded-full"
            >
              {tema}
            </span>
          ))}
        </div>
      </div>

      {/* Raccomandazione + Target */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-gray-100 font-semibold mb-3">
            💡 Raccomandazione
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            {r.raccomandazione}
          </p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-gray-100 font-semibold mb-3">🎯 Target Ideale</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            {r.target_ideale}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalisiReport;
