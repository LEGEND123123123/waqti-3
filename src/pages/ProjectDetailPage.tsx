import React, { useState } from 'react';
import { Project, Proposal, User } from '../types';
import { ArrowLeft, Clock, MapPin, DollarSign, Calendar, Users, FileText, Send, Star, CheckCircle } from 'lucide-react';

interface ProjectDetailPageProps {
  projectId: string;
  setActivePage: (page: string) => void;
  goBack: () => void;
}

const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ projectId, setActivePage, goBack }) => {
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [proposalData, setProposalData] = useState({
    coverLetter: '',
    budgetAmount: '',
    budgetType: 'time' as 'time' | 'money',
    deliveryTime: '',
    attachments: [] as string[]
  });

  // بيانات وهمية للمشروع
  const mockProject: Project = {
    id: projectId,
    title: 'تطوير موقع إلكتروني للتجارة الإلكترونية',
    description: `نحتاج إلى تطوير موقع إلكتروني متكامل للتجارة الإلكترونية باستخدام React و Node.js. 

المتطلبات الأساسية:
- واجهة مستخدم حديثة وسهلة الاستخدام
- نظام إدارة المنتجات
- نظام دفع آمن متعدد الطرق
- نظام إدارة المخزون
- لوحة تحكم للإدارة
- تصميم متجاوب لجميع الأجهزة
- تحسين محركات البحث (SEO)
- نظام تقييمات ومراجعات
- نظام إشعارات
- تكامل مع وسائل التواصل الاجتماعي

المتطلبات التقنية:
- Frontend: React.js مع TypeScript
- Backend: Node.js مع Express
- قاعدة البيانات: MongoDB
- نظام الدفع: Stripe أو PayPal
- استضافة: AWS أو DigitalOcean

نتوقع تسليم المشروع خلال 6 أسابيع مع إمكانية التطوير على مراحل.`,
    category: 'Programming',
    client: {
      id: 'c1',
      name: 'شركة التقنية المتقدمة',
      email: 'info@techadvanced.com',
      phone: '+971501234567',
      balance: 0,
      joinedAt: new Date('2023-01-01'),
      isVerified: true,
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
    },
    budget: {
      type: 'money',
      amount: 5000,
      currency: 'AED'
    },
    skills: ['React', 'Node.js', 'MongoDB', 'Payment Integration', 'TypeScript', 'AWS'],
    deadline: new Date('2024-02-15'),
    status: 'open',
    location: 'Dubai',
    isRemote: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    proposals: [],
    urgency: 'high',
    attachments: ['requirements.pdf', 'wireframes.png']
  };

  // بيانات وهمية للعروض المقدمة
  const mockProposals: Proposal[] = [
    {
      id: '1',
      projectId: projectId,
      freelancer: {
        id: 'f1',
        name: 'أحمد حسن',
        email: 'ahmed@example.com',
        phone: '+971501234567',
        balance: 8,
        joinedAt: new Date('2023-01-15'),
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        isVerified: true,
        expertiseLevel: 'expert'
      },
      coverLetter: 'مرحباً، أنا مطور ويب خبير مع أكثر من 5 سنوات من الخبرة في تطوير مواقع التجارة الإلكترونية. لقد عملت على مشاريع مشابهة وأستطيع تقديم حل متكامل يلبي جميع متطلباتكم.',
      proposedBudget: {
        type: 'money',
        amount: 4800,
        currency: 'AED'
      },
      deliveryTime: 35,
      status: 'pending',
      createdAt: new Date('2024-01-11'),
      updatedAt: new Date('2024-01-11')
    },
    {
      id: '2',
      projectId: projectId,
      freelancer: {
        id: 'f2',
        name: 'سارة علي',
        email: 'sara@example.com',
        phone: '+971502345678',
        balance: 12,
        joinedAt: new Date('2023-03-10'),
        avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
        isVerified: true,
        expertiseLevel: 'professional'
      },
      coverLetter: 'لدي خبرة واسعة في تطوير مواقع التجارة الإلكترونية باستخدام React و Node.js. يمكنني تقديم موقع احترافي مع جميع الميزات المطلوبة.',
      proposedBudget: {
        type: 'money',
        amount: 5200,
        currency: 'AED'
      },
      deliveryTime: 42,
      status: 'pending',
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-12')
    }
  ];

  const formatBudget = (budget: Project['budget']) => {
    if (budget.type === 'time') {
      return `${budget.amount} ساعة`;
    } else {
      return `${budget.amount} ${budget.currency}`;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ar-AE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
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

  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    // هنا سيتم إرسال العرض
    console.log('Submitting proposal:', proposalData);
    setShowProposalForm(false);
    // إعادة تعيين النموذج
    setProposalData({
      coverLetter: '',
      budgetAmount: '',
      budgetType: 'time',
      deliveryTime: '',
      attachments: []
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-[#2E86AB] hover:text-[#1e5f7a] mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          العودة إلى المشاريع
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Project Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {mockProject.title}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      نُشر في {formatDate(mockProject.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {mockProject.isRemote ? 'عن بُعد' : mockProject.location}
                    </span>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(mockProject.urgency)}`}>
                  {getUrgencyText(mockProject.urgency)}
                </div>
              </div>

              {/* Project Stats */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-lg font-semibold text-gray-900">
                    {mockProject.budget.type === 'time' ? (
                      <Clock className="h-5 w-5" />
                    ) : (
                      <DollarSign className="h-5 w-5" />
                    )}
                    {formatBudget(mockProject.budget)}
                  </div>
                  <div className="text-sm text-gray-600">الميزانية</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{mockProposals.length}</div>
                  <div className="text-sm text-gray-600">العروض المقدمة</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {mockProject.deadline ? formatDate(mockProject.deadline) : 'مفتوح'}
                  </div>
                  <div className="text-sm text-gray-600">الموعد النهائي</div>
                </div>
              </div>
            </div>

            {/* Project Description */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">وصف المشروع</h2>
              <div className="prose prose-gray max-w-none">
                <div className="whitespace-pre-line text-gray-700">
                  {mockProject.description}
                </div>
              </div>
            </div>

            {/* Skills Required */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">المهارات المطلوبة</h2>
              <div className="flex flex-wrap gap-2">
                {mockProject.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Attachments */}
            {mockProject.attachments && mockProject.attachments.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">المرفقات</h2>
                <div className="space-y-2">
                  {mockProject.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700">{attachment}</span>
                      <button className="ml-auto text-[#2E86AB] hover:text-[#1e5f7a] text-sm">
                        تحميل
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Proposals Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                العروض المقدمة ({mockProposals.length})
              </h2>
              
              {mockProposals.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  لم يتم تقديم أي عروض بعد
                </div>
              ) : (
                <div className="space-y-4">
                  {mockProposals.map(proposal => (
                    <div key={proposal.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        <img
                          src={proposal.freelancer.avatar}
                          alt={proposal.freelancer.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                {proposal.freelancer.name}
                                {proposal.freelancer.isVerified && (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                )}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span>4.8</span>
                                <span>•</span>
                                <span>{proposal.freelancer.expertiseLevel}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-gray-900">
                                {formatBudget(proposal.proposedBudget)}
                              </div>
                              <div className="text-sm text-gray-600">
                                خلال {proposal.deliveryTime} يوم
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-3">{proposal.coverLetter}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">
                              {formatDate(proposal.createdAt)}
                            </span>
                            <div className="flex gap-2">
                              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                عرض الملف الشخصي
                              </button>
                              <button className="px-4 py-2 bg-[#2E86AB] text-white rounded-lg hover:bg-[#1e5f7a]">
                                قبول العرض
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Client Info */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات العميل</h3>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={mockProject.client.avatar}
                  alt={mockProject.client.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    {mockProject.client.name}
                    {mockProject.client.isVerified && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </h4>
                  <p className="text-sm text-gray-600">
                    عضو منذ {formatDate(mockProject.client.joinedAt)}
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">المشاريع المنشورة:</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">معدل التقييم:</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-medium">4.9</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">معدل الاستجابة:</span>
                  <span className="font-medium">95%</span>
                </div>
              </div>
            </div>

            {/* Submit Proposal */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">تقديم عرض</h3>
              
              {!showProposalForm ? (
                <button
                  onClick={() => setShowProposalForm(true)}
                  className="w-full bg-[#2E86AB] text-white py-3 px-4 rounded-lg hover:bg-[#1e5f7a] transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="h-5 w-5" />
                  تقديم عرض للمشروع
                </button>
              ) : (
                <form onSubmit={handleSubmitProposal} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رسالة تقديمية
                    </label>
                    <textarea
                      value={proposalData.coverLetter}
                      onChange={(e) => setProposalData({...proposalData, coverLetter: e.target.value})}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
                      placeholder="اكتب رسالة تقديمية مقنعة..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        نوع العرض
                      </label>
                      <select
                        value={proposalData.budgetType}
                        onChange={(e) => setProposalData({...proposalData, budgetType: e.target.value as 'time' | 'money'})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
                      >
                        <option value="time">مقابل الوقت</option>
                        <option value="money">مقابل المال</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        المبلغ المطلوب
                      </label>
                      <input
                        type="number"
                        value={proposalData.budgetAmount}
                        onChange={(e) => setProposalData({...proposalData, budgetAmount: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
                        placeholder={proposalData.budgetType === 'time' ? 'ساعات' : 'درهم'}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      مدة التسليم (بالأيام)
                    </label>
                    <input
                      type="number"
                      value={proposalData.deliveryTime}
                      onChange={(e) => setProposalData({...proposalData, deliveryTime: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
                      placeholder="عدد الأيام"
                      required
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-[#2E86AB] text-white py-2 px-4 rounded-lg hover:bg-[#1e5f7a] transition-colors"
                    >
                      إرسال العرض
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowProposalForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;

