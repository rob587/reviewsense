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

  return <div>AnalisiHistory</div>;
};

export default AnalisiHistory;
