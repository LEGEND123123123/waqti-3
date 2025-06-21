// أنواع البيانات لنظام الدفع الآمن والوساطة

export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'credit_card' | 'debit_card' | 'bank_account' | 'digital_wallet';
  provider: 'visa' | 'mastercard' | 'paypal' | 'stripe' | 'bank_transfer';
  last4Digits: string;
  expiryMonth?: number;
  expiryYear?: number;
  holderName: string;
  isDefault: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  type: 'payment' | 'refund' | 'withdrawal' | 'deposit' | 'fee' | 'commission';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'disputed';
  amount: number;
  currency: 'AED' | 'USD' | 'EUR';
  fee: number; // رسوم المنصة
  netAmount: number; // المبلغ الصافي بعد الرسوم
  fromUserId?: string;
  toUserId?: string;
  projectId?: string;
  serviceId?: string;
  contractId?: string;
  paymentMethodId?: string;
  description: string;
  reference: string; // مرجع خارجي من بوابة الدفع
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface Contract {
  id: string;
  projectId?: string;
  serviceId?: string;
  clientId: string;
  freelancerId: string;
  title: string;
  description: string;
  scope: string[];
  deliverables: ContractDeliverable[];
  timeline: {
    startDate: Date;
    endDate: Date;
    milestones: ContractMilestone[];
  };
  payment: {
    type: 'time' | 'money';
    totalAmount: number;
    currency: 'AED' | 'USD' | 'EUR';
    structure: 'fixed' | 'hourly' | 'milestone';
    hourlyRate?: number;
    milestonePayments?: MilestonePayment[];
  };
  terms: {
    revisions: number;
    cancellationPolicy: string;
    intellectualProperty: string;
    confidentiality: boolean;
    disputeResolution: string;
  };
  status: 'draft' | 'pending_approval' | 'active' | 'completed' | 'cancelled' | 'disputed';
  signatures: {
    clientSigned: boolean;
    clientSignedAt?: Date;
    freelancerSigned: boolean;
    freelancerSignedAt?: Date;
  };
  escrow?: EscrowAccount;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface ContractDeliverable {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  status: 'pending' | 'in_progress' | 'submitted' | 'approved' | 'rejected';
  submittedAt?: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
  files: string[];
}

export interface ContractMilestone {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  status: 'pending' | 'in_progress' | 'completed';
  completedAt?: Date;
  deliverables: string[]; // IDs of deliverables
}

export interface MilestonePayment {
  id: string;
  milestoneId: string;
  amount: number;
  currency: 'AED' | 'USD' | 'EUR';
  status: 'pending' | 'escrowed' | 'released' | 'disputed';
  dueDate: Date;
  releasedAt?: Date;
}

export interface EscrowAccount {
  id: string;
  contractId: string;
  totalAmount: number;
  currency: 'AED' | 'USD' | 'EUR';
  heldAmount: number;
  releasedAmount: number;
  status: 'active' | 'completed' | 'disputed';
  transactions: EscrowTransaction[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EscrowTransaction {
  id: string;
  type: 'deposit' | 'release' | 'refund' | 'dispute_hold';
  amount: number;
  currency: 'AED' | 'USD' | 'EUR';
  description: string;
  milestoneId?: string;
  createdAt: Date;
}

export interface Dispute {
  id: string;
  contractId: string;
  projectId?: string;
  serviceId?: string;
  initiatorId: string; // من بدأ النزاع
  respondentId: string; // الطرف الآخر
  type: 'payment' | 'quality' | 'delivery' | 'scope' | 'cancellation';
  status: 'open' | 'under_review' | 'mediation' | 'arbitration' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  evidence: DisputeEvidence[];
  timeline: DisputeEvent[];
  resolution?: DisputeResolution;
  mediatorId?: string;
  arbitratorId?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

export interface DisputeEvidence {
  id: string;
  submitterId: string;
  type: 'document' | 'image' | 'video' | 'audio' | 'message' | 'contract';
  title: string;
  description: string;
  files: string[];
  submittedAt: Date;
}

export interface DisputeEvent {
  id: string;
  type: 'created' | 'evidence_submitted' | 'response_submitted' | 'mediation_started' | 'arbitration_started' | 'resolved';
  description: string;
  userId?: string;
  createdAt: Date;
}

export interface DisputeResolution {
  type: 'agreement' | 'mediation' | 'arbitration';
  outcome: 'client_favor' | 'freelancer_favor' | 'partial_refund' | 'full_refund' | 'no_refund' | 'custom';
  refundAmount?: number;
  currency?: 'AED' | 'USD' | 'EUR';
  description: string;
  terms: string[];
  resolvedBy: string; // ID of mediator/arbitrator
  resolvedAt: Date;
}

export interface Commission {
  id: string;
  transactionId: string;
  contractId?: string;
  projectId?: string;
  serviceId?: string;
  amount: number;
  currency: 'AED' | 'USD' | 'EUR';
  rate: number; // نسبة العمولة (0-100)
  type: 'platform_fee' | 'payment_processing' | 'dispute_fee' | 'premium_feature';
  description: string;
  createdAt: Date;
}

export interface Withdrawal {
  id: string;
  userId: string;
  amount: number;
  currency: 'AED' | 'USD' | 'EUR';
  fee: number;
  netAmount: number;
  paymentMethodId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  reference?: string;
  failureReason?: string;
  requestedAt: Date;
  processedAt?: Date;
  completedAt?: Date;
}

export interface PaymentSettings {
  userId: string;
  defaultPaymentMethodId?: string;
  autoWithdrawal: boolean;
  autoWithdrawalThreshold: number;
  autoWithdrawalCurrency: 'AED' | 'USD' | 'EUR';
  notifications: {
    paymentReceived: boolean;
    paymentSent: boolean;
    withdrawalCompleted: boolean;
    disputeCreated: boolean;
    contractSigned: boolean;
  };
  taxInfo?: {
    taxId?: string;
    vatNumber?: string;
    businessType: 'individual' | 'company';
    country: string;
  };
  updatedAt: Date;
}

export interface PaymentAnalytics {
  userId: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
  totalEarnings: {
    time: number;
    money: number;
    currency: 'AED' | 'USD' | 'EUR';
  };
  totalSpent: {
    time: number;
    money: number;
    currency: 'AED' | 'USD' | 'EUR';
  };
  commissionsPaid: number;
  withdrawals: number;
  activeContracts: number;
  completedContracts: number;
  disputeRate: number; // نسبة النزاعات
  averageProjectValue: number;
  topCategories: {
    category: string;
    amount: number;
    count: number;
  }[];
}

export interface PaymentNotification {
  id: string;
  userId: string;
  type: 'payment_received' | 'payment_sent' | 'withdrawal_completed' | 'dispute_created' | 'contract_signed' | 'milestone_released';
  title: string;
  message: string;
  amount?: number;
  currency?: 'AED' | 'USD' | 'EUR';
  contractId?: string;
  transactionId?: string;
  isRead: boolean;
  createdAt: Date;
}

