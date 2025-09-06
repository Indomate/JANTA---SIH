import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { User, Users } from 'lucide-react';

interface LoginFormProps {
  mode: 'citizen' | 'public_admin';
  onToggleMode: () => void;
  formType: 'login' | 'signup';
}

export const LoginForm: React.FC<LoginFormProps> = ({ mode, onToggleMode, formType }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password, mode);
    } catch (error) {
      // Error handled by context
    } finally {
      setLoading(false);
    }
  };

  const config = {
    citizen: {
      icon: User,
      title: 'Citizen Login',
      subtitle: 'Access your civic reporting dashboard',
      color: 'text-green-600',
      bgColor: 'bg-green-600'
    },
    public_admin: {
      icon: Users,
      title: 'Public Admin Login',
      subtitle: 'Manage reports in your jurisdiction',
      color: 'text-blue-600',
      bgColor: 'bg-blue-600'
    }
  };

  const currentConfig = config[mode];
  const Icon = currentConfig.icon;

  return (
    <Card className="p-4 sm:p-6 lg:p-8 w-full max-w-md">
      <div className="text-center mb-4 sm:mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`${currentConfig.bgColor} p-2 sm:p-3 rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4`}
        >
          <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
        </motion.div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{currentConfig.title}</h2>
        <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2 px-2">{currentConfig.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <Input
          type="email"
          label="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter your email"
        />
        
        <Input
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Enter your password"
        />

        <Button
          type="submit"
          className="w-full"
          loading={loading}
        >
          Sign In
        </Button>
      </form>

      {mode === 'citizen' && (
        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={onToggleMode}
              className={`font-medium ${currentConfig.color} hover:opacity-80 transition-colors`}
            >
              Sign up here
            </button>
          </p>
        </div>
      )}

      {mode === 'public_admin' && (
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700 text-center">
            <strong>Note:</strong> Public Admin accounts must be activated by the State Administrator.
            Contact your system administrator if you don't have access.
          </p>
        </div>
      )}
    </Card>
  );
};