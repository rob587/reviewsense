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
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          "linear-gradient(135deg, #0a0f1e 0%, #0d1b2a 50%, #0a1628 100%)",
      }}
    >
      <header
        style={{
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(56,189,248,0.15)",
        }}
        className="px-6 py-4 sticky top-0 z-50"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              style={{
                background: "linear-gradient(135deg, #0ea5e9, #06b6d4)",
                borderRadius: "10px",
              }}
              className="w-8 h-8 flex items-center justify-center text-sm"
            ></div>
            <h1
              style={{
                background: "linear-gradient(135deg, #38bdf8, #06b6d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              className="text-xl font-bold"
            >
              ReviewSense
            </h1>
            <span className="text-gray-500 text-sm hidden md:block">
              Ciao, {user.username}!
            </span>
          </div>
          <button
            onClick={logout}
            style={{
              border: "1px solid rgba(239,68,68,0.3)",
              color: "#6b7280",
            }}
            className="hover:text-red-400 text-sm px-3 py-1.5 rounded-lg transition-all"
          >
            Esci
          </button>
        </div>
      </header>

      <nav
        style={{
          background: "rgba(255,255,255,0.02)",
          borderBottom: "1px solid rgba(56,189,248,0.1)",
        }}
        className="px-6"
      >
        <div className="max-w-4xl mx-auto flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && setActiveTab(tab.id)}
              disabled={tab.disabled}
              style={{
                borderBottom:
                  activeTab === tab.id
                    ? "2px solid #0ea5e9"
                    : "2px solid transparent",
                color:
                  activeTab === tab.id
                    ? "#38bdf8"
                    : tab.disabled
                      ? "#374151"
                      : "#6b7280",
              }}
              className="px-4 py-3 text-sm font-medium transition-all hover:text-gray-300 disabled:cursor-not-allowed"
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

      <footer
        style={{
          borderTop: "1px solid rgba(56,189,248,0.1)",
          color: "#374151",
        }}
        className="py-4 text-center text-sm"
      >
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
