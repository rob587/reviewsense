import { useState, useEffect } from "react";
import { getHistory, deleteAnalisi } from "../services/apiService";

const SENTIMENT_CONFIG = {
  positivo: { color: "#34d399", label: "Positivo", emoji: "😊" },
  neutro: { color: "#fbbf24", label: "Neutro", emoji: "😐" },
  negativo: { color: "#ef4444", label: "Negativo", emoji: "😞" },
  misto: { color: "#a78bfa", label: "Misto", emoji: "🤔" },
};

const AnalisiHistory = ({ onLoadAnalisi }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadHistory = async () => {
    try {
      const data = await getHistory();
      setHistory(data.analisi);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteAnalisi(id);
      setHistory(history.filter((a) => a.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getScoreColor = (score) => {
    if (score >= 7) return "#34d399";
    if (score >= 5) return "#fbbf24";
    return "#ef4444";
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        Caricamento storico...
      </div>
    );

  return (
    <>
      <div className="space-y-4">
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(56,189,248,0.15)",
            backdropFilter: "blur(20px)",
          }}
          className="rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold text-white">
            📚 Storico Analisi
          </h2>
          <p className="text-gray-500 text-sm mt-1">Le tue ultime 20 analisi</p>
        </div>

        {error && (
          <div
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
            }}
            className="text-red-400 rounded-xl px-4 py-3 text-sm flex justify-between"
          >
            {error}
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}

        {history.length === 0 ? (
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(56,189,248,0.15)",
            }}
            className="rounded-2xl p-6"
          >
            <div className="text-center py-10 text-gray-500">
              <p className="text-4xl mb-3">📭</p>
              <p className="font-medium">Nessuna analisi ancora.</p>
              <p className="text-sm mt-1">
                Analizza le recensioni di un prodotto!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((analisi) => {
              const risultato =
                typeof analisi.risultato === "string"
                  ? JSON.parse(analisi.risultato)
                  : analisi.risultato;
              const sentimentConfig =
                SENTIMENT_CONFIG[risultato?.sentiment_generale] ||
                SENTIMENT_CONFIG.neutro;

              return (
                <div
                  key={analisi.id}
                  onClick={() => onLoadAnalisi(analisi)}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(56,189,248,0.1)",
                    backdropFilter: "blur(20px)",
                  }}
                  className="rounded-2xl p-5 cursor-pointer transition-all hover:border-cyan-400/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${getScoreColor(analisi.sentiment_score)}20, ${getScoreColor(analisi.sentiment_score)}10)`,
                          border: `1px solid ${getScoreColor(analisi.sentiment_score)}40`,
                          color: getScoreColor(analisi.sentiment_score),
                        }}
                      >
                        {analisi.sentiment_score}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-semibold truncate">
                            {analisi.nome_prodotto}
                          </span>
                          {analisi.categoria && (
                            <span
                              style={{
                                background: "rgba(14,165,233,0.1)",
                                border: "1px solid rgba(14,165,233,0.2)",
                                color: "#38bdf8",
                              }}
                              className="text-xs px-2 py-0.5 rounded-full shrink-0"
                            >
                              {analisi.categoria}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className="text-xs font-medium"
                            style={{ color: sentimentConfig.color }}
                          >
                            {sentimentConfig.emoji} {sentimentConfig.label}
                          </span>
                          <span className="text-gray-600 text-xs">
                            {formatDate(analisi.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-gray-600 text-xs">Vedi →</span>
                      <button
                        onClick={(e) => handleDelete(e, analisi.id)}
                        className="text-gray-600 hover:text-red-400 hover:bg-red-400/10 p-2 rounded-lg transition-all"
                      >
                        🗑
                      </button>
                    </div>
                  </div>

                  {risultato?.pro && risultato?.contro && (
                    <div
                      style={{ borderTop: "1px solid rgba(56,189,248,0.1)" }}
                      className="grid grid-cols-2 gap-4 mt-4 pt-4"
                    >
                      <div>
                        <p className="text-emerald-400 text-xs font-medium mb-1">
                          Top Pro
                        </p>
                        <p className="text-gray-500 text-xs truncate">
                          + {risultato.pro[0]}
                        </p>
                      </div>
                      <div>
                        <p className="text-red-400 text-xs font-medium mb-1">
                          Top Contro
                        </p>
                        <p className="text-gray-500 text-xs truncate">
                          − {risultato.contro[0]}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default AnalisiHistory;
