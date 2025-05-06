import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProgressProvider } from '@/contexts/ProgressContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import AppRoutes from '@/routes';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <ProgressProvider>
            <AppRoutes />
            <Toaster position="top-right" />
          </ProgressProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
