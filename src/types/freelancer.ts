// إضافة أنواع جديدة للملفات الشخصية الاحترافية

export interface FreelancerProfile {
  id: string;
  userId: string;
  title: string; // مثل "مطور ويب محترف" أو "مصمم جرافيك خبير"
  bio: string; // نبذة شخصية مفصلة
  hourlyRate: {
    time: number; // السعر بالساعات
    money: number; // السعر بالمال
    currency: 'AED' | 'USD' | 'EUR';
  };
  availability: 'available' | 'busy' | 'unavailable';
  responseTime: number; // متوسط وقت الاستجابة بالساعات
  completionRate: number; // معدل إنجاز المشاريع (0-100)
  onTimeDelivery: number; // معدل التسليم في الوقت المحدد (0-100)
  totalEarnings: {
    time: number; // إجمالي الساعات المكتسبة
    money: number; // إجمالي المال المكتسب
    currency: 'AED' | 'USD' | 'EUR';
  };
  languages: Language[];
  location: {
    country: string;
    city: string;
    timezone: string;
  };
  workingHours: {
    start: string; // "09:00"
    end: string; // "17:00"
    days: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface FreelancerLanguage {
  language: string;
  proficiency: 'basic' | 'conversational' | 'fluent' | 'native';
}

export interface FreelancerSkill {
  id: string;
  name: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience: number;
  isVerified: boolean;
  verificationDate?: Date;
  endorsements: SkillEndorsement[];
}

export interface SkillEndorsement {
  id: string;
  endorserId: string;
  endorserName: string;
  endorserAvatar?: string;
  comment?: string;
  createdAt: Date;
}

export interface WorkExperience {
  id: string;
  freelancerId: string;
  title: string;
  company: string;
  location: string;
  startDate: Date;
  endDate?: Date; // null إذا كان العمل حالياً
  isCurrent: boolean;
  description: string;
  achievements: string[];
  skills: string[];
}

export interface Education {
  id: string;
  freelancerId: string;
  degree: string;
  institution: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  grade?: string;
  description?: string;
}

export interface Certification {
  id: string;
  freelancerId: string;
  name: string;
  issuingOrganization: string;
  issueDate: Date;
  expirationDate?: Date;
  credentialId?: string;
  credentialUrl?: string;
  skills: string[];
  isVerified: boolean;
}

export interface PortfolioItem {
  id: string;
  freelancerId: string;
  title: string;
  description: string;
  category: string;
  skills: string[];
  images: string[];
  videos?: string[];
  liveUrl?: string;
  sourceCodeUrl?: string;
  completionDate: Date;
  client?: {
    name: string;
    company?: string;
    testimonial?: string;
    rating?: number;
  };
  isPublic: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FreelancerReview {
  id: string;
  projectId?: string;
  serviceId?: string;
  clientId: string;
  freelancerId: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  pros: string[];
  cons: string[];
  wouldRecommend: boolean;
  isPublic: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  freelancerResponse?: {
    comment: string;
    createdAt: Date;
  };
}

export interface FreelancerStats {
  totalProjects: number;
  completedProjects: number;
  activeProjects: number;
  totalClients: number;
  repeatClients: number;
  averageRating: number;
  totalReviews: number;
  responseTime: number; // بالساعات
  completionRate: number; // نسبة مئوية
  onTimeDelivery: number; // نسبة مئوية
  totalEarnings: {
    time: number;
    money: number;
    currency: 'AED' | 'USD' | 'EUR';
  };
  monthlyEarnings: {
    time: number;
    money: number;
    currency: 'AED' | 'USD' | 'EUR';
  };
  joinDate: Date;
  lastActive: Date;
}

export interface FreelancerBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  criteria: string;
  isActive: boolean;
  earnedAt?: Date;
}

export interface FreelancerSearchFilter {
  skills?: string[];
  categories?: string[];
  location?: string;
  availability?: ('available' | 'busy' | 'unavailable')[];
  hourlyRateRange?: {
    type: 'time' | 'money';
    min: number;
    max: number;
    currency?: 'AED' | 'USD' | 'EUR';
  };
  rating?: number; // الحد الأدنى للتقييم
  completionRate?: number; // الحد الأدنى لمعدل الإنجاز
  responseTime?: number; // الحد الأقصى لوقت الاستجابة بالساعات
  languages?: string[];
  badges?: string[];
  sortBy?: 'rating' | 'price_low' | 'price_high' | 'response_time' | 'completion_rate' | 'newest';
}

export interface FreelancerSearchResult {
  freelancers: (FreelancerProfile & { 
    user: User; 
    stats: FreelancerStats; 
    skills: FreelancerSkill[];
    badges: FreelancerBadge[];
  })[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  filters: FreelancerSearchFilter;
}

