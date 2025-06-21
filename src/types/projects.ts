// إضافة أنواع جديدة لنظام إدارة المشاريع والعروض

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  client: User;
  budget: {
    type: 'time' | 'money';
    amount: number; // ساعات أو مبلغ مالي
    currency?: 'AED' | 'USD' | 'EUR'; // للمشاريع المالية
  };
  skills: string[];
  deadline?: Date;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  location?: string;
  isRemote: boolean;
  createdAt: Date;
  updatedAt: Date;
  proposals: Proposal[];
  selectedProposal?: string; // ID of selected proposal
  attachments?: string[];
  urgency: 'low' | 'medium' | 'high';
}

export interface Proposal {
  id: string;
  projectId: string;
  freelancer: User;
  coverLetter: string;
  proposedBudget: {
    type: 'time' | 'money';
    amount: number;
    currency?: 'AED' | 'USD' | 'EUR';
  };
  deliveryTime: number; // في الأيام
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  createdAt: Date;
  updatedAt: Date;
  attachments?: string[];
  milestones?: ProjectMilestone[];
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  amount: number; // ساعات أو مبلغ مالي
  dueDate: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'approved';
  deliverables?: string[];
}

export interface ProjectContract {
  id: string;
  projectId: string;
  proposalId: string;
  client: User;
  freelancer: User;
  terms: string;
  totalAmount: number;
  paymentType: 'time' | 'money';
  currency?: 'AED' | 'USD' | 'EUR';
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'completed' | 'cancelled' | 'disputed';
  milestones: ProjectMilestone[];
  escrowAmount?: number; // للمشاريع المالية
  platformFee: number; // نسبة المنصة
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectCategory {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  subcategories: ProjectSubcategory[];
  isActive: boolean;
}

export interface ProjectSubcategory {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  skills: string[];
  isActive: boolean;
}

export interface ProjectFilter {
  categories?: string[];
  budgetType?: 'time' | 'money' | 'both';
  budgetRange?: {
    min: number;
    max: number;
  };
  skills?: string[];
  location?: string;
  isRemote?: boolean;
  urgency?: ('low' | 'medium' | 'high')[];
  datePosted?: 'today' | 'week' | 'month' | 'all';
  sortBy?: 'newest' | 'budget_high' | 'budget_low' | 'deadline';
}

export interface ProjectSearchResult {
  projects: Project[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  filters: ProjectFilter;
}

