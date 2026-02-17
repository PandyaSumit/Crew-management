import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plane, Eye, EyeOff, ArrowLeft, User, Mail, Lock, BadgeCheck } from 'lucide-react';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    employeeId: '',
    role: 'purser',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setStep(2);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-cyan-500/10" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-lg text-center">
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/25">
              <Plane className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl xl:text-5xl font-bold text-white mb-4 tracking-tight">
            Join the Team
          </h1>
          <p className="text-blue-200/70 text-lg mb-12">
            Register to start managing crew evaluations
          </p>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                step >= 1 ? 'bg-blue-500 text-white' : 'bg-white/10 text-blue-200/50'
              }`}>
                1
              </div>
              <span className={`text-sm font-medium ${step >= 1 ? 'text-white' : 'text-blue-200/50'}`}>
                Personal Info
              </span>
            </div>
            <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-blue-500' : 'bg-white/10'}`} />
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                step >= 2 ? 'bg-blue-500 text-white' : 'bg-white/10 text-blue-200/50'
              }`}>
                2
              </div>
              <span className={`text-sm font-medium ${step >= 2 ? 'text-white' : 'text-blue-200/50'}`}>
                Security
              </span>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-left">
            <h3 className="text-white font-semibold mb-3">What you&apos;ll get access to:</h3>
            <ul className="space-y-3">
              {[
                'Real-time flight crew evaluations',
                'Comprehensive crew performance profiles',
                'Historical flight evaluation data',
                'Structured assessment workflows',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-blue-200/70 text-sm">
                  <BadgeCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Right Panel - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile header */}
          <div className="lg:hidden text-center mb-6">
            <div className="inline-flex w-14 h-14 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl items-center justify-center shadow-lg shadow-blue-500/25 mb-4">
              <Plane className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
            <p className="text-blue-200/60 text-sm mt-1">Crew Management System</p>
          </div>

          {/* Mobile step indicator */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
              step >= 1 ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-white/5 text-blue-200/40 border border-white/10'
            }`}>
              <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold">1</span>
              Info
            </div>
            <div className={`w-8 h-0.5 ${step >= 2 ? 'bg-blue-500' : 'bg-white/10'}`} />
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
              step >= 2 ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-white/5 text-blue-200/40 border border-white/10'
            }`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step >= 2 ? 'bg-blue-500 text-white' : 'bg-white/10 text-blue-200/40'
              }`}>2</span>
              Security
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl">
            <div className="mb-6">
              {step === 2 && (
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm mb-4 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              )}
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                {step === 1 ? 'Personal Details' : 'Set Password'}
              </h2>
              <p className="text-blue-200/60 mt-2 text-sm sm:text-base">
                {step === 1
                  ? 'Fill in your information to get started'
                  : 'Create a secure password for your account'}
              </p>
            </div>

            {step === 1 ? (
              <form onSubmit={handleNextStep} className="space-y-4">
                {/* Name fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-blue-200/80 mb-1.5">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-200/30" />
                      <input
                        id="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                        placeholder="John"
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-200/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-blue-200/80 mb-1.5">
                      Last Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-200/30" />
                      <input
                        id="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => handleChange('lastName', e.target.value)}
                        placeholder="Doe"
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-200/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="signup-email" className="block text-sm font-medium text-blue-200/80 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-200/30" />
                    <input
                      id="signup-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="name@airline.com"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-200/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Employee ID */}
                <div>
                  <label htmlFor="employeeId" className="block text-sm font-medium text-blue-200/80 mb-1.5">
                    Employee ID
                  </label>
                  <div className="relative">
                    <BadgeCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-200/30" />
                    <input
                      id="employeeId"
                      type="text"
                      required
                      value={formData.employeeId}
                      onChange={(e) => handleChange('employeeId', e.target.value)}
                      placeholder="EMP-12345"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-200/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-blue-200/80 mb-2">
                    Role
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'purser', label: 'Purser' },
                      { id: 'crew', label: 'Crew' },
                      { id: 'admin', label: 'Admin' },
                    ].map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => handleChange('role', r.id)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 border cursor-pointer ${
                          formData.role === r.id
                            ? 'bg-blue-500 border-blue-400 text-white shadow-lg shadow-blue-500/25'
                            : 'bg-white/5 border-white/10 text-blue-200/70 hover:bg-white/10 hover:border-white/20'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-[0.98] text-sm sm:text-base cursor-pointer mt-2"
                >
                  Continue
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Password */}
                <div>
                  <label htmlFor="signup-password" className="block text-sm font-medium text-blue-200/80 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-200/30" />
                    <input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      placeholder="Create a strong password"
                      className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-200/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-200/40 hover:text-blue-200/70 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Password strength indicator */}
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((level) => {
                        const strength = [
                          formData.password.length >= 8,
                          /[A-Z]/.test(formData.password),
                          /[0-9]/.test(formData.password),
                          /[^A-Za-z0-9]/.test(formData.password),
                        ].filter(Boolean).length;
                        return (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-colors ${
                              level <= strength
                                ? strength <= 1
                                  ? 'bg-red-500'
                                  : strength <= 2
                                  ? 'bg-yellow-500'
                                  : strength <= 3
                                  ? 'bg-blue-500'
                                  : 'bg-green-500'
                                : 'bg-white/10'
                            }`}
                          />
                        );
                      })}
                    </div>
                    <p className="text-xs text-blue-200/50">
                      Use 8+ characters with uppercase, numbers, and symbols
                    </p>
                  </div>
                )}

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-blue-200/80 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-200/30" />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      placeholder="Re-enter your password"
                      className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-200/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-200/40 hover:text-blue-200/70 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
                  )}
                </div>

                {/* Terms */}
                <label className="flex items-start gap-3 cursor-pointer mt-2">
                  <input
                    type="checkbox"
                    required
                    className="w-4 h-4 mt-0.5 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500/50 focus:ring-offset-0"
                  />
                  <span className="text-sm text-blue-200/60">
                    I agree to the{' '}
                    <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                      Privacy Policy
                    </a>
                  </span>
                </label>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-[0.98] text-sm sm:text-base cursor-pointer mt-2"
                >
                  Create Account
                </button>
              </form>
            )}

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-blue-200/40 text-xs uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <p className="text-center text-blue-200/60 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
