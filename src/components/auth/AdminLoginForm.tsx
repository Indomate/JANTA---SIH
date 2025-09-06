import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { Shield } from 'lucide-react';

export const AdminLoginForm: React.FC = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('vivek@gmail.com');
  const [password, setPassword] = useState('admin');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password, 'admin');
    } catch (error) {
      // Error handled by context
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 sm:p-6 lg:p-8 w-full max-w-md">
      <div className="text-center mb-4 sm:mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-purple-600 p-2 sm:p-3 rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4"
        >
          <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
        </motion.div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">State Administrator</h2>
        <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2 px-2">System-wide administration access</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <Input
          type="email"
          label="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter admin email"
          disabled
        />
        
        <Input
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Enter admin password"
        />

        <Button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 focus:ring-purple-500"
          loading={loading}
        >
          Access Admin Panel
        </Button>
      </form>

      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-purple-50 rounded-lg">
        <p className="text-xs text-purple-700 text-center">
          <strong>Secure Access:</strong> This is a restricted administrative interface.
          All actions are logged and monitored.
        </p>
      </div>
    </Card>
  );
};