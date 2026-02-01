import { createContext, useContext, useState, useEffect } from 'react';

const SessionContext = createContext();

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return context;
}

export function SessionProvider({ children }) {
  const [sessionCode, setSessionCode] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [sessionData, setSessionData] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCode = localStorage.getItem('moozinga_session_code');
    const savedUserId = localStorage.getItem('moozinga_user_id');
    const savedUserName = localStorage.getItem('moozinga_user_name');

    if (savedCode && savedUserId && savedUserName) {
      setSessionCode(savedCode);
      setUserId(savedUserId);
      setUserName(savedUserName);
    }
  }, []);

  const joinSession = (code, id, name) => {
    setSessionCode(code);
    setUserId(id);
    setUserName(name);

    localStorage.setItem('moozinga_session_code', code);
    localStorage.setItem('moozinga_user_id', id);
    localStorage.setItem('moozinga_user_name', name);
  };

  const leaveSession = () => {
    setSessionCode(null);
    setUserId(null);
    setUserName(null);
    setSessionData(null);

    localStorage.removeItem('moozinga_session_code');
    localStorage.removeItem('moozinga_user_id');
    localStorage.removeItem('moozinga_user_name');
  };

  const updateSessionData = (data) => {
    setSessionData(data);
  };

  const value = {
    sessionCode,
    userId,
    userName,
    sessionData,
    joinSession,
    leaveSession,
    updateSessionData,
    isInSession: !!sessionCode && !!userId
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}
