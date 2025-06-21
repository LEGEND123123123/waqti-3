import React, { useState } from 'react';
import { 
  FreelancerProfile, 
  FreelancerStats, 
  FreelancerSkill, 
  FreelancerBadge, 
  PortfolioItem, 
  FreelancerReview,
  WorkExperience,
  Education,
  Certification,
  User 
} from '../types';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Star, 
  CheckCircle, 
  Award, 
  DollarSign, 
  Users, 
  TrendingUp,
  Calendar,
  Globe,
  MessageSquare,
  Heart,
  Share2,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Certificate,
  Eye,
  ThumbsUp
} from 'lucide-react';

interface FreelancerDetailPageProps {
  freelancerId: string;
  setActivePage: (page: string) => void;
  goBack: () => void;
}

const FreelancerDetailPage: React.FC<FreelancerDetailPageProps> = ({ freelancerId, setActivePage, goBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showContactForm, setShowContactForm] = useState(false);

  // بيانات وهمية مفصلة للمستقل
  const mockFreelancer = {
    profile: {
      id: freelancerId,
      userId: 'u1',
      title: 'مطور ويب محترف متخصص في React و Node.js',
      bio: 'مطور ويب خبير مع أكثر من 5 سنوات من الخبرة في تطوير تطبيقات الويب الحديثة. متخصص في React، Node.js، وقواعد البيانات. أقدم حلول تقنية مبتكرة وعالية الجودة تلبي احتياجات العملاء وتتجاوز توقعاتهم.\n\nأعمل مع الشركات الناشئة والمؤسسات الكبيرة لتطوير تطبيقات ويب قابلة للتطوير وسهلة الاستخدام. أؤمن بأهمية التواصل المستمر مع العملاء وتسليم المشاريع في الوقت المحدد.',
      hourlyRate: {
        time: 2,
        money: 150,
        currency: 'AED' as const
      },
      availability: 'available' as const,
      responseTime: 2,
      completionRate: 98,
      onTimeDelivery: 95,
      totalEarnings: {
        time: 450,
        money: 25000,
        currency: 'AED' as const
      },
      languages: [
        { language: 'العربية', proficiency: 'native' as const },
        { language: 'English', proficiency: 'fluent' as const }
      ],
      location: {
        country: 'UAE',
        city: 'Dubai',
        timezone: 'Asia/Dubai'
      },
      workingHours: {
        start: '09:00',
        end: '18:00',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const
      },
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date('2024-01-15')
    } as FreelancerProfile,
    user: {
      id: 'u1',
      name: 'أحمد حسن',
      email: 'ahmed@example.com',
      phone: '+971501234567',
      balance: 8,
      joinedAt: new Date('2023-01-15'),
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      isVerified: true,
      expertiseLevel: 'expert' as const
    } as User,
    stats: {
      totalProjects: 47,
      completedProjects: 45,
      activeProjects: 2,
      totalClients: 32,
      repeatClients: 18,
      averageRating: 4.9,
      totalReviews: 43,
      responseTime: 2,
      completionRate: 98,
      onTimeDelivery: 95,
      totalEarnings: {
        time: 450,
        money: 25000,
        currency: 'AED' as const
      },
      monthlyEarnings: {
        time: 35,
        money: 3200,
        currency: 'AED' as const
      },
      joinDate: new Date('2023-01-15'),
      lastActive: new Date()
    } as FreelancerStats,
    skills: [
      { id: 's1', name: 'React', category: 'Frontend', level: 'expert' as const, yearsOfExperience: 5, isVerified: true, endorsements: [] },
      { id: 's2', name: 'Node.js', category: 'Backend', level: 'expert' as const, yearsOfExperience: 4, isVerified: true, endorsements: [] },
      { id: 's3', name: 'TypeScript', category: 'Programming', level: 'advanced' as const, yearsOfExperience: 3, isVerified: false, endorsements: [] },
      { id: 's4', name: 'MongoDB', category: 'Database', level: 'advanced' as const, yearsOfExperience: 4, isVerified: true, endorsements: [] },
      { id: 's5', name: 'AWS', category: 'Cloud', level: 'intermediate' as const, yearsOfExperience: 2, isVerified: false, endorsements: [] }
    ] as FreelancerSkill[],
    badges: [
      { id: 'b1', name: 'Top Rated', description: 'أفضل المقيمين', icon: '⭐', color: 'gold', criteria: 'تقييم 4.8+', isActive: true, earnedAt: new Date('2023-06-01') },
      { id: 'b2', name: 'Fast Responder', description: 'سريع الاستجابة', icon: '⚡', color: 'blue', criteria: 'استجابة خلال ساعتين', isActive: true, earnedAt: new Date('2023-08-15') },
      { id: 'b3', name: 'Reliable', description: 'موثوق', icon: '🛡️', color: 'green', criteria: 'معدل إنجاز 98%+', isActive: true, earnedAt: new Date('2023-10-20') }
    ] as FreelancerBadge[],
    portfolio: [
      {
        id: 'p1',
        freelancerId: freelancerId,
        title: 'منصة التجارة الإلكترونية - متجر الأزياء',
        description: 'تطوير منصة تجارة إلكترونية متكاملة للأزياء مع نظام إدارة المخزون ونظام دفع آمن',
        category: 'E-commerce',
        skills: ['React', 'Node.js', 'MongoDB', 'Stripe'],
        images: ['https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg'],
        liveUrl: 'https://fashion-store-demo.com',
        completionDate: new Date('2023-12-15'),
        client: {
          name: 'شركة الأزياء العصرية',
          testimonial: 'عمل ممتاز وتسليم في الوقت المحدد',
          rating: 5
        },
        isPublic: true,
        isFeatured: true,
        createdAt: new Date('2023-12-15'),
        updatedAt: new Date('2023-12-15')
      },
      {
        id: 'p2',
        freelancerId: freelancerId,
        title: 'تطبيق إدارة المشاريع',
        description: 'تطبيق ويب لإدارة المشاريع والفرق مع ميزات التعاون والتتبع',
        category: 'Project Management',
        skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
        images: ['https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg'],
        completionDate: new Date('2023-10-20'),
        client: {
          name: 'شركة التقنية المتقدمة',
          testimonial: 'حل مبتكر وفعال',
          rating: 5
        },
        isPublic: true,
        isFeatured: false,
        createdAt: new Date('2023-10-20'),
        updatedAt: new Date('2023-10-20')
      }
    ] as PortfolioItem[],
    experience: [
      {
        id: 'e1',
        freelancerId: freelancerId,
        title: 'مطور ويب أول',
        company: 'شركة التقنيات الذكية',
        location: 'دبي، الإمارات',
        startDate: new Date('2021-03-01'),
        endDate: new Date('2023-01-15'),
        isCurrent: false,
        description: 'قيادة فريق تطوير الواجهات الأمامية وتطوير تطبيقات ويب معقدة',
        achievements: [
          'تطوير 15+ تطبيق ويب ناجح',
          'تحسين أداء التطبيقات بنسبة 40%',
          'قيادة فريق من 5 مطورين'
        ],
        skills: ['React', 'Vue.js', 'Node.js', 'MongoDB']
      },
      {
        id: 'e2',
        freelancerId: freelancerId,
        title: 'مطور ويب',
        company: 'استوديو الإبداع الرقمي',
        location: 'أبوظبي، الإمارات',
        startDate: new Date('2019-06-01'),
        endDate: new Date('2021-02-28'),
        isCurrent: false,
        description: 'تطوير مواقع ويب تفاعلية وتطبيقات ويب للعملاء',
        achievements: [
          'تطوير 25+ موقع ويب',
          'تحقيق رضا العملاء بنسبة 95%'
        ],
        skills: ['JavaScript', 'PHP', 'MySQL', 'WordPress']
      }
    ] as WorkExperience[],
    education: [
      {
        id: 'ed1',
        freelancerId: freelancerId,
        degree: 'بكالوريوس علوم الحاسوب',
        institution: 'جامعة الإمارات العربية المتحدة',
        fieldOfStudy: 'علوم الحاسوب',
        startDate: new Date('2015-09-01'),
        endDate: new Date('2019-06-01'),
        isCurrent: false,
        grade: 'امتياز',
        description: 'تخصص في هندسة البرمجيات وقواعد البيانات'
      }
    ] as Education[],
    certifications: [
      {
        id: 'c1',
        freelancerId: freelancerId,
        name: 'AWS Certified Developer',
        issuingOrganization: 'Amazon Web Services',
        issueDate: new Date('2023-08-15'),
        expirationDate: new Date('2026-08-15'),
        credentialId: 'AWS-DEV-2023-001',
        skills: ['AWS', 'Cloud Computing', 'Lambda'],
        isVerified: true
      },
      {
        id: 'c2',
        freelancerId: freelancerId,
        name: 'React Developer Certification',
        issuingOrganization: 'Meta',
        issueDate: new Date('2023-05-20'),
        skills: ['React', 'JavaScript', 'Frontend'],
        isVerified: true
      }
    ] as Certification[],
    reviews: [
      {
        id: 'r1',
        projectId: 'proj1',
        clientId: 'client1',
        freelancerId: freelancerId,
        rating: 5,
        title: 'عمل ممتاز ومحترف',
        comment: 'أحمد مطور محترف جداً، سلم المشروع في الوقت المحدد وبجودة عالية. التواصل كان ممتاز طوال فترة المشروع.',
        pros: ['جودة عالية', 'تسليم في الوقت', 'تواصل ممتاز'],
        cons: [],
        wouldRecommend: true,
        isPublic: true,
        isVerified: true,
        createdAt: new Date('2023-12-20'),
        updatedAt: new Date('2023-12-20'),
        freelancerResponse: {
          comment: 'شكراً لك على التقييم الرائع! كان من دواعي سروري العمل معك.',
          createdAt: new Date('2023-12-21')
        }
      },
      {
        id: 'r2',
        serviceId: 'serv1',
        clientId: 'client2',
        freelancerId: freelancerId,
        rating: 5,
        title: 'خبرة تقنية عالية',
        comment: 'حل مشكلة تقنية معقدة بطريقة مبتكرة. أنصح بالتعامل معه.',
        pros: ['خبرة تقنية', 'حلول مبتكرة', 'سرعة في الإنجاز'],
        cons: [],
        wouldRecommend: true,
        isPublic: true,
        isVerified: true,
        createdAt: new Date('2023-11-15'),
        updatedAt: new Date('2023-11-15')
      }
    ] as FreelancerReview[]
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'text-green-600 bg-green-100';
      case 'busy': return 'text-yellow-600 bg-yellow-100';
      case 'unavailable': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'available': return 'متاح للعمل';
      case 'busy': return 'مشغول حالياً';
      case 'unavailable': return 'غير متاح';
      default: return 'غير محدد';
    }
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'expert': return 'bg-purple-100 text-purple-800';
      case 'advanced': return 'bg-blue-100 text-blue-800';
      case 'intermediate': return 'bg-green-100 text-green-800';
      case 'beginner': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSkillLevelText = (level: string) => {
    switch (level) {
      case 'expert': return 'خبير';
      case 'advanced': return 'متقدم';
      case 'intermediate': return 'متوسط';
      case 'beginner': return 'مبتدئ';
      default: return 'غير محدد';
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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ar-AE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const formatDateShort = (date: Date) => {
    return new Intl.DateTimeFormat('ar-AE', {
      year: 'numeric',
      month: 'short'
    }).format(date);
  };

  const tabs = [
    { id: 'overview', name: 'نظرة عامة', icon: Eye },
    { id: 'portfolio', name: 'معرض الأعمال', icon: Briefcase },
    { id: 'reviews', name: 'التقييمات', icon: Star },
    { id: 'experience', name: 'الخبرة', icon: Briefcase },
    { id: 'education', name: 'التعليم', icon: GraduationCap }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-[#2E86AB] hover:text-[#1e5f7a] mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          العودة إلى المستقلين
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-start gap-6 mb-6">
                <div className="relative">
                  <img
                    src={mockFreelancer.user.avatar}
                    alt={mockFreelancer.user.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  {mockFreelancer.user.isVerified && (
                    <CheckCircle className="absolute -bottom-2 -right-2 h-6 w-6 text-green-500 bg-white rounded-full" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {mockFreelancer.user.name}
                    </h1>
                    <div className="flex gap-2">
                      <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                        <Heart className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                        <Share2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-lg text-gray-700 mb-3">
                    {mockFreelancer.profile.title}
                  </p>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1">
                      {renderStars(mockFreelancer.stats.averageRating)}
                      <span className="font-medium text-gray-900 ml-1">
                        {mockFreelancer.stats.averageRating}
                      </span>
                      <span className="text-gray-600">
                        ({mockFreelancer.stats.totalReviews} تقييم)
                      </span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">
                      {mockFreelancer.stats.completedProjects} مشروع مكتمل
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {mockFreelancer.profile.location.city}, {mockFreelancer.profile.location.country}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      يستجيب خلال {mockFreelancer.profile.responseTime} ساعة
                    </span>
                    <span className="flex items-center gap-1">
                      <Globe className="h-4 w-4" />
                      {mockFreelancer.profile.languages.map(lang => lang.language).join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {mockFreelancer.badges.map(badge => (
                  <span
                    key={badge.id}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full"
                  >
                    <span>{badge.icon}</span>
                    {badge.name}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{mockFreelancer.stats.completionRate}%</div>
                  <div className="text-sm text-gray-600">معدل الإنجاز</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{mockFreelancer.stats.onTimeDelivery}%</div>
                  <div className="text-sm text-gray-600">التسليم في الوقت</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{mockFreelancer.stats.repeatClients}</div>
                  <div className="text-sm text-gray-600">عملاء متكررون</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{mockFreelancer.profile.responseTime}س</div>
                  <div className="text-sm text-gray-600">وقت الاستجابة</div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                          activeTab === tab.id
                            ? 'border-[#2E86AB] text-[#2E86AB]'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {tab.name}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Bio */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">نبذة شخصية</h3>
                      <div className="prose prose-gray max-w-none">
                        <p className="text-gray-700 whitespace-pre-line">
                          {mockFreelancer.profile.bio}
                        </p>
                      </div>
                    </div>

                    {/* Skills */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">المهارات</h3>
                      <div className="space-y-3">
                        {mockFreelancer.skills.map(skill => (
                          <div key={skill.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <div className="flex items-center gap-3">
                              <span className="font-medium text-gray-900">{skill.name}</span>
                              {skill.isVerified && (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                              <span className={`px-2 py-1 text-xs rounded-full ${getSkillLevelColor(skill.level)}`}>
                                {getSkillLevelText(skill.level)}
                              </span>
                            </div>
                            <span className="text-sm text-gray-600">
                              {skill.yearsOfExperience} سنوات خبرة
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Languages */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">اللغات</h3>
                      <div className="flex flex-wrap gap-2">
                        {mockFreelancer.profile.languages.map((lang, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                          >
                            {lang.language} ({lang.proficiency === 'native' ? 'لغة أم' : 
                             lang.proficiency === 'fluent' ? 'طلاقة' :
                             lang.proficiency === 'conversational' ? 'محادثة' : 'أساسي'})
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Portfolio Tab */}
                {activeTab === 'portfolio' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">معرض الأعمال</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {mockFreelancer.portfolio.map(item => (
                        <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                              {item.description}
                            </p>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {item.skills.map(skill => (
                                <span
                                  key={skill}
                                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-500">
                                {formatDateShort(item.completionDate)}
                              </span>
                              {item.liveUrl && (
                                <a
                                  href={item.liveUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-[#2E86AB] hover:text-[#1e5f7a] text-sm"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  عرض المشروع
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900">التقييمات</h3>
                      <div className="text-sm text-gray-600">
                        {mockFreelancer.reviews.length} تقييم
                      </div>
                    </div>
                    <div className="space-y-4">
                      {mockFreelancer.reviews.map(review => (
                        <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                {renderStars(review.rating)}
                                <span className="font-medium text-gray-900">{review.rating}/5</span>
                              </div>
                              <h4 className="font-medium text-gray-900">{review.title}</h4>
                            </div>
                            <span className="text-sm text-gray-500">
                              {formatDate(review.createdAt)}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-3">{review.comment}</p>
                          {review.pros.length > 0 && (
                            <div className="mb-3">
                              <span className="text-sm font-medium text-green-700">الإيجابيات:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {review.pros.map((pro, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                                  >
                                    {pro}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {review.freelancerResponse && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-medium text-gray-900">رد المستقل:</span>
                                <span className="text-xs text-gray-500">
                                  {formatDate(review.freelancerResponse.createdAt)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">{review.freelancerResponse.comment}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Experience Tab */}
                {activeTab === 'experience' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">الخبرة العملية</h3>
                    <div className="space-y-4">
                      {mockFreelancer.experience.map(exp => (
                        <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">{exp.title}</h4>
                              <p className="text-gray-700">{exp.company}</p>
                              <p className="text-sm text-gray-600">{exp.location}</p>
                            </div>
                            <span className="text-sm text-gray-500">
                              {formatDateShort(exp.startDate)} - {exp.isCurrent ? 'الآن' : formatDateShort(exp.endDate!)}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-3">{exp.description}</p>
                          {exp.achievements.length > 0 && (
                            <div className="mb-3">
                              <span className="text-sm font-medium text-gray-900">الإنجازات:</span>
                              <ul className="list-disc list-inside mt-1 text-sm text-gray-700">
                                {exp.achievements.map((achievement, index) => (
                                  <li key={index}>{achievement}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          <div className="flex flex-wrap gap-1">
                            {exp.skills.map(skill => (
                              <span
                                key={skill}
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education Tab */}
                {activeTab === 'education' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">التعليم والشهادات</h3>
                    
                    {/* Education */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">التعليم</h4>
                      <div className="space-y-4">
                        {mockFreelancer.education.map(edu => (
                          <div key={edu.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h5 className="font-semibold text-gray-900">{edu.degree}</h5>
                                <p className="text-gray-700">{edu.institution}</p>
                                <p className="text-sm text-gray-600">{edu.fieldOfStudy}</p>
                                {edu.grade && (
                                  <p className="text-sm text-gray-600">التقدير: {edu.grade}</p>
                                )}
                              </div>
                              <span className="text-sm text-gray-500">
                                {formatDateShort(edu.startDate)} - {edu.isCurrent ? 'الآن' : formatDateShort(edu.endDate!)}
                              </span>
                            </div>
                            {edu.description && (
                              <p className="text-gray-700">{edu.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Certifications */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">الشهادات</h4>
                      <div className="space-y-4">
                        {mockFreelancer.certifications.map(cert => (
                          <div key={cert.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h5 className="font-semibold text-gray-900">{cert.name}</h5>
                                  {cert.isVerified && (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  )}
                                </div>
                                <p className="text-gray-700">{cert.issuingOrganization}</p>
                                {cert.credentialId && (
                                  <p className="text-sm text-gray-600">رقم الشهادة: {cert.credentialId}</p>
                                )}
                              </div>
                              <div className="text-right text-sm text-gray-500">
                                <div>تاريخ الإصدار: {formatDateShort(cert.issueDate)}</div>
                                {cert.expirationDate && (
                                  <div>تاريخ الانتهاء: {formatDateShort(cert.expirationDate)}</div>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {cert.skills.map(skill => (
                                <span
                                  key={skill}
                                  className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Availability and Contact */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 ${getAvailabilityColor(mockFreelancer.profile.availability)}`}>
                <div className="w-2 h-2 rounded-full bg-current"></div>
                {getAvailabilityText(mockFreelancer.profile.availability)}
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">السعر بالساعة:</span>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {mockFreelancer.profile.hourlyRate.time} ساعة
                    </div>
                    <div className="text-sm text-gray-600">
                      أو {mockFreelancer.profile.hourlyRate.money} {mockFreelancer.profile.hourlyRate.currency}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">وقت الاستجابة:</span>
                  <span className="font-medium">{mockFreelancer.profile.responseTime} ساعة</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ساعات العمل:</span>
                  <span className="font-medium">
                    {mockFreelancer.profile.workingHours.start} - {mockFreelancer.profile.workingHours.end}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setShowContactForm(true)}
                  className="w-full bg-[#2E86AB] text-white py-3 px-4 rounded-lg hover:bg-[#1e5f7a] transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare className="h-5 w-5" />
                  تواصل مع المستقل
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                  دعوة لمشروع
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">إحصائيات سريعة</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">عضو منذ:</span>
                  <span className="font-medium">{formatDateShort(mockFreelancer.stats.joinDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">آخر نشاط:</span>
                  <span className="font-medium text-green-600">متصل الآن</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">إجمالي الأرباح:</span>
                  <div className="text-right">
                    <div className="font-medium">{mockFreelancer.stats.totalEarnings.time} ساعة</div>
                    <div className="text-sm text-gray-600">
                      {mockFreelancer.stats.totalEarnings.money} {mockFreelancer.stats.totalEarnings.currency}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">العملاء المتكررون:</span>
                  <span className="font-medium">{Math.round((mockFreelancer.stats.repeatClients / mockFreelancer.stats.totalClients) * 100)}%</span>
                </div>
              </div>
            </div>

            {/* Similar Freelancers */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">مستقلون مشابهون</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <img
                    src="https://randomuser.me/api/portraits/women/25.jpg"
                    alt="مريم أحمد"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm">مريم أحمد</p>
                    <p className="text-xs text-gray-600 truncate">مطورة React</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600">4.8</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <img
                    src="https://randomuser.me/api/portraits/men/15.jpg"
                    alt="خالد سالم"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm">خالد سالم</p>
                    <p className="text-xs text-gray-600 truncate">مطور Full Stack</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600">4.7</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Modal */}
        {showContactForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">تواصل مع {mockFreelancer.user.name}</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الموضوع</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
                    placeholder="موضوع الرسالة"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الرسالة</label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
                    placeholder="اكتب رسالتك هنا..."
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-[#2E86AB] text-white py-2 px-4 rounded-lg hover:bg-[#1e5f7a] transition-colors"
                  >
                    إرسال الرسالة
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FreelancerDetailPage;

