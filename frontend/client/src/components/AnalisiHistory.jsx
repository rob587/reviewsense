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

  return <div>AnalisiHistory</div>;
};

export default AnalisiHistory;
