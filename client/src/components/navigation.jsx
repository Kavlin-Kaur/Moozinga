// Simple navigation helper since we don't have React Router
import { useState, createContext, useContext } from 'react';

const NavigationContext = createContext();

export function NavigationProvider({ children }) {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <NavigationContext.Provider value={{ currentPage, setCurrentPage }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigate() {
  const { setCurrentPage } = useContext(NavigationContext);
  return (page) => setCurrentPage(page);
}

export function useCurrentPage() {
  const { currentPage } = useContext(NavigationContext);
  return currentPage;
}
