import React, { useState } from 'react';
import { FreelancerProfile, FreelancerStats, FreelancerSkill, FreelancerBadge, FreelancerSearchFilter, User } from '../types';
import { Search, Filter, MapPin, Clock, Star, CheckCircle, Award, DollarSign, Users, TrendingUp } from 'lucide-react';

interface FreelancersPageProps {
  onFreelancerClick?: (freelancerId: string) => void;
}

const FreelancersPage: React.FC<FreelancersPageProps> = ({ onFreelancerClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FreelancerSearchFilter>({
    sortBy: 'rating'
  });

  // بيانات وهمية للمستقلين
  const mockFreelancers = [
    {
      profile: {
        id: 'fp1',
        userId: 'u1',
        title: 'مطور ويب محترف متخصص في React و Node.js',
        bio: 'مطور ويب خبير مع أكثر من 5 سنوات من الخبرة في تطوير تطبيقات الويب الحديثة. متخصص في React، Node.js، وقواعد البيانات. أقدم حلول تقنية مبتكرة وعالية الجودة.',
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
        { id: 's3', name: 'TypeScript', category: 'Programming', level: 'advanced' as const, yearsOfExperience: 3, isVerified: false, endorsements: [] }
      ] as FreelancerSkill[],
      badges: [
        { id: 'b1', name: 'Top Rated', description: 'أفضل المقيمين', icon: '⭐', color: 'gold', criteria: 'تقييم 4.8+', isActive: true, earnedAt: new Date('2023-06-01') },
        { id: 'b2', name: 'Fast Responder', description: 'سريع الاستجابة', icon: '⚡', color: 'blue', criteria: 'استجابة خلال ساعتين', isActive: true, earnedAt: new Date('2023-08-15') }
      ] as FreelancerBadge[]
    },
    {
      profile: {
        id: 'fp2',
        userId: 'u2',
        title: 'مصممة جرافيك وهوية بصرية احترافية',
        bio: 'مصممة جرافيك مبدعة مع خبرة 4 سنوات في تصميم الهويات البصرية والمواد التسويقية. أتقن Adobe Creative Suite وأقدم تصاميم عصرية تعكس رؤية العلامة التجارية.',
        hourlyRate: {
          time: 1.5,
          money: 120,
          currency: 'AED' as const
        },
        availability: 'available' as const,
        responseTime: 3,
        completionRate: 96,
        onTimeDelivery: 92,
        totalEarnings: {
          time: 320,
          money: 18500,
          currency: 'AED' as const
        },
        languages: [
          { language: 'العربية', proficiency: 'native' as const },
          { language: 'English', proficiency: 'conversational' as const }
        ],
        location: {
          country: 'UAE',
          city: 'Abu Dhabi',
          timezone: 'Asia/Dubai'
        },
        workingHours: {
          start: '10:00',
          end: '19:00',
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const
        },
        createdAt: new Date('2023-03-10'),
        updatedAt: new Date('2024-01-10')
      } as FreelancerProfile,
      user: {
        id: 'u2',
        name: 'سارة علي',
        email: 'sara@example.com',
        phone: '+971502345678',
        balance: 12,
        joinedAt: new Date('2023-03-10'),
        avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
        isVerified: true,
        expertiseLevel: 'professional' as const
      } as User,
      stats: {
        totalProjects: 34,
        completedProjects: 32,
        activeProjects: 2,
        totalClients: 28,
        repeatClients: 12,
        averageRating: 4.7,
        totalReviews: 31,
        responseTime: 3,
        completionRate: 96,
        onTimeDelivery: 92,
        totalEarnings: {
          time: 320,
          money: 18500,
          currency: 'AED' as const
        },
        monthlyEarnings: {
          time: 28,
          money: 2400,
          currency: 'AED' as const
        },
        joinDate: new Date('2023-03-10'),
        lastActive: new Date()
      } as FreelancerStats,
      skills: [
        { id: 's4', name: 'Photoshop', category: 'Design', level: 'expert' as const, yearsOfExperience: 4, isVerified: true, endorsements: [] },
        { id: 's5', name: 'Illustrator', category: 'Design', level: 'expert' as const, yearsOfExperience: 4, isVerified: true, endorsements: [] },
        { id: 's6', name: 'Branding', category: 'Design', level: 'advanced' as const, yearsOfExperience: 3, isVerified: false, endorsements: [] }
      ] as FreelancerSkill[],
      badges: [
        { id: 'b3', name: 'Creative Expert', description: 'خبير إبداعي', icon: '🎨', color: 'purple', criteria: 'تخصص في التصميم', isActive: true, earnedAt: new Date('2023-07-20') }
      ] as FreelancerBadge[]
    },
    {
      profile: {
        id: 'fp3',
        userId: 'u3',
        title: 'مترجم محترف عربي-إنجليزي',
        bio: 'مترجم محترف مع خبرة 6 سنوات في الترجمة التقنية والقانونية والطبية. حاصل على شهادات معتمدة في الترجمة وأقدم ترجمات دقيقة وسريعة.',
        hourlyRate: {
          time: 1,
          money: 80,
          currency: 'AED' as const
        },
        availability: 'busy' as const,
        responseTime: 4,
        completionRate: 99,
        onTimeDelivery: 97,
        totalEarnings: {
          time: 580,
          money: 32000,
          currency: 'AED' as const
        },
        languages: [
          { language: 'العربية', proficiency: 'native' as const },
          { language: 'English', proficiency: 'native' as const },
          { language: 'Français', proficiency: 'conversational' as const }
        ],
        location: {
          country: 'UAE',
          city: 'Sharjah',
          timezone: 'Asia/Dubai'
        },
        workingHours: {
          start: '08:00',
          end: '16:00',
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const
        },
        createdAt: new Date('2022-11-05'),
        updatedAt: new Date('2024-01-12')
      } as FreelancerProfile,
      user: {
        id: 'u3',
        name: 'ليلى محمد',
        email: 'layla@example.com',
        phone: '+971503456789',
        balance: 15,
        joinedAt: new Date('2022-11-05'),
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        isVerified: true,
        expertiseLevel: 'expert' as const
      } as User,
      stats: {
        totalProjects: 67,
        completedProjects: 65,
        activeProjects: 2,
        totalClients: 45,
        repeatClients: 28,
        averageRating: 4.8,
        totalReviews: 62,
        responseTime: 4,
        completionRate: 99,
        onTimeDelivery: 97,
        totalEarnings: {
          time: 580,
          money: 32000,
          currency: 'AED' as const
        },
        monthlyEarnings: {
          time: 42,
          money: 2800,
          currency: 'AED' as const
        },
        joinDate: new Date('2022-11-05'),
        lastActive: new Date()
      } as FreelancerStats,
      skills: [
        { id: 's7', name: 'Arabic Translation', category: 'Translation', level: 'expert' as const, yearsOfExperience: 6, isVerified: true, endorsements: [] },
        { id: 's8', name: 'Technical Translation', category: 'Translation', level: 'expert' as const, yearsOfExperience: 5, isVerified: true, endorsements: [] },
        { id: 's9', name: 'Legal Translation', category: 'Translation', level: 'advanced' as const, yearsOfExperience: 4, isVerified: true, endorsements: [] }
      ] as FreelancerSkill[],
      badges: [
        { id: 'b4', name: 'Top Rated', description: 'أفضل المقيمين', icon: '⭐', color: 'gold', criteria: 'تقييم 4.8+', isActive: true, earnedAt: new Date('2023-02-15') },
        { id: 'b5', name: 'Reliable', description: 'موثوق', icon: '🛡️', color: 'green', criteria: 'معدل إنجاز 98%+', isActive: true, earnedAt: new Date('2023-09-10') }
      ] as FreelancerBadge[]
    }
  ];

  const categories = [
    { id: 'all', name: 'جميع التخصصات' },
    { id: 'Programming', name: 'البرمجة' },
    { id: 'Design', name: 'التصميم' },
    { id: 'Translation', name: 'الترجمة' },
    { id: 'Teaching', name: 'التدريس' },
    { id: 'Writing', name: 'الكتابة' },
    { id: 'Marketing', name: 'التسويق' }
  ];

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
      case 'available': return 'متاح';
      case 'busy': return 'مشغول';
      case 'unavailable': return 'غير متاح';
      default: return 'غير محدد';
    }
  };

  const formatHourlyRate = (rate: FreelancerProfile['hourlyRate']) => {
    return `${rate.time} ساعة / ${rate.money} ${rate.currency}`;
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">المستقلون المحترفون</h1>
          <p className="text-gray-600">اعثر على أفضل المستقلين لإنجاز مشاريعك</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="ابحث عن مستقلين..."
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

            {/* Sort */}
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({...filters, sortBy: e.target.value as any})}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
            >
              <option value="rating">الأعلى تقييماً</option>
              <option value="price_low">السعر: من الأقل للأعلى</option>
              <option value="price_high">السعر: من الأعلى للأقل</option>
              <option value="response_time">الأسرع استجابة</option>
              <option value="completion_rate">الأعلى إنجازاً</option>
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent">
                    <option value="">جميع الحالات</option>
                    <option value="available">متاح</option>
                    <option value="busy">مشغول</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">التقييم</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent">
                    <option value="">جميع التقييمات</option>
                    <option value="4.5">4.5+ نجوم</option>
                    <option value="4.0">4.0+ نجوم</option>
                    <option value="3.5">3.5+ نجوم</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الموقع</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent">
                    <option value="">جميع المواقع</option>
                    <option value="dubai">دبي</option>
                    <option value="abudhabi">أبوظبي</option>
                    <option value="sharjah">الشارقة</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">اللغة</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent">
                    <option value="">جميع اللغات</option>
                    <option value="arabic">العربية</option>
                    <option value="english">الإنجليزية</option>
                    <option value="french">الفرنسية</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            تم العثور على {mockFreelancers.length} مستقل
          </p>
        </div>

        {/* Freelancers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {mockFreelancers.map(freelancer => (
            <div
              key={freelancer.profile.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onFreelancerClick?.(freelancer.profile.id)}
            >
              {/* Freelancer Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="relative">
                  <img
                    src={freelancer.user.avatar}
                    alt={freelancer.user.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  {freelancer.user.isVerified && (
                    <CheckCircle className="absolute -bottom-1 -right-1 h-5 w-5 text-green-500 bg-white rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {freelancer.user.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {freelancer.profile.title}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {renderStars(freelancer.stats.averageRating)}
                      <span className="text-sm font-medium text-gray-900 ml-1">
                        {freelancer.stats.averageRating}
                      </span>
                      <span className="text-sm text-gray-600">
                        ({freelancer.stats.totalReviews})
                      </span>
                    </div>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(freelancer.profile.availability)}`}>
                  {getAvailabilityText(freelancer.profile.availability)}
                </div>
              </div>

              {/* Bio */}
              <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                {freelancer.profile.bio}
              </p>

              {/* Skills */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {freelancer.skills.slice(0, 3).map(skill => (
                    <span
                      key={skill.id}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {skill.name}
                    </span>
                  ))}
                  {freelancer.skills.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{freelancer.skills.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Badges */}
              {freelancer.badges.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {freelancer.badges.map(badge => (
                      <span
                        key={badge.id}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full"
                      >
                        <span>{badge.icon}</span>
                        {badge.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                <div>
                  <div className="text-sm font-semibold text-gray-900">{freelancer.stats.completedProjects}</div>
                  <div className="text-xs text-gray-600">مشروع مكتمل</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{freelancer.stats.completionRate}%</div>
                  <div className="text-xs text-gray-600">معدل الإنجاز</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{freelancer.profile.responseTime}س</div>
                  <div className="text-xs text-gray-600">وقت الاستجابة</div>
                </div>
              </div>

              {/* Location and Rate */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {freelancer.profile.location.city}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {freelancer.profile.responseTime}س
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {formatHourlyRate(freelancer.profile.hourlyRate)}
                  </div>
                  <div className="text-xs text-gray-600">السعر بالساعة</div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4">
                <button className="w-full bg-[#2E86AB] text-white py-2 px-4 rounded-lg hover:bg-[#1e5f7a] transition-colors">
                  عرض الملف الشخصي
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {mockFreelancers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Users className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا يوجد مستقلون</h3>
            <p className="text-gray-600">لم يتم العثور على مستقلين يطابقون معايير البحث الخاصة بك</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FreelancersPage;

