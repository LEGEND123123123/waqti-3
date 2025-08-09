import React, { useState, useEffect } from 'react';
import { Star, Clock, MapPin, CheckCircle, MessageSquare, Heart, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

interface MatchedProvider {
  provider_id: string;
  provider_name: string;
  provider_rating: number;
  match_score: number;
  avatar_url?: string;
  location?: string;
  response_time?: number;
  completed_services?: number;
  skills: string[];
  hourly_rate?: number;
  availability?: string;
}

interface ProviderMatchingPageProps {
  requestId: string;
  setActivePage: (page: string) => void;
  goBack: () => void;
}

const ProviderMatchingPage: React.FC<ProviderMatchingPageProps> = ({ 
  requestId, 
  setActivePage, 
  goBack 
}) => {
  const { user } = useAuth();
  const [providers, setProviders] = useState<MatchedProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [invitationMessage, setInvitationMessage] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => {
    fetchMatchedProviders();
  }, [requestId]);

  const fetchMatchedProviders = async () => {
    try {
      setLoading(true);
      
      // Get matched providers using the database function
      const { data: matchedData, error: matchError } = await supabase
        .rpc('match_providers_for_request', { request_id: requestId });

      if (matchError) throw matchError;

      // Get additional provider details
      const providerIds = matchedData?.map(p => p.provider_id) || [];
      
      if (providerIds.length > 0) {
        const { data: providerDetails, error: detailsError } = await supabase
          .from('users')
          .select(`
            id,
            name,
            avatar_url,
            phone,
            created_at,
            services!provider_id(
              id,
              title,
              category,
              hourly_rate,
              location,
              rating,
              reviews_count
            )
          `)
          .in('id', providerIds);

        if (detailsError) throw detailsError;

        // Combine match scores with provider details
        const enrichedProviders = matchedData?.map(match => {
          const details = providerDetails?.find(p => p.id === match.provider_id);
          const primaryService = details?.services?.[0];
          
          return {
            ...match,
            avatar_url: details?.avatar_url,
            location: primaryService?.location,
            hourly_rate: primaryService?.hourly_rate,
            skills: details?.services?.map(s => s.category) || [],
            completed_services: details?.services?.length || 0,
            response_time: Math.floor(Math.random() * 24) + 1, // Mock data
            availability: 'available' // Mock data
          };
        }) || [];

        setProviders(enrichedProviders);
      }
    } catch (error) {
      console.error('Error fetching matched providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProviderSelect = (providerId: string) => {
    setSelectedProviders(prev => 
      prev.includes(providerId) 
        ? prev.filter(id => id !== providerId)
        : [...prev, providerId]
    );
  };

  const sendInvitations = async () => {
    try {
      const invitations = selectedProviders.map(providerId => ({
        request_id: requestId,
        provider_id: providerId,
        client_id: user?.id,
        message: invitationMessage,
        status: 'sent'
      }));

      const { error } = await supabase
        .from('invitations')
        .insert(invitations);

      if (error) throw error;

      // Create notifications for invited providers
      const notifications = selectedProviders.map(providerId => ({
        user_id: providerId,
        type: 'invitation',
        title: 'دعوة جديدة للمشاركة في مشروع',
        message: `تم دعوتك للمشاركة في مشروع. ${invitationMessage}`,
        action_url: `/requests/${requestId}`
      }));

      await supabase
        .from('notifications')
        .insert(notifications);

      setShowInviteModal(false);
      setSelectedProviders([]);
      setInvitationMessage('');
      
      // Show success message
      alert('تم إرسال الدعوات بنجاح!');
    } catch (error) {
      console.error('Error sending invitations:', error);
      alert('فشل في إرسال الدعوات. يرجى المحاولة مرة أخرى.');
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : i < rating 
            ? 'text-yellow-400 fill-current opacity-50' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-100';
    if (score >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getMatchScoreText = (score: number) => {
    if (score >= 0.8) return 'مطابقة ممتازة';
    if (score >= 0.6) return 'مطابقة جيدة';
    return 'مطابقة متوسطة';
  };

  if (!user) {
    setActivePage('login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-[#2E86AB] hover:text-[#1e5f7a] mb-4"
          >
            ← العودة إلى الطلب
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">مقدمو الخدمات المقترحون</h1>
          <p className="text-gray-600">تم العثور على {providers.length} مقدم خدمة مناسب لطلبك</p>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {selectedProviders.length} مقدم خدمة محدد
              </span>
              {selectedProviders.length > 0 && (
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="bg-[#2E86AB] text-white px-4 py-2 rounded-lg hover:bg-[#1e5f7a] transition-colors"
                >
                  إرسال دعوات ({selectedProviders.length})
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">ترتيب حسب:</span>
              <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
                <option value="match_score">درجة المطابقة</option>
                <option value="rating">التقييم</option>
                <option value="response_time">سرعة الاستجابة</option>
                <option value="price">السعر</option>
              </select>
            </div>
          </div>
        </div>

        {/* Providers List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E86AB] mx-auto"></div>
            <p className="text-gray-600 mt-4">جاري البحث عن أفضل مقدمي الخدمات...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {providers.map(provider => (
              <div
                key={provider.provider_id}
                className={`bg-white rounded-lg shadow-sm border-2 p-6 transition-all ${
                  selectedProviders.includes(provider.provider_id)
                    ? 'border-[#2E86AB] bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-6">
                  {/* Selection Checkbox */}
                  <div className="flex items-center pt-2">
                    <input
                      type="checkbox"
                      checked={selectedProviders.includes(provider.provider_id)}
                      onChange={() => handleProviderSelect(provider.provider_id)}
                      className="w-5 h-5 text-[#2E86AB] border-gray-300 rounded focus:ring-[#2E86AB]"
                    />
                  </div>

                  {/* Provider Avatar */}
                  <div className="relative">
                    <img
                      src={provider.avatar_url || 'https://randomuser.me/api/portraits/men/1.jpg'}
                      alt={provider.provider_name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <CheckCircle className="absolute -bottom-1 -right-1 h-5 w-5 text-green-500 bg-white rounded-full" />
                  </div>

                  {/* Provider Info */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          {provider.provider_name}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            {renderStars(provider.provider_rating)}
                            <span className="font-medium text-gray-900 ml-1">
                              {provider.provider_rating.toFixed(1)}
                            </span>
                          </div>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-600">
                            {provider.completed_services} خدمة مكتملة
                          </span>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchScoreColor(provider.match_score)}`}>
                        {Math.round(provider.match_score * 100)}% مطابقة
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-2">
                        {provider.skills.slice(0, 4).map(skill => (
                          <span
                            key={skill}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {provider.skills.length > 4 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{provider.skills.length - 4} المزيد
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-sm font-semibold text-gray-900">
                          {provider.hourly_rate || 'غير محدد'}
                        </div>
                        <div className="text-xs text-gray-600">السعر/ساعة</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-semibold text-gray-900">
                          {provider.response_time}س
                        </div>
                        <div className="text-xs text-gray-600">وقت الاستجابة</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-semibold text-gray-900">
                          {provider.availability === 'available' ? 'متاح' : 'مشغول'}
                        </div>
                        <div className="text-xs text-gray-600">الحالة</div>
                      </div>
                    </div>

                    {/* Location */}
                    {provider.location && (
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
                        <MapPin className="h-4 w-4" />
                        {provider.location}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setActivePage(`freelancerDetail`)}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        عرض الملف الشخصي
                      </button>
                      <button
                        onClick={() => setActivePage('messages')}
                        className="flex items-center gap-2 px-4 py-2 bg-[#2E86AB] text-white rounded-lg hover:bg-[#1e5f7a] transition-colors"
                      >
                        <MessageSquare className="h-4 w-4" />
                        تواصل مباشر
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {providers.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <TrendingUp className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا يوجد مقدمو خدمات مناسبون</h3>
            <p className="text-gray-600">لم نجد مقدمي خدمات يطابقون متطلبات طلبك حالياً</p>
          </div>
        )}

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-[#2E86AB] mb-4">
                إرسال دعوات ({selectedProviders.length})
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رسالة الدعوة
                </label>
                <textarea
                  value={invitationMessage}
                  onChange={(e) => setInvitationMessage(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
                  placeholder="اكتب رسالة شخصية لمقدمي الخدمات المختارين..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={sendInvitations}
                  className="flex-1 bg-[#2E86AB] text-white py-2 px-4 rounded-lg hover:bg-[#1e5f7a] transition-colors"
                >
                  إرسال الدعوات
                </button>
                <button
                  onClick={() => setShowInviteModal(false)}
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

export default ProviderMatchingPage;