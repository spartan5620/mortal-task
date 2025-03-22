
import Layout from '@/components/layout/Layout';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/lib/auth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'admin') {
        navigate('/admin');
      } else if (user?.role === 'owner') {
        navigate('/owner-dashboard');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, navigate, user]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-center mb-6">Welcome to UniCanteen</h1>
          <LoginForm />
        </div>
      </div>
    </Layout>
  );
};

export default Login;
