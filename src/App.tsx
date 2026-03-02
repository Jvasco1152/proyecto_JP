import { useState } from 'react';
import type { FormType } from './types/inspection';
import { useAuth } from './hooks/useAuth';
import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomeScreen';
import WizardLayout from './components/wizard/WizardLayout';

const FORM_TYPE_KEY = 'auditor_jp_form_type';

function App() {
  const { isAuthenticated, login, logout } = useAuth();

  const [formType, setFormType] = useState<FormType | null>(() => {
    const saved = localStorage.getItem(FORM_TYPE_KEY);
    return (saved as FormType) || null;
  });

  const handleSelect = (type: FormType) => {
    localStorage.setItem(FORM_TYPE_KEY, type);
    setFormType(type);
  };

  const handleBack = () => {
    localStorage.removeItem(FORM_TYPE_KEY);
    setFormType(null);
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={login} />;
  }

  if (!formType) {
    return <HomeScreen onSelect={handleSelect} onLogout={logout} />;
  }

  return <WizardLayout formType={formType} onBack={handleBack} onLogout={logout} />;
}

export default App;
