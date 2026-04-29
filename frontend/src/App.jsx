import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import LoadingScreen from './components/loading/LoadingScreen';
import './styles/themes.css';

// Lazy loaded components
const MainLayout = lazy(() => import('./components/layout/MainLayout'));
const Home = lazy(() => import('./pages/public/Home'));

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulasi loading atau preload assets
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800); // Reduced loading time to 0.8s for better UX

    return () => clearTimeout(timer);
  }, []);

  return (
    <AppProvider>
      {loading && <LoadingScreen onFinish={() => setLoading(false)} />}
      <Router>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            {/* Public Routes with MainLayout */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
            </Route>
            
            {/* Catch-all route to redirect back home if user tries to access admin or non-existent pages */}
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </Router>
    </AppProvider>
  );
}

export default App;