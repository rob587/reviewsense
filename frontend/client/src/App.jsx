import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import AnalisiForm from "./components/AnalisiForm";
import AnalisiReport from "./components/AnalisiReport";
import AnalisiHistory from "./components/AnalisiHistory";

const AppContent = () => {
  const { user, logout, loading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [activeTab, setActiveTab] = useState("analisi");
  const [currentAnalisi, setCurrentAnalisi] = useState(null);

  if (loading)
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-500">
        Caricamento...
      </div>
    );

  if (!user) {
    return showRegister ? (
      <Register onSwitch={() => setShowRegister(false)} />
    ) : (
      <Login onSwitch={() => setShowRegister(true)} />
    );
  }

  const handleAnalisiComplete = (analisi) => {
    setCurrentAnalisi(analisi);
    setActiveTab("report");
  };

  const handleLoadAnalisi = (analisi) => {
    setCurrentAnalisi(analisi);
    setActiveTab("report");
  };

  const handleNuovaAnalisi = () => {
    setCurrentAnalisi(null);
    setActiveTab("analisi");
  };

  const TABS = [
    { id: "analisi", label: "🔍 Analizza" },
    { id: "report", label: "📊 Report", disabled: !currentAnalisi },
    { id: "history", label: "📚 Storico" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-violet-400">ReviewSense</h1>
            <span className="text-gray-500 text-sm">
              Ciao, {user.username}!
            </span>
          </div>
          <button
            onClick={logout}
            className="text-gray-500 hover:text-red-400 border border-gray-700 hover:border-red-400/50 text-sm px-3 py-1.5 rounded-lg transition-all"
          >
            Esci
          </button>
        </div>
      </header>

      <nav className="bg-gray-900 border-b border-gray-800 px-6">
        <div className="max-w-4xl mx-auto flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && setActiveTab(tab.id)}
              disabled={tab.disabled}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-violet-500 text-violet-400"
                  : tab.disabled
                    ? "border-transparent text-gray-600 cursor-not-allowed"
                    : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {activeTab === "analisi" && (
            <AnalisiForm onAnalisiComplete={handleAnalisiComplete} />
          )}
          {activeTab === "report" && currentAnalisi && (
            <AnalisiReport
              analisi={currentAnalisi}
              onNuovaAnalisi={handleNuovaAnalisi}
            />
          )}
          {activeTab === "history" && (
            <AnalisiHistory onLoadAnalisi={handleLoadAnalisi} />
          )}
        </div>
      </main>

      <footer className="border-t border-gray-800 py-4 text-center text-gray-600 text-sm">
        ReviewSense — Analisi AI delle recensioni
      </footer>
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
