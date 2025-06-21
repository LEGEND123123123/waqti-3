import React, { useState } from 'react';
import { Project, ProjectCategory } from '../types';
import { Plus, Clock, DollarSign, MapPin, Calendar, FileText, X } from 'lucide-react';

interface CreateProjectPageProps {
  setActivePage: (page: string) => void;
}

const CreateProjectPage: React.FC<CreateProjectPageProps> = ({ setActivePage }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    budgetType: 'time' as 'time' | 'money',
    budgetAmount: '',
    currency: 'AED',
    skills: [] as string[],
    deadline: '',
    location: '',
    isRemote: true,
    urgency: 'medium' as 'low' | 'medium' | 'high',
    attachments: [] as string[]
  });

  const [currentSkill, setCurrentSkill] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // فئات المشاريع
  const categories: ProjectCategory[] = [
    {
      id: 'programming',
      name: 'Programming',
      nameAr: 'البرمجة',
      description: 'Web and mobile development',
      descriptionAr: 'تطوير المواقع والتطبيقات',
      icon: '💻',
      isActive: true,
      subcategories: [
        {
          id: 'web-dev',
          name: 'Web Development',
          nameAr: 'تطوير المواقع',
          description: 'Frontend and backend development',
          descriptionAr: 'تطوير الواجهات الأمامية والخلفية',
          skills: ['React', 'Vue.js', 'Angular', 'Node.js', 'PHP', 'Python'],
          isActive: true
        },
        {
          id: 'mobile-dev',
          name: 'Mobile Development',
          nameAr: 'تطوير التطبيقات',
          description: 'iOS and Android apps',
          descriptionAr: 'تطبيقات iOS و Android',
          skills: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Xamarin'],
          isActive: true
        }
      ]
    },
    {
      id: 'design',
      name: 'Design',
      nameAr: 'التصميم',
      description: 'Graphic and UI/UX design',
      descriptionAr: 'التصميم الجرافيكي وتصميم واجهات المستخدم',
      icon: '🎨',
      isActive: true,
      subcategories: [
        {
          id: 'graphic-design',
          name: 'Graphic Design',
          nameAr: 'التصميم الجرافيكي',
          description: 'Logos, branding, print design',
          descriptionAr: 'الشعارات والهوية البصرية والتصميم المطبوع',
          skills: ['Photoshop', 'Illustrator', 'InDesign', 'Figma', 'Sketch'],
          isActive: true
        },
        {
          id: 'ui-ux',
          name: 'UI/UX Design',
          nameAr: 'تصميم واجهات المستخدم',
          description: 'User interface and experience design',
          descriptionAr: 'تصميم واجهات وتجربة المستخدم',
          skills: ['Figma', 'Sketch', 'Adobe XD', 'Prototyping', 'User Research'],
          isActive: true
        }
      ]
    },
    {
      id: 'writing',
      name: 'Writing',
      nameAr: 'الكتابة',
      description: 'Content writing and copywriting',
      descriptionAr: 'كتابة المحتوى والنصوص التسويقية',
      icon: '✍️',
      isActive: true,
      subcategories: [
        {
          id: 'content-writing',
          name: 'Content Writing',
          nameAr: 'كتابة المحتوى',
          description: 'Blog posts, articles, web content',
          descriptionAr: 'مقالات المدونات والمحتوى الإلكتروني',
          skills: ['SEO Writing', 'Blog Writing', 'Technical Writing', 'Creative Writing'],
          isActive: true
        }
      ]
    },
    {
      id: 'translation',
      name: 'Translation',
      nameAr: 'الترجمة',
      description: 'Language translation services',
      descriptionAr: 'خدمات الترجمة اللغوية',
      icon: '🌐',
      isActive: true,
      subcategories: [
        {
          id: 'document-translation',
          name: 'Document Translation',
          nameAr: 'ترجمة الوثائق',
          description: 'Professional document translation',
          descriptionAr: 'ترجمة الوثائق الاحترافية',
          skills: ['Arabic-English', 'English-Arabic', 'Technical Translation', 'Legal Translation'],
          isActive: true
        }
      ]
    }
  ];

  const cities = [
    'Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'
  ];

  const currencies = ['AED', 'USD', 'EUR'];

  const selectedCategory = categories.find(cat => cat.id === formData.category);
  const availableSkills = selectedCategory?.subcategories
    .find(sub => sub.id === formData.subcategory)?.skills || [];

  const handleAddSkill = () => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, currentSkill.trim()]
      });
      setCurrentSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleAddPredefinedSkill = (skill: string) => {
    if (!formData.skills.includes(skill)) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skill]
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'عنوان المشروع مطلوب';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'وصف المشروع مطلوب';
    }

    if (!formData.category) {
      newErrors.category = 'فئة المشروع مطلوبة';
    }

    if (!formData.budgetAmount) {
      newErrors.budgetAmount = 'الميزانية مطلوبة';
    }

    if (formData.skills.length === 0) {
      newErrors.skills = 'يجب إضافة مهارة واحدة على الأقل';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // هنا سيتم إرسال البيانات إلى الخادم
      console.log('Project data:', formData);
      
      // إعادة توجيه إلى صفحة المشاريع
      setActivePage('projects');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">إنشاء مشروع جديد</h1>
          <p className="text-gray-600">أضف تفاصيل مشروعك واحصل على عروض من أفضل المستقلين</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">المعلومات الأساسية</h2>
            
            <div className="space-y-6">
              {/* Project Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان المشروع *
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

              {/* Project Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف المشروع *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={6}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="اكتب وصفاً مفصلاً للمشروع، المتطلبات، والنتائج المتوقعة..."
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>

              {/* Category and Subcategory */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    فئة المشروع *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value, subcategory: ''})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent ${
                      errors.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">اختر الفئة</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.nameAr}
                      </option>
                    ))}
                  </select>
                  {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    التخصص الفرعي
                  </label>
                  <select
                    value={formData.subcategory}
                    onChange={(e) => setFormData({...formData, subcategory: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
                    disabled={!selectedCategory}
                  >
                    <option value="">اختر التخصص</option>
                    {selectedCategory?.subcategories.map(subcategory => (
                      <option key={subcategory.id} value={subcategory.id}>
                        {subcategory.nameAr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Budget */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">الميزانية</h2>
            
            <div className="space-y-6">
              {/* Budget Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  نوع الميزانية *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="budgetType"
                      value="time"
                      checked={formData.budgetType === 'time'}
                      onChange={(e) => setFormData({...formData, budgetType: e.target.value as 'time' | 'money'})}
                      className="mr-3"
                    />
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-[#2E86AB]" />
                      <div>
                        <div className="font-medium">مقابل الوقت</div>
                        <div className="text-sm text-gray-600">تبادل الخدمات بالساعات</div>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="budgetType"
                      value="money"
                      checked={formData.budgetType === 'money'}
                      onChange={(e) => setFormData({...formData, budgetType: e.target.value as 'time' | 'money'})}
                      className="mr-3"
                    />
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-[#2E86AB]" />
                      <div>
                        <div className="font-medium">مقابل المال</div>
                        <div className="text-sm text-gray-600">دفع مالي للخدمة</div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Budget Amount */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.budgetType === 'time' ? 'عدد الساعات *' : 'المبلغ *'}
                  </label>
                  <input
                    type="number"
                    value={formData.budgetAmount}
                    onChange={(e) => setFormData({...formData, budgetAmount: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent ${
                      errors.budgetAmount ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={formData.budgetType === 'time' ? 'عدد الساعات' : 'المبلغ'}
                    min="1"
                  />
                  {errors.budgetAmount && <p className="mt-1 text-sm text-red-600">{errors.budgetAmount}</p>}
                </div>

                {formData.budgetType === 'money' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      العملة
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({...formData, currency: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
                    >
                      {currencies.map(currency => (
                        <option key={currency} value={currency}>
                          {currency}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">المهارات المطلوبة</h2>
            
            <div className="space-y-4">
              {/* Predefined Skills */}
              {availableSkills.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المهارات المقترحة
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableSkills.map(skill => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleAddPredefinedSkill(skill)}
                        className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                          formData.skills.includes(skill)
                            ? 'bg-[#2E86AB] text-white border-[#2E86AB]'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-[#2E86AB]'
                        }`}
                        disabled={formData.skills.includes(skill)}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  إضافة مهارة مخصصة
                </label>
                <div className="flex gap-2">
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
              </div>

              {/* Selected Skills */}
              {formData.skills.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المهارات المحددة
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map(skill => (
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
                </div>
              )}

              {errors.skills && <p className="text-sm text-red-600">{errors.skills}</p>}
            </div>
          </div>

          {/* Project Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">تفاصيل إضافية</h2>
            
            <div className="space-y-6">
              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  موقع العمل
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isRemote}
                      onChange={(e) => setFormData({...formData, isRemote: e.target.checked})}
                      className="mr-2"
                    />
                    يمكن العمل عن بُعد
                  </label>
                  
                  {!formData.isRemote && (
                    <select
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
                    >
                      <option value="">اختر المدينة</option>
                      {cities.map(city => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Deadline and Urgency */}
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
                    أولوية المشروع
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
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-[#2E86AB] text-white py-3 px-6 rounded-lg hover:bg-[#1e5f7a] transition-colors font-medium"
            >
              نشر المشروع
            </button>
            <button
              type="button"
              onClick={() => setActivePage('projects')}
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

export default CreateProjectPage;

