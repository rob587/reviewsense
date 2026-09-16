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
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
