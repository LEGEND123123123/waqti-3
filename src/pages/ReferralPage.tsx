import React, { useState, useEffect } from 'react';
import { Gift, Users, DollarSign, Share2, Copy, Check, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

interface Referral {
  id: string;
  referee_name: string;
  status: 'pending' | 'completed' | 'expired';
  reward_amount: number;
  completed_at?: Date;
  created_at: Date;
}

interface ReferralPageProps {
  setActivePage: (page: string) => void;
}

const ReferralPage: React.FC<ReferralPageProps> = ({ setActivePage }) => {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [stats, setStats] = useState({
    totalEarned: 0,
    pendingRewards: 0,
    totalReferrals: 0
  });
  const [referralCode, setReferralCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchReferralData();
      generateReferralCode();
    }
  }, [user]);

  const generateReferralCode = () => {
    if (user) {
      const code = `WAQTI-${user.id.substring(0, 8).toUpperCase()}`;
      setReferralCode(code);
    }
  };

  const fetchReferralData = async () => {
    try {
      setLoading(true);

      // Fetch referrals
      const { data: referralData, error: referralError } = await supabase
        .from('referrals')
        .select(`
          *,
          referee:users!referee_id(name)
        `)
        .eq('referrer_id', user?.id)
        .order('created_at', { ascending: false });

      if (referralError) throw referralError;

      const formattedReferrals = referralData?.map(ref => ({
        id: ref.id,
        referee_name: ref.referee.name,
        status: ref.status,
        reward_amount: ref.reward_amount,
        completed_at: ref.completed_at ? new Date(ref.completed_at) : undefined,
        created_at: new Date(ref.created_at)
      })) || [];

      setReferrals(formattedReferrals);

      // Calculate stats
      const totalEarned = formattedReferrals
        .filter(ref => ref.status === 'completed')
        .reduce((sum, ref) => sum + ref.reward_amount, 0);

      const pendingRewards = formattedReferrals
        .filter(ref => ref.status === 'pending')
        .reduce((sum, ref) => sum + ref.reward_amount, 0);

      setStats({
        totalEarned,
        pendingRewards,
        totalReferrals: formattedReferrals.length
      });
    } catch (error) {
      console.error('Error fetching referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = async () => {
    const referralLink = `${window.location.origin}/register?ref=${referralCode}`;
    
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = referralLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareOnSocial = (platform: string) => {
    const referralLink = `${window.location.origin}/register?ref=${referralCode}`;
    const message = 'انضم إلى منصة وقتي وابدأ في تبادل الخدمات باستخدام الوقت كعملة!';
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(referralLink)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(message + ' ' + referralLink)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(message)}`
    };

    window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'expired': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'مكتمل';
      case 'pending': return 'في الانتظار';
      case 'expired': return 'منتهي الصلاحية';
      default: return 'غير محدد';
    }
  };

  if (!user) {
    setActivePage('login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-[#2E86AB] rounded-full">
              <Gift className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">برنامج الإحالة</h1>
          <p className="text-gray-600">ادع أصدقاءك واكسب ساعات إضافية</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="p-3 bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalEarned}</div>
            <div className="text-gray-600">ساعات مكتسبة</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="p-3 bg-yellow-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.pendingRewards}</div>
            <div className="text-gray-600">ساعات في الانتظار</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="p-3 bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalReferrals}</div>
            <div className="text-gray-600">إجمالي الإحالات</div>
          </div>
        </div>

        {/* Referral Code Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">كود الإحالة الخاص بك</h2>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-[#2E86AB] mb-1">{referralCode}</div>
                <div className="text-sm text-gray-600">
                  {window.location.origin}/register?ref={referralCode}
                </div>
              </div>
              <button
                onClick={copyReferralLink}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  copied 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-[#2E86AB] text-white hover:bg-[#1e5f7a]'
                }`}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'تم النسخ!' : 'نسخ الرابط'}
              </button>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => shareOnSocial('whatsapp')}
              className="flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-green-500">📱</span>
              واتساب
            </button>
            <button
              onClick={() => shareOnSocial('twitter')}
              className="flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-blue-500">🐦</span>
              تويتر
            </button>
            <button
              onClick={() => shareOnSocial('facebook')}
              className="flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-blue-600">📘</span>
              فيسبوك
            </button>
            <button
              onClick={() => shareOnSocial('telegram')}
              className="flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-blue-400">✈️</span>
              تيليجرام
            </button>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">كيف يعمل برنامج الإحالة</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="p-3 bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Share2 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">1. شارك الرابط</h3>
              <p className="text-gray-600 text-sm">شارك رابط الإحالة مع أصدقائك وعائلتك</p>
            </div>

            <div className="text-center">
              <div className="p-3 bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">2. الانضمام</h3>
              <p className="text-gray-600 text-sm">عندما ينضم صديقك، يحصل على 25 ساعة ترحيبية</p>
            </div>

            <div className="text-center">
              <div className="p-3 bg-yellow-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Gift className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">3. اكسب المكافآت</h3>
              <p className="text-gray-600 text-sm">تحصل على 50 ساعة عندما يكمل صديقك أول خدمة</p>
            </div>
          </div>
        </div>

        {/* Referral History */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">سجل الإحالات</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2E86AB] mx-auto"></div>
              <p className="text-gray-600 mt-2">جاري التحميل...</p>
            </div>
          ) : referrals.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد إحالات بعد</h3>
              <p className="text-gray-600">ابدأ بدعوة أصدقائك للانضمام إلى المنصة</p>
            </div>
          ) : (
            <div className="space-y-4">
              {referrals.map(referral => (
                <div
                  key={referral.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{referral.referee_name}</h4>
                      <p className="text-sm text-gray-600">
                        انضم في {referral.created_at.toLocaleDateString('ar-AE')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(referral.status)}`}>
                      {getStatusText(referral.status)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {referral.reward_amount} ساعة
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bonus Tiers */}
        <div className="bg-gradient-to-r from-[#2E86AB] to-[#1e5f7a] rounded-lg p-6 mt-8 text-white">
          <h2 className="text-xl font-semibold mb-4">مكافآت إضافية</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">5 إحالات</div>
              <div className="text-sm opacity-90">مكافأة 100 ساعة</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">10 إحالات</div>
              <div className="text-sm opacity-90">مكافأة 250 ساعة</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">25 إحالة</div>
              <div className="text-sm opacity-90">مكافأة 750 ساعة</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralPage;