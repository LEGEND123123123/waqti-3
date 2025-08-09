import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertCircle, FileText, MessageSquare, DollarSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

interface Milestone {
  id: string;
  order_id: string;
  sequence: number;
  title: string;
  description?: string;
  amount: number;
  due_date?: Date;
  status: 'pending' | 'submitted' | 'approved' | 'rejected';
  submitted_at?: Date;
  approved_at?: Date;
  approved_by?: string;
  deliverables: string[];
  feedback?: string;
}

interface Order {
  id: string;
  service_title: string;
  buyer_name: string;
  seller_name: string;
  total_amount: number;
  status: string;
  created_at: Date;
}

interface MilestoneTrackingPageProps {
  orderId: string;
  setActivePage: (page: string) => void;
  goBack: () => void;
}

const MilestoneTrackingPage: React.FC<MilestoneTrackingPageProps> = ({ 
  orderId, 
  setActivePage, 
  goBack 
}) => {
  const { user } = useAuth();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [submissionData, setSubmissionData] = useState({
    milestoneId: '',
    deliverables: [] as File[],
    notes: ''
  });
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);

  useEffect(() => {
    fetchOrderAndMilestones();
  }, [orderId]);

  const fetchOrderAndMilestones = async () => {
    try {
      setLoading(true);

      // Fetch order details
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          service:services(title),
          buyer:users!buyer_id(name),
          seller:users!seller_id(name)
        `)
        .eq('id', orderId)
        .single();

      if (orderError) throw orderError;

      setOrder({
        id: orderData.id,
        service_title: orderData.service.title,
        buyer_name: orderData.buyer.name,
        seller_name: orderData.seller.name,
        total_amount: orderData.total_amount,
        status: orderData.status,
        created_at: new Date(orderData.created_at)
      });

      // Fetch milestones
      const { data: milestonesData, error: milestonesError } = await supabase
        .from('milestones')
        .select('*')
        .eq('order_id', orderId)
        .order('sequence', { ascending: true });

      if (milestonesError) throw milestonesError;

      setMilestones(milestonesData || []);
    } catch (error) {
      console.error('Error fetching order and milestones:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'submitted':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'submitted':
        return 'text-blue-600 bg-blue-100';
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'في الانتظار';
      case 'submitted': return 'مُقدم للمراجعة';
      case 'approved': return 'موافق عليه';
      case 'rejected': return 'مرفوض';
      default: return 'غير محدد';
    }
  };

  const handleMilestoneApproval = async (milestoneId: string, approved: boolean) => {
    try {
      if (approved) {
        const { error } = await supabase.rpc('approve_milestone', {
          milestone_id: milestoneId,
          approver_id: user?.id
        });

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('milestones')
          .update({ 
            status: 'rejected',
            feedback: 'يحتاج إلى تحسينات'
          })
          .eq('id', milestoneId);

        if (error) throw error;
      }

      // Refresh data
      fetchOrderAndMilestones();
    } catch (error) {
      console.error('Error updating milestone:', error);
      alert('فشل في تحديث المرحلة. يرجى المحاولة مرة أخرى.');
    }
  };

  const handleMilestoneSubmission = async () => {
    try {
      // Upload deliverables
      const uploadPromises = submissionData.deliverables.map(async (file) => {
        const path = `milestones/${submissionData.milestoneId}/${Date.now()}_${file.name}`;
        const { data, error } = await supabase.storage
          .from('deliverables')
          .upload(path, file);
        
        if (error) throw error;
        return path;
      });

      const uploadedPaths = await Promise.all(uploadPromises);

      // Update milestone
      const { error } = await supabase
        .from('milestones')
        .update({
          status: 'submitted',
          submitted_at: new Date().toISOString(),
          deliverables: uploadedPaths,
          feedback: submissionData.notes
        })
        .eq('id', submissionData.milestoneId);

      if (error) throw error;

      // Create notification for buyer
      await supabase
        .from('notifications')
        .insert({
          user_id: order?.buyer_name === user?.name ? order?.seller_name : order?.buyer_name,
          type: 'milestone',
          title: 'تم تقديم مرحلة جديدة',
          message: `تم تقديم مرحلة جديدة في المشروع: ${order?.service_title}`,
          action_url: `/orders/${orderId}/milestones`
        });

      setShowSubmissionModal(false);
      setSubmissionData({ milestoneId: '', deliverables: [], notes: '' });
      fetchOrderAndMilestones();
    } catch (error) {
      console.error('Error submitting milestone:', error);
      alert('فشل في تقديم المرحلة. يرجى المحاولة مرة أخرى.');
    }
  };

  const isBuyer = order?.buyer_name === user?.name;
  const isSeller = order?.seller_name === user?.name;

  if (!user) {
    setActivePage('login');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E86AB] mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-[#2E86AB] hover:text-[#1e5f7a] mb-4"
          >
            ← العودة
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">تتبع مراحل المشروع</h1>
          <p className="text-gray-600">{order?.service_title}</p>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">العميل</h3>
              <p className="text-lg font-semibold text-gray-900">{order?.buyer_name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">مقدم الخدمة</h3>
              <p className="text-lg font-semibold text-gray-900">{order?.seller_name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">إجمالي المبلغ</h3>
              <p className="text-lg font-semibold text-gray-900">{order?.total_amount} ساعة</p>
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div className="space-y-6">
          {milestones.map((milestone, index) => (
            <div
              key={milestone.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon(milestone.status)}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      المرحلة {milestone.sequence}: {milestone.title}
                    </h3>
                    {milestone.description && (
                      <p className="text-gray-600">{milestone.description}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(milestone.status)}`}>
                    {getStatusText(milestone.status)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {milestone.amount} ساعة
                  </div>
                </div>
              </div>

              {milestone.due_date && (
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                  <Calendar className="h-4 w-4" />
                  الموعد النهائي: {new Date(milestone.due_date).toLocaleDateString('ar-AE')}
                </div>
              )}

              {/* Deliverables */}
              {milestone.deliverables.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">المخرجات:</h4>
                  <div className="space-y-2">
                    {milestone.deliverables.map((deliverable, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{deliverable.split('/').pop()}</span>
                        <button className="ml-auto text-[#2E86AB] hover:text-[#1e5f7a] text-sm">
                          تحميل
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Feedback */}
              {milestone.feedback && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">ملاحظات:</h4>
                  <p className="text-sm text-gray-600">{milestone.feedback}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                {isSeller && milestone.status === 'pending' && (
                  <button
                    onClick={() => {
                      setSubmissionData({ ...submissionData, milestoneId: milestone.id });
                      setShowSubmissionModal(true);
                    }}
                    className="bg-[#2E86AB] text-white px-4 py-2 rounded-lg hover:bg-[#1e5f7a] transition-colors"
                  >
                    تقديم المرحلة
                  </button>
                )}

                {isBuyer && milestone.status === 'submitted' && (
                  <>
                    <button
                      onClick={() => handleMilestoneApproval(milestone.id, true)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      موافقة
                    </button>
                    <button
                      onClick={() => handleMilestoneApproval(milestone.id, false)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      رفض
                    </button>
                  </>
                )}

                <button
                  onClick={() => setActivePage('messages')}
                  className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <MessageSquare className="h-4 w-4" />
                  مناقشة
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Submission Modal */}
        {showSubmissionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-[#2E86AB] mb-4">تقديم المرحلة</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رفع الملفات
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => setSubmissionData({
                      ...submissionData,
                      deliverables: Array.from(e.target.files || [])
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
                  />
                  {submissionData.deliverables.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {submissionData.deliverables.map((file, idx) => (
                        <div key={idx} className="text-sm text-gray-600">
                          {file.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ملاحظات
                  </label>
                  <textarea
                    value={submissionData.notes}
                    onChange={(e) => setSubmissionData({
                      ...submissionData,
                      notes: e.target.value
                    })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
                    placeholder="أضف ملاحظات حول هذه المرحلة..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleMilestoneSubmission}
                  className="flex-1 bg-[#2E86AB] text-white py-2 px-4 rounded-lg hover:bg-[#1e5f7a] transition-colors"
                >
                  تقديم المرحلة
                </button>
                <button
                  onClick={() => setShowSubmissionModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MilestoneTrackingPage;