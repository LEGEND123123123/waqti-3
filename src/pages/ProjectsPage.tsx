import React, { useState } from 'react';
import { Project, ProjectFilter, User } from '../types';
import { Clock, MapPin, DollarSign, Calendar, Users, Filter, Search } from 'lucide-react';

interface ProjectsPageProps {
  onProjectClick?: (projectId: string) => void;
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({ onProjectClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [budgetType, setBudgetType] = useState<'all' | 'time' | 'money'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // بيانات وهمية للمشاريع
  const mockProjects: Project[] = [
    {
      id: '1',
      title: 'تطوير موقع إلكتروني للتجارة الإلكترونية',
      description: 'نحتاج إلى تطوير موقع إلكتروني متكامل للتجارة الإلكترونية باستخدام React و Node.js. الموقع يجب أن يتضمن نظام دفع آمن، إدارة المنتجات، وواجهة مستخدم حديثة.',
      category: 'Programming',
      client: {
        id: 'c1',
        name: 'شركة التقنية المتقدمة',
        email: 'info@techadvanced.com',
        phone: '+971501234567',
        balance: 0,
        joinedAt: new Date('2023-01-01'),
        isVerified: true
      },
      budget: {
        type: 'money',
        amount: 5000,
        currency: 'AED'
      },
      skills: ['React', 'Node.js', 'MongoDB', 'Payment Integration'],
      deadline: new Date('2024-02-15'),
      status: 'open',
      location: 'Dubai',
      isRemote: true,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10'),
      proposals: [],
      urgency: 'high'
    },
    {
      id: '2',
      title: 'تصميم هوية بصرية لشركة ناشئة',
      description: 'نبحث عن مصمم جرافيك محترف لتصميم هوية بصرية متكاملة تشمل الشعار، الألوان، الخطوط، وجميع المواد التسويقية.',
      category: 'Design',
      client: {
        id: 'c2',
        name: 'أحمد محمد',
        email: 'ahmed@startup.com',
        phone: '+971502345678',
        balance: 0,
        joinedAt: new Date('2023-06-15'),
        isVerified: true
      },
      budget: {
        type: 'time',
        amount: 20
      },
      skills: ['Graphic Design', 'Branding', 'Adobe Creative Suite', 'Logo Design'],
      deadline: new Date('2024-01-30'),
      status: 'open',
      location: 'Abu Dhabi',
      isRemote: true,
      createdAt: new Date('2024-01-08'),
      updatedAt: new Date('2024-01-08'),
      proposals: [],
      urgency: 'medium'
    },
    {
      id: '3',
      title: 'ترجمة كتاب من الإنجليزية إلى العربية',
      description: 'لدينا كتاب تقني باللغة الإنجليزية (200 صفحة) ونحتاج إلى ترجمته إلى العربية بدقة عالية مع الحفاظ على المصطلحات التقنية.',
      category: 'Translation',
      client: {
        id: 'c3',
        name: 'دار النشر العربية',
        email: 'info@arabpublishing.com',
        phone: '+971503456789',
        balance: 0,
        joinedAt: new Date('2022-12-01'),
        isVerified: true
      },
      budget: {
        type: 'money',
        amount: 3000,
        currency: 'AED'
      },
      skills: ['Arabic Translation', 'Technical Translation', 'Proofreading'],
      deadline: new Date('2024-03-01'),
      status: 'open',
      location: 'Sharjah',
      isRemote: true,
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-05'),
      proposals: [],
      urgency: 'low'
    },
    {
      id: '4',
      title: 'دروس خصوصية في الرياضيات للثانوية العامة',
      description: 'نبحث عن مدرس رياضيات خبير لتدريس طالب في الصف الثاني عشر. الدروس تكون مرتين في الأسبوع لمدة شهرين.',
      category: 'Teaching',
      client: {
        id: 'c4',
        name: 'فاطمة علي',
        email: 'fatima@email.com',
        phone: '+971504567890',
        balance: 0,
        joinedAt: new Date('2023-09-10'),
        isVerified: true
      },
      budget: {
        type: 'time',
        amount: 16
      },
      skills: ['Mathematics', 'Tutoring', 'High School Level'],
      deadline: new Date('2024-03-15'),
      status: 'open',
      location: 'Dubai',
      isRemote: false,
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-12'),
      proposals: [],
      urgency: 'high'
    }
  ];

  const categories = [
    { id: 'all', name: 'جميع الفئات' },
    { id: 'Programming', name: 'البرمجة' },
    { id: 'Design', name: 'التصميم' },
    { id: 'Translation', name: 'الترجمة' },
    { id: 'Teaching', name: 'التدريس' },
    { id: 'Writing', name: 'الكتابة' },
    { id: 'Marketing', name: 'التسويق' }
  ];

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    const matchesBudgetType = budgetType === 'all' || project.budget.type === budgetType;
    
    return matchesSearch && matchesCategory && matchesBudgetType;
  });

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
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">المشاريع المتاحة</h1>
          <p className="text-gray-600">اعثر على المشاريع التي تناسب مهاراتك وابدأ العمل</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="ابحث في المشاريع..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
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

            {/* Budget Type Filter */}
            <select
              value={budgetType}
              onChange={(e) => setBudgetType(e.target.value as 'all' | 'time' | 'money')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
            >
              <option value="all">جميع أنواع الميزانية</option>
              <option value="time">مقابل الوقت</option>
              <option value="money">مقابل المال</option>
            </select>

            {/* Advanced Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="h-4 w-4" />
              فلاتر متقدمة
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الموقع</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent">
                    <option value="">جميع المواقع</option>
                    <option value="dubai">دبي</option>
                    <option value="abudhabi">أبوظبي</option>
                    <option value="sharjah">الشارقة</option>
                    <option value="remote">عن بُعد</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الأولوية</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent">
                    <option value="">جميع الأولويات</option>
                    <option value="high">عاجل</option>
                    <option value="medium">متوسط</option>
                    <option value="low">عادي</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ النشر</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent">
                    <option value="all">جميع التواريخ</option>
                    <option value="today">اليوم</option>
                    <option value="week">هذا الأسبوع</option>
                    <option value="month">هذا الشهر</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            تم العثور على {filteredProjects.length} مشروع
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map(project => (
            <div
              key={project.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onProjectClick?.(project.id)}
            >
              {/* Project Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {project.client.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(project.createdAt)}
                    </span>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(project.urgency)}`}>
                  {getUrgencyText(project.urgency)}
                </div>
              </div>

              {/* Project Description */}
              <p className="text-gray-700 mb-4 line-clamp-3">
                {project.description}
              </p>

              {/* Skills */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {project.skills.slice(0, 4).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {project.skills.length > 4 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{project.skills.length - 4} المزيد
                    </span>
                  )}
                </div>
              </div>

              {/* Project Details */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    {project.budget.type === 'time' ? (
                      <Clock className="h-4 w-4" />
                    ) : (
                      <DollarSign className="h-4 w-4" />
                    )}
                    {formatBudget(project.budget)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {project.isRemote ? 'عن بُعد' : project.location}
                  </span>
                </div>
                {project.deadline && (
                  <div className="text-sm text-gray-600">
                    الموعد النهائي: {formatDate(project.deadline)}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-4">
                <button className="w-full bg-[#2E86AB] text-white py-2 px-4 rounded-lg hover:bg-[#1e5f7a] transition-colors">
                  عرض التفاصيل وتقديم عرض
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مشاريع</h3>
            <p className="text-gray-600">لم يتم العثور على مشاريع تطابق معايير البحث الخاصة بك</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;

