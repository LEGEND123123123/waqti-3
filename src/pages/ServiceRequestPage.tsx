import React, { useState, useEffect } from 'react';
import { Plus, Clock, DollarSign, MapPin, Calendar, FileText, X, Search, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  budget_amount: number;
  budget_type: 'time' | 'money';
  currency?: string;
  required_skills: string[];
  deadline?: Date;
  location?: string;
  is_remote: boolean;
  urgency: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  attachments: string[];
  proposals_count: number;
  client: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
  };
  created_at: Date;
}

interface ServiceRequestPageProps {
  setActivePage: (page: string) => void;
}

const ServiceRequestPage: React.FC<ServiceRequestPageProps> = ({ setActivePage }) => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [budgetType, setBudgetType] = useState<'all' | 'time' | 'money'>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const categories = [
    { id: 'all', name: 'جميع الفئات' },
    { id: 'Programming', name: 'البرمجة' },
    { id: 'Design', name: 'التصميم' },
    { id: 'Translation', name: 'الترجمة' },
    { id: 'Teaching', name: 'التدريس' },
    { id: 'Writing', name: 'الكتابة' },
    { id: 'Marketing', name: 'التسويق' }
  ];

  useEffect(() => {
    fetchRequests();
  }, [searchTerm, selectedCategory, budgetType]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('service_requests')
        .select(`
          *,
          client:users!client_id(id, name, avatar_url)
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      if (budgetType !== 'all') {
        query = query.eq('budget_type', budgetType);
      }

      const { data, error } = await query;

      if (error) throw error;

      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'عاجل';
      case 'medium': return 'متوسط';
      case 'low': return 'عادي';
      default: return 'غير محدد';
    }
  };

  const formatBudget = (amount: number, type: string, currency?: string) => {
    if (type === 'time') {
      return `${amount} ساعة`;
    } else {
      return `${amount} ${currency || 'AED'}`;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ar-AE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  };

  if (!user) {
    setActivePage('login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">طلبات الخدمات</h1>
            <p className="text-gray-600">تصفح الطلبات المتاحة وقدم عروضك</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 bg-[#2E86AB] text-white px-6 py-3 rounded-lg hover:bg-[#1e5f7a] transition-colors"
          >
            <Plus className="h-5 w-5" />
            إنشاء طلب جديد
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="ابحث في الطلبات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={budgetType}
              onChange={(e) => setBudgetType(e.target.value as 'all' | 'time' | 'money')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
            >
              <option value="all">جميع أنواع الميزانية</option>
              <option value="time">مقابل الوقت</option>
              <option value="money">مقابل المال</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            تم العثور على {requests.length} طلب
          </p>
        </div>

        {/* Requests Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E86AB] mx-auto"></div>
            <p className="text-gray-600 mt-4">جاري التحميل...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {requests.map(request => (
              <div
                key={request.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                      {request.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <span className="flex items-center gap-1">
                        <img
                          src={request.client.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'}
                          alt={request.client.name}
                          className="w-4 h-4 rounded-full"
                        />
                        {request.client.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(request.created_at)}
                      </span>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(request.urgency)}`}>
                    {getUrgencyText(request.urgency)}
                  </div>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-3">
                  {request.description}
                </p>

                {request.required_skills.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {request.required_skills.slice(0, 4).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {request.required_skills.length > 4 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{request.required_skills.length - 4} المزيد
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      {request.budget_type === 'time' ? (
                        <Clock className="h-4 w-4" />
                      ) : (
                        <DollarSign className="h-4 w-4" />
                      )}
                      {formatBudget(request.budget_amount, request.budget_type, request.currency)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {request.is_remote ? 'عن بُعد' : request.location}
                    </span>
                  </div>
                  {request.deadline && (
                    <div className="text-sm text-gray-600">
                      الموعد النهائي: {formatDate(request.deadline)}
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <button className="w-full bg-[#2E86AB] text-white py-2 px-4 rounded-lg hover:bg-[#1e5f7a] transition-colors">
                    تقديم عرض ({request.proposals_count} عرض مقدم)
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {requests.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد طلبات</h3>
            <p className="text-gray-600">لم يتم العثور على طلبات تطابق معايير البحث الخاصة بك</p>
          </div>
        )}

        {/* Create Request Modal */}
        {showCreateForm && (
          <CreateRequestModal
            onClose={() => setShowCreateForm(false)}
            onSuccess={() => {
              setShowCreateForm(false);
              fetchRequests();
            }}
          />
        )}
      </div>
    </div>
  );
};

const CreateRequestModal: React.FC<{
  onClose: () => void;
  onSuccess: () => void;
}> = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    budget_amount: '',
    budget_type: 'time' as 'time' | 'money',
    currency: 'AED',
    required_skills: [] as string[],
    deadline: '',
    location: '',
    is_remote: true,
    urgency: 'medium' as 'low' | 'medium' | 'high'
  });
  const [currentSkill, setCurrentSkill] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    'Programming', 'Design', 'Translation', 'Teaching', 'Writing', 'Marketing'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'عنوان الطلب مطلوب';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'وصف الطلب مطلوب';
    }

    if (!formData.category) {
      newErrors.category = 'فئة الطلب مطلوبة';
    }

    if (!formData.budget_amount || Number(formData.budget_amount) <= 0) {
      newErrors.budget_amount = 'الميزانية مطلوبة ويجب أن تكون أكبر من صفر';
    }

    if (formData.required_skills.length === 0) {
      newErrors.skills = 'يجب إضافة مهارة واحدة على الأقل';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSkill = () => {
    if (currentSkill.trim() && !formData.required_skills.includes(currentSkill.trim())) {
      setFormData({
        ...formData,
        required_skills: [...formData.required_skills, currentSkill.trim()]
      });
      setCurrentSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      required_skills: formData.required_skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('service_requests')
        .insert([
          {
            client_id: user?.id,
            title: formData.title,
            description: formData.description,
            category: formData.category,
            budget_amount: Number(formData.budget_amount),
            budget_type: formData.budget_type,
            currency: formData.currency,
            required_skills: formData.required_skills,
            deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
            location: formData.location,
            is_remote: formData.is_remote,
            urgency: formData.urgency
          }
        ]);

      if (error) throw error;

      onSuccess();
    } catch (error) {
      console.error('Error creating request:', error);
      setErrors({ submit: 'فشل في إنشاء الطلب. يرجى المحاولة مرة أخرى.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#2E86AB]">إنشاء طلب خدمة جديد</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عنوان الطلب *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="مثال: تطوير موقع إلكتروني للتجارة الإلكترونية"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              وصف الطلب *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="اكتب وصفاً مفصلاً للخدمة المطلوبة..."
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الفئة *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">اختر الفئة</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الأولوية
              </label>
              <select
                value={formData.urgency}
                onChange={(e) => setFormData({...formData, urgency: e.target.value as 'low' | 'medium' | 'high'})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
              >
                <option value="low">عادي</option>
                <option value="medium">متوسط</option>
                <option value="high">عاجل</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع الميزانية *
              </label>
              <select
                value={formData.budget_type}
                onChange={(e) => setFormData({...formData, budget_type: e.target.value as 'time' | 'money'})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
              >
                <option value="time">مقابل الوقت</option>
                <option value="money">مقابل المال</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {formData.budget_type === 'time' ? 'عدد الساعات *' : 'المبلغ *'}
              </label>
              <input
                type="number"
                value={formData.budget_amount}
                onChange={(e) => setFormData({...formData, budget_amount: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent ${
                  errors.budget_amount ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={formData.budget_type === 'time' ? 'عدد الساعات' : 'المبلغ'}
                min="1"
              />
              {errors.budget_amount && <p className="mt-1 text-sm text-red-600">{errors.budget_amount}</p>}
            </div>

            {formData.budget_type === 'money' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العملة
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({...formData, currency: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
                >
                  <option value="AED">AED</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              المهارات المطلوبة *
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
                placeholder="اكتب اسم المهارة"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 bg-[#2E86AB] text-white rounded-lg hover:bg-[#1e5f7a] flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                إضافة
              </button>
            </div>
            
            {formData.required_skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.required_skills.map(skill => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            {errors.skills && <p className="mt-1 text-sm text-red-600">{errors.skills}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الموعد النهائي
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الموقع
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
                placeholder="المدينة أو المنطقة"
                disabled={formData.is_remote}
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_remote}
                onChange={(e) => setFormData({...formData, is_remote: e.target.checked})}
                className="rounded border-gray-300 text-[#2E86AB] focus:ring-[#2E86AB]"
              />
              <span className="text-sm text-gray-700">يمكن العمل عن بُعد</span>
            </label>
          </div>

          {errors.submit && (
            <div className="bg-red-100 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              {errors.submit}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-[#2E86AB] text-white py-3 px-6 rounded-lg hover:bg-[#1e5f7a] transition-colors font-medium disabled:opacity-50"
            >
              {isSubmitting ? 'جاري النشر...' : 'نشر الطلب'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceRequestPage;