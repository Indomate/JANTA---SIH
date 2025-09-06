import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, AlertTriangle, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Report } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ReportCard } from '../../components/reports/ReportCard';
import { Modal } from '../../components/ui/Modal';
import toast from 'react-hot-toast';

export const MyReports: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawReason, setWithdrawReason] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchMyReports();
    }
  }, [user]);

  const fetchMyReports = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error: any) {
      toast.error('Error fetching reports: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawReport = async () => {
    if (!selectedReport || !withdrawReason.trim()) {
      toast.error('Please provide a reason for withdrawal');
      return;
    }

    setWithdrawing(true);
    try {
      const { error } = await supabase
        .from('reports')
        .update({ 
          status: 'withdrawn',
          internal_notes: `Withdrawn by user. Reason: ${withdrawReason}`
        })
        .eq('id', selectedReport.id);

      if (error) throw error;

      toast.success('Report withdrawn successfully');
      setShowWithdrawModal(false);
      setSelectedReport(null);
      setWithdrawReason('');
      fetchMyReports();
    } catch (error: any) {
      toast.error('Error withdrawing report: ' + error.message);
    } finally {
      setWithdrawing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'text-yellow-600 bg-yellow-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'false_complaint': return 'text-red-600 bg-red-100';
      case 'withdrawn': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Reports</h1>
        <p className="text-gray-600 mt-2">Track the status of your submitted reports</p>
      </motion.div>

      {reports.length === 0 ? (
        <Card className="p-8 text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Yet</h3>
          <p className="text-gray-600 mb-4">You haven't submitted any reports yet.</p>
          <Button onClick={() => window.location.href = '/user/report'}>
            Submit Your First Report
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{report.title}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {report.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  {report.images && report.images.length > 0 && (
                    <div className="ml-3">
                      <img
                        src={report.images[0]}
                        alt="Report"
                        className="h-12 w-12 object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {report.description}
                </p>

                <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-3">
                  <span>{report.district}, {report.sector_number}</span>
                  <span>•</span>
                  <span>{new Date(report.created_at).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-900">
                    {report.category} - {report.subcategory}
                  </span>
                  {(report.status === 'submitted' || report.status === 'in_progress') && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedReport(report);
                        setShowWithdrawModal(true);
                      }}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Withdraw
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Withdraw Modal */}
      <Modal
        isOpen={showWithdrawModal}
        onClose={() => {
          setShowWithdrawModal(false);
          setSelectedReport(null);
          setWithdrawReason('');
        }}
        title="Withdraw Report"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
            <div>
              <h4 className="font-medium text-yellow-800">Are you sure?</h4>
              <p className="text-sm text-yellow-700">
                This action cannot be undone. The report will be marked as withdrawn.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for withdrawal *
            </label>
            <textarea
              value={withdrawReason}
              onChange={(e) => setWithdrawReason(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Please explain why you want to withdraw this report..."
              required
            />
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowWithdrawModal(false);
                setSelectedReport(null);
                setWithdrawReason('');
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleWithdrawReport}
              loading={withdrawing}
              className="flex-1"
            >
              Withdraw Report
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};