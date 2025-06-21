import React, { useState } from 'react';
import { 
  Contract, 
  Transaction, 
  Dispute, 
  EscrowAccount, 
  PaymentMethod,
  Withdrawal 
} from '../types';
import { 
  FileText, 
  DollarSign, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  CreditCard,
  Download,
  Eye,
  MessageSquare,
  Calendar,
  TrendingUp,
  Filter,
  Search
} from 'lucide-react';

interface ContractsPaymentsPageProps {
  setActivePage: (page: string) => void;
}

const ContractsPaymentsPage: React.FC<ContractsPaymentsPageProps> = ({ setActivePage }) => {
  const [activeTab, setActiveTab] = useState('contracts');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // بيانات وهمية للعقود
  const mockContracts: Contract[] = [
    {
      id: 'contract1',
      projectId: 'proj1',
      clientId: 'client1',
      freelancerId: 'freelancer1',
      title: 'تطوير موقع التجارة الإلكترونية',
      description: 'تطوير موقع تجارة إلكترونية متكامل مع نظام إدارة المخزون',
      scope: ['تصميم واجهة المستخدم', 'تطوير الواجهة الخلفية', 'نظام الدفع', 'اختبار الموقع'],
      deliverables: [
        {
          id: 'del1',
          title: 'تصميم الواجهة',
          description: 'تصميم جميع صفحات الموقع',
          dueDate: new Date('2024-02-15'),
          status: 'completed',
          submittedAt: new Date('2024-02-14'),
          approvedAt: new Date('2024-02-15'),
          files: ['design.figma', 'mockups.pdf']
        },
        {
          id: 'del2',
          title: 'تطوير الواجهة الأمامية',
          description: 'تطوير جميع صفحات الموقع بـ React',
          dueDate: new Date('2024-03-01'),
          status: 'in_progress',
          files: []
        }
      ],
      timeline: {
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-03-15'),
        milestones: [
          {
            id: 'mile1',
            title: 'إنجاز التصميم',
            description: 'إنجاز تصميم جميع الصفحات',
            dueDate: new Date('2024-02-15'),
            status: 'completed',
            completedAt: new Date('2024-02-15'),
            deliverables: ['del1']
          },
          {
            id: 'mile2',
            title: 'إنجاز التطوير',
            description: 'إنجاز تطوير الواجهة الأمامية',
            dueDate: new Date('2024-03-01'),
            status: 'in_progress',
            deliverables: ['del2']
          }
        ]
      },
      payment: {
        type: 'money',
        totalAmount: 5000,
        currency: 'AED',
        structure: 'milestone',
        milestonePayments: [
          {
            id: 'pay1',
            milestoneId: 'mile1',
            amount: 2000,
            currency: 'AED',
            status: 'released',
            dueDate: new Date('2024-02-15'),
            releasedAt: new Date('2024-02-16')
          },
          {
            id: 'pay2',
            milestoneId: 'mile2',
            amount: 3000,
            currency: 'AED',
            status: 'escrowed',
            dueDate: new Date('2024-03-01')
          }
        ]
      },
      terms: {
        revisions: 3,
        cancellationPolicy: 'يمكن إلغاء العقد مع إشعار مسبق 7 أيام',
        intellectualProperty: 'جميع الحقوق تنتقل للعميل عند الدفع الكامل',
        confidentiality: true,
        disputeResolution: 'الوساطة ثم التحكيم إذا لزم الأمر'
      },
      status: 'active',
      signatures: {
        clientSigned: true,
        clientSignedAt: new Date('2024-01-15'),
        freelancerSigned: true,
        freelancerSignedAt: new Date('2024-01-15')
      },
      escrow: {
        id: 'escrow1',
        contractId: 'contract1',
        totalAmount: 5000,
        currency: 'AED',
        heldAmount: 3000,
        releasedAmount: 2000,
        status: 'active',
        transactions: [
          {
            id: 'etx1',
            type: 'deposit',
            amount: 5000,
            currency: 'AED',
            description: 'إيداع مبلغ العقد',
            createdAt: new Date('2024-01-15')
          },
          {
            id: 'etx2',
            type: 'release',
            amount: 2000,
            currency: 'AED',
            description: 'إطلاق دفعة المرحلة الأولى',
            milestoneId: 'mile1',
            createdAt: new Date('2024-02-16')
          }
        ],
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-02-16')
      },
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-02-16')
    }
  ];

  // بيانات وهمية للمعاملات
  const mockTransactions: Transaction[] = [
    {
      id: 'tx1',
      type: 'payment',
      status: 'completed',
      amount: 2000,
      currency: 'AED',
      fee: 100,
      netAmount: 1900,
      fromUserId: 'client1',
      toUserId: 'freelancer1',
      contractId: 'contract1',
      description: 'دفعة المرحلة الأولى - تطوير موقع التجارة الإلكترونية',
      reference: 'PAY_2024_001',
      createdAt: new Date('2024-02-16'),
      updatedAt: new Date('2024-02-16'),
      completedAt: new Date('2024-02-16')
    },
    {
      id: 'tx2',
      type: 'deposit',
      status: 'completed',
      amount: 5000,
      currency: 'AED',
      fee: 50,
      netAmount: 4950,
      fromUserId: 'client1',
      contractId: 'contract1',
      description: 'إيداع مبلغ العقد في الضمان',
      reference: 'DEP_2024_001',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      completedAt: new Date('2024-01-15')
    },
    {
      id: 'tx3',
      type: 'commission',
      status: 'completed',
      amount: 100,
      currency: 'AED',
      fee: 0,
      netAmount: 100,
      toUserId: 'platform',
      contractId: 'contract1',
      description: 'عمولة المنصة - 5%',
      reference: 'COM_2024_001',
      createdAt: new Date('2024-02-16'),
      updatedAt: new Date('2024-02-16'),
      completedAt: new Date('2024-02-16')
    }
  ];

  // بيانات وهمية للنزاعات
  const mockDisputes: Dispute[] = [
    {
      id: 'dispute1',
      contractId: 'contract2',
      projectId: 'proj2',
      initiatorId: 'client2',
      respondentId: 'freelancer2',
      type: 'quality',
      status: 'under_review',
      priority: 'medium',
      title: 'جودة التصميم لا تطابق المتطلبات',
      description: 'التصميم المسلم لا يطابق المواصفات المتفق عليها في العقد',
      evidence: [
        {
          id: 'ev1',
          submitterId: 'client2',
          type: 'document',
          title: 'المتطلبات الأصلية',
          description: 'وثيقة المتطلبات المتفق عليها',
          files: ['requirements.pdf'],
          submittedAt: new Date('2024-02-10')
        }
      ],
      timeline: [
        {
          id: 'event1',
          type: 'created',
          description: 'تم إنشاء النزاع',
          userId: 'client2',
          createdAt: new Date('2024-02-10')
        },
        {
          id: 'event2',
          type: 'evidence_submitted',
          description: 'تم تقديم أدلة من العميل',
          userId: 'client2',
          createdAt: new Date('2024-02-10')
        }
      ],
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-02-10')
    }
  ];

  // بيانات وهمية لطرق الدفع
  const mockPaymentMethods: PaymentMethod[] = [
    {
      id: 'pm1',
      userId: 'user1',
      type: 'credit_card',
      provider: 'visa',
      last4Digits: '4242',
      expiryMonth: 12,
      expiryYear: 2025,
      holderName: 'أحمد حسن',
      isDefault: true,
      isVerified: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 'pm2',
      userId: 'user1',
      type: 'bank_account',
      provider: 'bank_transfer',
      last4Digits: '1234',
      holderName: 'أحمد حسن',
      isDefault: false,
      isVerified: true,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
      case 'pending_approval':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'disputed':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'completed': return 'مكتمل';
      case 'pending': return 'في الانتظار';
      case 'pending_approval': return 'في انتظار الموافقة';
      case 'cancelled': return 'ملغي';
      case 'failed': return 'فشل';
      case 'disputed': return 'متنازع عليه';
      case 'draft': return 'مسودة';
      case 'processing': return 'قيد المعالجة';
      case 'under_review': return 'قيد المراجعة';
      case 'resolved': return 'محلول';
      default: return status;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ar-AE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('ar-AE', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const tabs = [
    { id: 'contracts', name: 'العقود', icon: FileText, count: mockContracts.length },
    { id: 'transactions', name: 'المعاملات', icon: DollarSign, count: mockTransactions.length },
    { id: 'disputes', name: 'النزاعات', icon: AlertTriangle, count: mockDisputes.length },
    { id: 'payments', name: 'طرق الدفع', icon: CreditCard, count: mockPaymentMethods.length }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">العقود والمدفوعات</h1>
          <p className="text-gray-600">إدارة عقودك ومعاملاتك المالية</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">العقود النشطة</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">الأرباح هذا الشهر</p>
                <p className="text-2xl font-bold text-gray-900">12,500 AED</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">في الضمان</p>
                <p className="text-2xl font-bold text-gray-900">8,000 AED</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Shield className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">النزاعات المفتوحة</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
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
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="البحث..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
              >
                <option value="all">جميع الحالات</option>
                <option value="active">نشط</option>
                <option value="completed">مكتمل</option>
                <option value="pending">في الانتظار</option>
                <option value="disputed">متنازع عليه</option>
              </select>
            </div>
          </div>

          <div className="p-6">
            {/* Contracts Tab */}
            {activeTab === 'contracts' && (
              <div className="space-y-4">
                {mockContracts.map(contract => (
                  <div key={contract.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {contract.title}
                        </h3>
                        <p className="text-gray-600 mb-3">{contract.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(contract.timeline.startDate)} - {formatDate(contract.timeline.endDate)}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {formatCurrency(contract.payment.totalAmount, contract.payment.currency)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(contract.status)}`}>
                          {getStatusText(contract.status)}
                        </span>
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <Eye className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">التقدم</span>
                        <span className="text-sm text-gray-600">
                          {contract.timeline.milestones.filter(m => m.status === 'completed').length} / {contract.timeline.milestones.length} مراحل
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#2E86AB] h-2 rounded-full" 
                          style={{ 
                            width: `${(contract.timeline.milestones.filter(m => m.status === 'completed').length / contract.timeline.milestones.length) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Milestones */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {contract.timeline.milestones.map(milestone => (
                        <div key={milestone.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className={`w-3 h-3 rounded-full ${
                            milestone.status === 'completed' ? 'bg-green-500' :
                            milestone.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-300'
                          }`}></div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{milestone.title}</p>
                            <p className="text-sm text-gray-600">{formatDate(milestone.dueDate)}</p>
                          </div>
                          {contract.payment.milestonePayments?.find(p => p.milestoneId === milestone.id) && (
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">
                                {formatCurrency(
                                  contract.payment.milestonePayments.find(p => p.milestoneId === milestone.id)!.amount,
                                  contract.payment.currency
                                )}
                              </p>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                contract.payment.milestonePayments.find(p => p.milestoneId === milestone.id)!.status === 'released'
                                  ? 'bg-green-100 text-green-800'
                                  : contract.payment.milestonePayments.find(p => p.milestoneId === milestone.id)!.status === 'escrowed'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {contract.payment.milestonePayments.find(p => p.milestoneId === milestone.id)!.status === 'released' ? 'مُطلق' :
                                 contract.payment.milestonePayments.find(p => p.milestoneId === milestone.id)!.status === 'escrowed' ? 'في الضمان' : 'في الانتظار'}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button className="flex items-center gap-2 px-4 py-2 bg-[#2E86AB] text-white rounded-lg hover:bg-[#1e5f7a] transition-colors">
                        <Eye className="h-4 w-4" />
                        عرض التفاصيل
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <MessageSquare className="h-4 w-4" />
                        التواصل
                      </button>
                      {contract.status === 'active' && (
                        <button className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors">
                          <AlertTriangle className="h-4 w-4" />
                          إبلاغ عن مشكلة
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div className="space-y-4">
                {mockTransactions.map(transaction => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${
                        transaction.type === 'payment' ? 'bg-green-100' :
                        transaction.type === 'deposit' ? 'bg-blue-100' :
                        transaction.type === 'commission' ? 'bg-purple-100' :
                        'bg-gray-100'
                      }`}>
                        <DollarSign className={`h-5 w-5 ${
                          transaction.type === 'payment' ? 'text-green-600' :
                          transaction.type === 'deposit' ? 'text-blue-600' :
                          transaction.type === 'commission' ? 'text-purple-600' :
                          'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-600">
                          {formatDate(transaction.createdAt)} • {transaction.reference}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === 'payment' && transaction.toUserId ? 'text-green-600' :
                        transaction.type === 'commission' ? 'text-red-600' :
                        'text-gray-900'
                      }`}>
                        {transaction.type === 'commission' ? '-' : '+'}
                        {formatCurrency(transaction.amount, transaction.currency)}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(transaction.status)}`}>
                        {getStatusText(transaction.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Disputes Tab */}
            {activeTab === 'disputes' && (
              <div className="space-y-4">
                {mockDisputes.map(dispute => (
                  <div key={dispute.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {dispute.title}
                        </h3>
                        <p className="text-gray-600 mb-3">{dispute.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>نوع النزاع: {dispute.type}</span>
                          <span>الأولوية: {dispute.priority}</span>
                          <span>{formatDate(dispute.createdAt)}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(dispute.status)}`}>
                        {getStatusText(dispute.status)}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <button className="flex items-center gap-2 px-4 py-2 bg-[#2E86AB] text-white rounded-lg hover:bg-[#1e5f7a] transition-colors">
                        <Eye className="h-4 w-4" />
                        عرض التفاصيل
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <MessageSquare className="h-4 w-4" />
                        إضافة رد
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Payment Methods Tab */}
            {activeTab === 'payments' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">طرق الدفع</h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#2E86AB] text-white rounded-lg hover:bg-[#1e5f7a] transition-colors">
                    <CreditCard className="h-4 w-4" />
                    إضافة طريقة دفع
                  </button>
                </div>
                {mockPaymentMethods.map(method => (
                  <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {method.type === 'credit_card' ? 'بطاقة ائتمان' : 
                           method.type === 'debit_card' ? 'بطاقة خصم' :
                           method.type === 'bank_account' ? 'حساب بنكي' : 'محفظة رقمية'}
                        </p>
                        <p className="text-sm text-gray-600">
                          **** **** **** {method.last4Digits}
                          {method.expiryMonth && method.expiryYear && (
                            <span> • {method.expiryMonth}/{method.expiryYear}</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {method.isDefault && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          افتراضي
                        </span>
                      )}
                      {method.isVerified && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      <button className="text-gray-400 hover:text-gray-600">
                        <Eye className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractsPaymentsPage;

