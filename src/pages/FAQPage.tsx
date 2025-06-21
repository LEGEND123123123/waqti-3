import React, { useState, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  BookOpen,
  HelpCircle,
  Star,
  Filter,
  Tag,
  Clock,
  User,
  Eye,
  Share2,
  Bookmark,
  ExternalLink,
  FileText,
  Video,
  Download,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Grid,
  List,
  Zap,
  TrendingUp
} from 'lucide-react';
import { FAQ, FAQCategory, FAQFeedback, SupportKnowledgeBase } from '../types';

interface FAQPageProps {
  setActivePage: (page: string) => void;
}

const FAQPage: React.FC<FAQPageProps> = ({ setActivePage }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState<'relevance' | 'popularity' | 'recent' | 'helpful'>('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  // بيانات وهمية للفئات
  const [categories] = useState<FAQCategory[]>([
    {
      id: 'getting-started',
      name: 'البدء',
      description: 'كيفية البدء في استخدام المنصة',
      icon: '🚀',
      color: '#3B82F6',
      isActive: true,
      sortOrder: 1,
      faqCount: 12
    },
    {
      id: 'payments',
      name: 'المدفوعات',
      description: 'كل ما يتعلق بالمدفوعات والفواتير',
      icon: '💳',
      color: '#10B981',
      isActive: true,
      sortOrder: 2,
      faqCount: 18
    },
    {
      id: 'projects',
      name: 'المشاريع',
      description: 'إدارة المشاريع والعروض',
      icon: '📋',
      color: '#F59E0B',
      isActive: true,
      sortOrder: 3,
      faqCount: 25
    },
    {
      id: 'freelancers',
      name: 'المستقلون',
      description: 'كل ما يخص المستقلين وملفاتهم الشخصية',
      icon: '👥',
      color: '#8B5CF6',
      isActive: true,
      sortOrder: 4,
      faqCount: 15
    },
    {
      id: 'disputes',
      name: 'النزاعات',
      description: 'حل النزاعات والوساطة',
      icon: '⚖️',
      color: '#EF4444',
      isActive: true,
      sortOrder: 5,
      faqCount: 8
    },
    {
      id: 'technical',
      name: 'المساعدة التقنية',
      description: 'المشاكل التقنية والحلول',
      icon: '🔧',
      color: '#6B7280',
      isActive: true,
      sortOrder: 6,
      faqCount: 22
    }
  ]);

  // بيانات وهمية للأسئلة الشائعة
  const [faqs] = useState<FAQ[]>([
    {
      id: '1',
      question: 'كيف يمكنني إنشاء حساب جديد؟',
      answer: 'يمكنك إنشاء حساب جديد بسهولة من خلال النقر على زر "إنشاء حساب" في الصفحة الرئيسية. ستحتاج إلى تقديم عنوان بريد إلكتروني صالح ورقم هاتف للتحقق. بعد التسجيل، ستتلقى رسالة تأكيد عبر البريد الإلكتروني لتفعيل حسابك.',
      category: categories[0],
      tags: ['تسجيل', 'حساب جديد', 'بداية'],
      isPublished: true,
      isPinned: true,
      viewCount: 1250,
      helpfulCount: 980,
      notHelpfulCount: 45,
      relatedFAQs: ['2', '3'],
      attachments: [],
      metadata: {
        difficulty: 'beginner',
        estimatedReadTime: 2,
        lastReviewed: new Date(),
        reviewedBy: 'admin'
      },
      searchKeywords: ['تسجيل', 'حساب', 'إنشاء', 'بداية'],
      createdBy: 'admin',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)
    },
    {
      id: '2',
      question: 'كيف يتم الدفع في المنصة؟',
      answer: 'نوفر عدة طرق دفع آمنة ومريحة:\n\n1. **البطاقات الائتمانية**: Visa, Mastercard, American Express\n2. **المحافظ الرقمية**: PayPal, Apple Pay, Google Pay\n3. **التحويل البنكي**: للمبالغ الكبيرة\n4. **العملات المشفرة**: Bitcoin, Ethereum (قريباً)\n\nجميع المدفوعات محمية بتشفير SSL ونظام الضمان الآمن.',
      category: categories[1],
      tags: ['دفع', 'بطاقة ائتمان', 'أمان', 'ضمان'],
      isPublished: true,
      isPinned: true,
      viewCount: 2100,
      helpfulCount: 1850,
      notHelpfulCount: 120,
      relatedFAQs: ['5', '6'],
      attachments: [],
      metadata: {
        difficulty: 'beginner',
        estimatedReadTime: 3,
        lastReviewed: new Date(),
        reviewedBy: 'admin'
      },
      searchKeywords: ['دفع', 'بطاقة', 'أمان', 'ضمان', 'paypal'],
      createdBy: 'admin',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25)
    },
    {
      id: '3',
      question: 'ما هو نظام تبادل الوقت مقابل الخدمة؟',
      answer: 'نظام تبادل الوقت هو ميزة فريدة في منصتنا تتيح للمستخدمين تبادل الخدمات دون استخدام المال. بدلاً من ذلك، يمكنك:\n\n• **تقديم خدمة**: مقابل ساعات من وقتك\n• **الحصول على خدمة**: باستخدام الساعات المتراكمة لديك\n• **بناء شبكة**: من العلاقات المهنية والشخصية\n\nمثال: إذا قدمت 5 ساعات من التصميم، يمكنك الحصول على 5 ساعات من البرمجة من مستقل آخر.',
      category: categories[2],
      tags: ['تبادل وقت', 'نظام فريد', 'ساعات', 'مقايضة'],
      isPublished: true,
      isPinned: true,
      viewCount: 3200,
      helpfulCount: 2800,
      notHelpfulCount: 180,
      relatedFAQs: ['4', '7'],
      attachments: [],
      metadata: {
        difficulty: 'intermediate',
        estimatedReadTime: 4,
        lastReviewed: new Date(),
        reviewedBy: 'admin'
      },
      searchKeywords: ['تبادل', 'وقت', 'ساعات', 'مقايضة', 'خدمة'],
      createdBy: 'admin',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20)
    },
    {
      id: '4',
      question: 'كيف أختار المستقل المناسب لمشروعي؟',
      answer: 'اختيار المستقل المناسب أمر مهم لنجاح مشروعك. إليك أهم النصائح:\n\n**1. راجع الملف الشخصي:**\n• التقييمات والمراجعات\n• معرض الأعمال السابقة\n• المهارات والخبرات\n• معدل الاستجابة\n\n**2. تحقق من التوافق:**\n• الميزانية والجدول الزمني\n• أسلوب التواصل\n• فهم المتطلبات\n\n**3. ابدأ بمشروع صغير:**\n• اختبر جودة العمل\n• قيم الالتزام بالمواعيد\n• تأكد من التواصل الفعال',
      category: categories[3],
      tags: ['اختيار مستقل', 'تقييم', 'مشروع', 'نصائح'],
      isPublished: true,
      isPinned: false,
      viewCount: 1800,
      helpfulCount: 1600,
      notHelpfulCount: 95,
      relatedFAQs: ['3', '8'],
      attachments: [],
      metadata: {
        difficulty: 'intermediate',
        estimatedReadTime: 5,
        lastReviewed: new Date(),
        reviewedBy: 'admin'
      },
      searchKeywords: ['اختيار', 'مستقل', 'تقييم', 'مشروع', 'نصائح'],
      createdBy: 'admin',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15)
    },
    {
      id: '5',
      question: 'ماذا أفعل في حالة وجود نزاع؟',
      answer: 'في حالة وجود نزاع، نوفر نظام وساطة متقدم لحل المشاكل:\n\n**خطوات حل النزاع:**\n\n1. **التواصل المباشر**: حاول حل المشكلة مع الطرف الآخر أولاً\n2. **فتح نزاع**: إذا لم يتم الحل، افتح نزاع رسمي\n3. **تقديم الأدلة**: أرفق جميع الوثائق والمراسلات\n4. **الوساطة**: سيتدخل فريق الوساطة لدينا\n5. **القرار النهائي**: سيتم اتخاذ قرار عادل خلال 5-7 أيام\n\n**نصائح لتجنب النزاعات:**\n• وضع متطلبات واضحة\n• التواصل المستمر\n• توثيق كل شيء\n• استخدام نظام الضمان',
      category: categories[4],
      tags: ['نزاع', 'وساطة', 'حل مشاكل', 'ضمان'],
      isPublished: true,
      isPinned: false,
      viewCount: 950,
      helpfulCount: 820,
      notHelpfulCount: 65,
      relatedFAQs: ['2', '6'],
      attachments: [],
      metadata: {
        difficulty: 'advanced',
        estimatedReadTime: 6,
        lastReviewed: new Date(),
        reviewedBy: 'admin'
      },
      searchKeywords: ['نزاع', 'وساطة', 'مشكلة', 'حل', 'ضمان'],
      createdBy: 'admin',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10)
    }
  ]);

  // بيانات وهمية لقاعدة المعرفة
  const [knowledgeBase] = useState<SupportKnowledgeBase[]>([
    {
      id: '1',
      title: 'دليل المبتدئين الشامل',
      content: 'دليل شامل للمبتدئين في استخدام المنصة...',
      summary: 'تعلم كيفية استخدام جميع ميزات المنصة خطوة بخطوة',
      category: 'getting-started',
      tags: ['دليل', 'مبتدئين', 'شامل'],
      difficulty: 'beginner',
      type: 'guide',
      status: 'published',
      isPublic: true,
      viewCount: 5200,
      rating: 4.8,
      ratingCount: 320,
      estimatedReadTime: 15,
      attachments: [],
      relatedArticles: ['2', '3'],
      prerequisites: [],
      lastReviewed: new Date(),
      reviewedBy: 'admin',
      createdBy: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: new Date()
    }
  ]);

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = !searchTerm || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || faq.category.id === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || faq.metadata.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty && faq.isPublished;
  });

  const sortedFAQs = [...filteredFAQs].sort((a, b) => {
    switch (sortBy) {
      case 'popularity':
        return b.viewCount - a.viewCount;
      case 'recent':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case 'helpful':
        return (b.helpfulCount / (b.helpfulCount + b.notHelpfulCount)) - 
               (a.helpfulCount / (a.helpfulCount + a.notHelpfulCount));
      default:
        return a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1;
    }
  });

  const handleFAQFeedback = (faqId: string, isHelpful: boolean) => {
    // هنا يمكن إرسال التقييم إلى الخادم
    console.log(`FAQ ${faqId} marked as ${isHelpful ? 'helpful' : 'not helpful'}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'مبتدئ';
      case 'intermediate': return 'متوسط';
      case 'advanced': return 'متقدم';
      default: return difficulty;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-[#2E86AB] rounded-full">
              <HelpCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">الأسئلة الشائعة</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ابحث عن إجابات للأسئلة الأكثر شيوعاً أو تصفح الفئات للعثور على ما تحتاجه
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
            <input
              type="text"
              placeholder="ابحث في الأسئلة الشائعة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent shadow-sm"
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-[#2E86AB] mb-2">
              {faqs.filter(f => f.isPublished).length}
            </div>
            <div className="text-gray-600">سؤال وجواب</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {categories.length}
            </div>
            <div className="text-gray-600">فئة</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {knowledgeBase.length}
            </div>
            <div className="text-gray-600">مقال مساعدة</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {Math.round(faqs.reduce((acc, faq) => acc + (faq.helpfulCount / (faq.helpfulCount + faq.notHelpfulCount)), 0) / faqs.length * 100)}%
            </div>
            <div className="text-gray-600">معدل الرضا</div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">تصفح حسب الفئة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-6 rounded-xl border-2 transition-all text-right hover:shadow-lg ${
                  selectedCategory === category.id
                    ? 'border-[#2E86AB] bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-3xl">{category.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{category.faqCount} سؤال</span>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="h-4 w-4" />
                فلاتر
              </button>
              
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
              >
                <option value="all">جميع المستويات</option>
                <option value="beginner">مبتدئ</option>
                <option value="intermediate">متوسط</option>
                <option value="advanced">متقدم</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
              >
                <option value="relevance">الأكثر صلة</option>
                <option value="popularity">الأكثر شعبية</option>
                <option value="recent">الأحدث</option>
                <option value="helpful">الأكثر فائدة</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {filteredFAQs.length} من {faqs.length} سؤال
              </span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-[#2E86AB] text-white' : 'text-gray-500'}`}
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-[#2E86AB] text-white' : 'text-gray-500'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الفئة</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
                  >
                    <option value="all">جميع الفئات</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">وقت القراءة</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent">
                    <option value="all">أي مدة</option>
                    <option value="quick">سريع (أقل من 3 دقائق)</option>
                    <option value="medium">متوسط (3-7 دقائق)</option>
                    <option value="long">طويل (أكثر من 7 دقائق)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">التقييم</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent">
                    <option value="all">جميع التقييمات</option>
                    <option value="high">عالي (أكثر من 90%)</option>
                    <option value="medium">متوسط (70-90%)</option>
                    <option value="low">منخفض (أقل من 70%)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FAQs List */}
        <div className="space-y-4">
          {sortedFAQs.map(faq => (
            <div key={faq.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <button
                onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                className="w-full p-6 text-right hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {faq.isPinned && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          مثبت
                        </span>
                      )}
                      <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(faq.metadata.difficulty)}`}>
                        {getDifficultyText(faq.metadata.difficulty)}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {faq.metadata.estimatedReadTime} دقيقة
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {faq.viewCount.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        {Math.round((faq.helpfulCount / (faq.helpfulCount + faq.notHelpfulCount)) * 100)}%
                      </span>
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                        {faq.category.name}
                      </span>
                    </div>
                  </div>
                  <div className="mr-4">
                    {expandedFAQ === faq.id ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </button>

              {expandedFAQ === faq.id && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="prose prose-lg max-w-none text-gray-700 mb-6">
                    {faq.answer.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {faq.tags.length > 0 && (
                    <div className="flex items-center gap-2 mb-4">
                      <Tag className="h-4 w-4 text-gray-400" />
                      <div className="flex flex-wrap gap-2">
                        {faq.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">هل كانت هذه الإجابة مفيدة؟</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleFAQFeedback(faq.id, true)}
                          className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <ThumbsUp className="h-4 w-4" />
                          نعم ({faq.helpfulCount})
                        </button>
                        <button
                          onClick={() => handleFAQFeedback(faq.id, false)}
                          className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <ThumbsDown className="h-4 w-4" />
                          لا ({faq.notHelpfulCount})
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
                        <Share2 className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
                        <Bookmark className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {faq.relatedFAQs.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">أسئلة ذات صلة:</h4>
                      <div className="space-y-2">
                        {faq.relatedFAQs.slice(0, 3).map(relatedId => {
                          const relatedFAQ = faqs.find(f => f.id === relatedId);
                          return relatedFAQ ? (
                            <button
                              key={relatedId}
                              onClick={() => setExpandedFAQ(relatedId)}
                              className="block w-full text-right p-3 text-sm text-[#2E86AB] hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              {relatedFAQ.question}
                            </button>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">لم نجد أي نتائج</h3>
            <p className="text-gray-600 mb-6">جرب تغيير كلمات البحث أو الفلاتر</p>
            <button
              onClick={() => setActivePage('support')}
              className="px-6 py-3 bg-[#2E86AB] text-white rounded-lg hover:bg-[#1e5f7a] transition-colors"
            >
              تواصل مع الدعم
            </button>
          </div>
        )}

        {/* Knowledge Base Section */}
        {knowledgeBase.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">مقالات مفيدة</h2>
              <button className="text-[#2E86AB] hover:text-[#1e5f7a] font-medium">
                عرض الكل
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {knowledgeBase.slice(0, 3).map(article => (
                <div key={article.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="h-5 w-5 text-[#2E86AB]" />
                    <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(article.difficulty)}`}>
                      {getDifficultyText(article.difficulty)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h3>
                  <p className="text-gray-600 mb-4">{article.summary}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {article.estimatedReadTime} دقيقة
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400" />
                      {article.rating}
                    </span>
                  </div>
                  <button className="w-full px-4 py-2 bg-[#2E86AB] text-white rounded-lg hover:bg-[#1e5f7a] transition-colors">
                    قراءة المقال
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Support */}
        <div className="mt-12 bg-gradient-to-r from-[#2E86AB] to-[#1e5f7a] rounded-xl p-8 text-center text-white">
          <MessageCircle className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">لم تجد ما تبحث عنه؟</h2>
          <p className="text-lg mb-6 opacity-90">
            فريق الدعم لدينا متاح على مدار الساعة لمساعدتك
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setActivePage('support')}
              className="px-6 py-3 bg-white text-[#2E86AB] rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              تواصل مع الدعم
            </button>
            <button className="px-6 py-3 border border-white text-white rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors font-medium">
              دردشة مباشرة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;

