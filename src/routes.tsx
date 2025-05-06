import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import Landing from '@/pages/Landing';
import Index from '@/pages/Index';
import Workouts from '@/pages/Workouts';
import About from '@/pages/About';
import Auth from '@/pages/Auth';
import NotFound from '@/pages/NotFound';
import Profile from '@/pages/Profile';
import { Progress } from '@/pages/Progress';

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1 mt-14">
      {children}
    </main>
  </div>
);

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Layout>{children}</Layout>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/auth" element={<Auth />} />
    <Route path="/home" element={
      <ProtectedLayout>
        <Index />
      </ProtectedLayout>
    } />
    <Route path="/workouts" element={
      <ProtectedLayout>
        <Workouts />
      </ProtectedLayout>
    } />
    <Route path="/progress" element={
      <ProtectedLayout>
        <Progress />
      </ProtectedLayout>
    } />
    <Route path="/about" element={
      <ProtectedLayout>
        <About />
      </ProtectedLayout>
    } />
    <Route path="/profile" element={
      <ProtectedLayout>
        <Profile />
      </ProtectedLayout>
    } />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes; 