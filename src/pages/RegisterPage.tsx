import React, { useState } from 'react';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

interface RegisterPageProps {
  setActivePage: (page: string) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ setActivePage }) => {
  const { t, isRTL } = useLanguage();
  const { register, registerWithReferral, loginWithProvider, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    referralCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check for referral code in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      setFormData(prev => ({ ...prev, referralCode: refCode }));
    }
  }, []);
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error when user starts typing
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      return 'Name is required';
    }
    
    if (formData.name.trim().length < 2) {
      return 'Name must be at least 2 characters long';
    }
    
    if (!formData.email.trim()) {
      return 'Email is required';
    }
    
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      return 'Password is required';
    }
    
    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }
    
    if (!formData.phone.trim()) {
      return 'Phone number is required';
    }
    
    // Basic phone validation (you can make this more specific)
    if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone.trim())) {
      return 'Please enter a valid phone number';
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await register(
        formData.name.trim(),
        formData.email.trim(),
        formData.password,
        formData.phone.trim()
      );
      
      if (result.success) {
      // Use registerWithReferral if referral code exists
      const result = formData.referralCode 
        ? await registerWithReferral(
            formData.name.trim(),
            formData.email.trim(),
            formData.password,
            formData.phone.trim(),
            formData.referralCode
          )
        : await register(
            formData.name.trim(),
            formData.email.trim(),
            formData.password,
            formData.phone.trim()
          );
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setError('');
    setIsSubmitting(true);
    
    try {
      const result = await loginWithProvider(provider);
      
      if (result.success) {
        setActivePage('dashboard');
      } else {
        setError(result.error || 'Social login failed. Please try again.');
      }
    } catch (err) {
      console.error('Social login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="container mx-auto px-4 py-12 flex justify-center">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md border-t-4 border-[#2E86AB]">
        <h2 className={`text-2xl font-bold mb-6 text-[#2E86AB] flex items-center justify-center ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <UserPlus className={`${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t('register.title')}
        </h2>
        
        {error && (
          <div className="bg-red-100 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className={`block text-gray-700 mb-2 font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('register.name')}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
              placeholder="Enter your full name"
              disabled={isSubmitting || isLoading}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className={`block text-gray-700 mb-2 font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('register.email')}
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
              placeholder="Enter your email"
              disabled={isSubmitting || isLoading}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className={`block text-gray-700 mb-2 font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('register.password')}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
                placeholder="Enter your password"
                disabled={isSubmitting || isLoading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                disabled={isSubmitting || isLoading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <label className={`block text-gray-700 mb-2 font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
                placeholder="Confirm your password"
                disabled={isSubmitting || isLoading}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                disabled={isSubmitting || isLoading}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <label className={`block text-gray-700 mb-2 font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('register.phone')}
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
              placeholder="Enter your phone number"
              disabled={isSubmitting || isLoading}
              required
            />
          </div>
          
          {/* Referral Code */}
          <div className="mb-6">
            <label className={`block text-gray-700 mb-2 font-medium text-sm md:text-base ${isRTL ? 'text-right' : 'text-left'}`}>
              كود الإحالة (اختياري)
            </label>
            <input
              type="text"
              value={formData.referralCode}
              onChange={(e) => handleInputChange('referralCode', e.target.value)}
              className="w-full px-4 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
              placeholder="WAQTI-XXXXXXXX"
              disabled={isSubmitting || isLoading}
            />
            {formData.referralCode && (
              <p className="mt-1 text-sm text-green-600">
                ستحصل على 25 ساعة إضافية عند التسجيل!
              </p>
            )}
          </div>
          
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isSubmitting || isLoading}
            disabled={isSubmitting || isLoading}
          >
            {t('register.button')}
          </Button>
          
          {/* Social Login Section */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">أو</span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                disabled={isSubmitting || isLoading}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="ml-2">Google</span>
              </button>
              
              <button
                type="button"
                onClick={() => handleSocialLogin('github')}
                disabled={isSubmitting || isLoading}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="ml-2">GitHub</span>
              </button>
            </div>
          </div>
        </form>
        
        <p className="text-center mt-6">
          {t('register.login')} {' '}
          <button
            onClick={() => setActivePage('login')}
            className="text-[#2E86AB] font-medium hover:underline"
            disabled={isSubmitting || isLoading}
          >
            {t('register.loginLink')}
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage