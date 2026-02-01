import { SessionProvider } from './context/SessionContext';
import { NavigationProvider, useCurrentPage } from './components/navigation';
import { Toaster } from 'react-hot-toast';
import Home from './components/Home';
import CreateSession from './components/CreateSession';
import JoinSession from './components/JoinSession';
import SessionRoom from './components/SessionRoom';
import './index.css';

function AppRouter() {
  const currentPage = useCurrentPage();

  switch (currentPage) {
    case 'create':
      return <CreateSession />;
    case 'join':
      return <JoinSession />;
    case 'session':
      return <SessionRoom />;
    default:
      return <Home />;
  }
}

function App() {
  return (
    <NavigationProvider>
      <SessionProvider>
        <AppRouter />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'rgba(255, 107, 53, 0.9)',
              color: '#fff',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              padding: '12px 20px',
              fontWeight: '500'
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </SessionProvider>
    </NavigationProvider>
  );
}

export default App;
