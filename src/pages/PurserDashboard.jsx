import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plane, Users, ClipboardCheck, History, User, Star,
  ChevronRight, LogOut, Menu, X, ArrowLeft, Check,
  RotateCcw, Send, BarChart3, Clock, Award
} from 'lucide-react';

// Mock data
const CURRENT_FLIGHT = {
  flightNo: 'AI-203',
  route: 'DEL → BOM',
  date: '2026-02-16',
  status: 'In Progress',
  crew: [
    { id: 1, name: 'Priya Sharma', role: 'Senior Cabin Crew', avatar: 'PS', rating: null },
    { id: 2, name: 'Rahul Verma', role: 'Cabin Crew', avatar: 'RV', rating: null },
    { id: 3, name: 'Anita Desai', role: 'Cabin Crew', avatar: 'AD', rating: null },
    { id: 4, name: 'Vikram Singh', role: 'Junior Cabin Crew', avatar: 'VS', rating: null },
  ],
};

const PAST_FLIGHTS = [
  { id: 1, flightNo: 'AI-101', route: 'DEL → LHR', date: '2026-02-10', crewCount: 6, avgRating: 4.2 },
  { id: 2, flightNo: 'AI-305', route: 'BOM → DXB', date: '2026-02-05', crewCount: 4, avgRating: 3.8 },
  { id: 3, flightNo: 'AI-442', route: 'DEL → SIN', date: '2026-01-28', crewCount: 5, avgRating: 4.5 },
  { id: 4, flightNo: 'AI-118', route: 'BOM → JFK', date: '2026-01-20', crewCount: 8, avgRating: 4.0 },
];

const CREW_PROFILES = [
  { id: 1, name: 'Priya Sharma', role: 'Senior Cabin Crew', avatar: 'PS', avgRating: 4.5, flights: 48, evaluations: 12 },
  { id: 2, name: 'Rahul Verma', role: 'Cabin Crew', avatar: 'RV', avgRating: 3.9, flights: 32, evaluations: 8 },
  { id: 3, name: 'Anita Desai', role: 'Cabin Crew', avatar: 'AD', avgRating: 4.2, flights: 41, evaluations: 10 },
  { id: 4, name: 'Vikram Singh', role: 'Junior Cabin Crew', avatar: 'VS', avgRating: 3.7, flights: 15, evaluations: 4 },
  { id: 5, name: 'Meera Patel', role: 'Senior Cabin Crew', avatar: 'MP', avgRating: 4.8, flights: 56, evaluations: 14 },
];

const EVALUATION_CRITERIA = [
  'Grooming & Uniform',
  'Service Quality',
  'Safety Compliance',
  'Communication Skills',
  'Team Collaboration',
  'Problem Solving',
];

function StarRating({ rating, onRate, size = 'md' }) {
  const sizeClasses = size === 'lg' ? 'w-8 h-8' : 'w-5 h-5';
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRate?.(star)}
          className={`${onRate ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
        >
          <Star
            className={`${sizeClasses} transition-colors ${
              star <= rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-white/20'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center shrink-0`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-xs text-blue-200/60">{label}</p>
        </div>
      </div>
    </div>
  );
}

export default function PurserDashboard() {
  const [activeTab, setActiveTab] = useState('current');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [evaluationState, setEvaluationState] = useState('crew-list'); // crew-list, evaluating, progress, completed
  const [selectedCrew, setSelectedCrew] = useState(null);
  const [crewRatings, setCrewRatings] = useState({});
  const [criteriaRatings, setCriteriaRatings] = useState({});
  const [selectedProfile, setSelectedProfile] = useState(null);
  const navigate = useNavigate();

  const tabs = [
    { id: 'current', label: 'Current Flight', icon: Plane },
    { id: 'past', label: 'Past Flights', icon: History },
    { id: 'profiles', label: 'Crew Profiles', icon: Users },
  ];

  const handleStartEvaluation = (crew) => {
    setSelectedCrew(crew);
    setCriteriaRatings({});
    setEvaluationState('evaluating');
  };

  const handleSaveEvaluation = () => {
    const avg = Object.values(criteriaRatings).reduce((a, b) => a + b, 0) / Object.values(criteriaRatings).length;
    setCrewRatings((prev) => ({ ...prev, [selectedCrew.id]: Math.round(avg * 10) / 10 }));
    setSelectedCrew(null);
    setEvaluationState('progress');
  };

  const allEvaluated = CURRENT_FLIGHT.crew.every((c) => crewRatings[c.id]);
  const evaluatedCount = CURRENT_FLIGHT.crew.filter((c) => crewRatings[c.id]).length;

  const handleSubmitAll = () => {
    setEvaluationState('completed');
  };

  const handleReEvaluate = () => {
    setCrewRatings({});
    setEvaluationState('crew-list');
  };

  // Stepper for evaluation workflow
  const steps = [
    { label: 'Crew List', done: evaluationState !== 'crew-list' },
    { label: 'Evaluate', done: evaluationState === 'progress' || evaluationState === 'completed' },
    { label: 'Review', done: evaluationState === 'completed' },
    { label: 'Complete', done: evaluationState === 'completed' },
  ];

  const currentStepIndex =
    evaluationState === 'crew-list' ? 0 :
    evaluationState === 'evaluating' ? 1 :
    evaluationState === 'progress' ? 2 : 3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-white font-semibold text-sm">Crew Management</h1>
                <p className="text-blue-200/50 text-xs">Purser Dashboard</p>
              </div>
            </div>

            {/* Desktop tabs */}
            <div className="hidden md:flex items-center gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setEvaluationState('crew-list'); setSelectedProfile(null); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'text-blue-200/60 hover:text-blue-200 hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-white/5 rounded-lg px-3 py-1.5 border border-white/10">
                <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  JP
                </div>
                <span className="text-white text-sm font-medium">J. Patel</span>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="text-blue-200/50 hover:text-red-400 transition-colors cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-blue-200/60 hover:text-white transition-colors cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-slate-900/95 backdrop-blur-xl">
            <div className="px-4 py-3 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setEvaluationState('crew-list');
                    setSelectedProfile(null);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'text-blue-200/60 hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <StatCard icon={Plane} label="Current Flight" value={CURRENT_FLIGHT.flightNo} color="bg-blue-500" />
          <StatCard icon={Users} label="Crew Members" value={CURRENT_FLIGHT.crew.length} color="bg-cyan-500" />
          <StatCard icon={ClipboardCheck} label="Evaluated" value={`${evaluatedCount}/${CURRENT_FLIGHT.crew.length}`} color="bg-green-500" />
          <StatCard icon={History} label="Past Flights" value={PAST_FLIGHTS.length} color="bg-indigo-500" />
        </div>

        {/* Tab: Current Flight */}
        {activeTab === 'current' && (
          <div>
            {/* Flight header */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full font-medium">
                      {CURRENT_FLIGHT.status}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Flight {CURRENT_FLIGHT.flightNo}
                  </h2>
                  <p className="text-blue-200/60 text-sm mt-1">
                    {CURRENT_FLIGHT.route} &middot; {CURRENT_FLIGHT.date}
                  </p>
                </div>
                {evaluationState === 'completed' && (
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2">
                      <Check className="w-4 h-4" /> All Evaluations Submitted
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Workflow Stepper */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6 mb-6">
              <h3 className="text-sm font-medium text-blue-200/70 mb-4">Evaluation Progress</h3>
              <div className="flex items-center justify-between">
                {steps.map((step, i) => (
                  <div key={i} className="flex items-center flex-1 last:flex-initial">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all ${
                        i < currentStepIndex
                          ? 'bg-green-500 text-white'
                          : i === currentStepIndex
                          ? 'bg-blue-500 text-white ring-4 ring-blue-500/20'
                          : 'bg-white/10 text-blue-200/40'
                      }`}>
                        {i < currentStepIndex ? <Check className="w-4 h-4" /> : i + 1}
                      </div>
                      <span className={`text-[10px] sm:text-xs mt-1.5 font-medium whitespace-nowrap ${
                        i <= currentStepIndex ? 'text-white' : 'text-blue-200/40'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                    {i < steps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-2 sm:mx-3 ${
                        i < currentStepIndex ? 'bg-green-500' : 'bg-white/10'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Crew list / Evaluation */}
            {evaluationState === 'evaluating' && selectedCrew ? (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6">
                <button
                  onClick={() => { setEvaluationState(evaluatedCount > 0 ? 'progress' : 'crew-list'); setSelectedCrew(null); }}
                  className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm mb-4 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to crew list
                </button>

                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {selectedCrew.avatar}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{selectedCrew.name}</h3>
                    <p className="text-blue-200/60 text-sm">{selectedCrew.role}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {EVALUATION_CRITERIA.map((criteria) => (
                    <div key={criteria} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 bg-white/5 rounded-lg p-3 sm:p-4">
                      <span className="text-sm text-white font-medium">{criteria}</span>
                      <StarRating
                        rating={criteriaRatings[criteria] || 0}
                        onRate={(r) => setCriteriaRatings((prev) => ({ ...prev, [criteria]: r }))}
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleSaveEvaluation}
                    disabled={Object.keys(criteriaRatings).length < EVALUATION_CRITERIA.length}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25 cursor-pointer flex items-center justify-center gap-2 text-sm"
                  >
                    <Check className="w-4 h-4" /> Save Evaluation
                  </button>
                </div>
                {Object.keys(criteriaRatings).length < EVALUATION_CRITERIA.length && (
                  <p className="text-blue-200/40 text-xs mt-2 text-center">
                    Rate all {EVALUATION_CRITERIA.length} criteria to save
                  </p>
                )}
              </div>
            ) : evaluationState === 'completed' ? (
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 sm:p-8 text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Evaluations Submitted</h3>
                <p className="text-blue-200/60 text-sm mb-6 max-w-md mx-auto">
                  All crew member evaluations for Flight {CURRENT_FLIGHT.flightNo} have been successfully submitted.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 max-w-lg mx-auto">
                  {CURRENT_FLIGHT.crew.map((c) => (
                    <div key={c.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center text-white font-bold text-xs mx-auto mb-2">
                        {c.avatar}
                      </div>
                      <p className="text-white text-xs font-medium truncate">{c.name.split(' ')[0]}</p>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-yellow-400 text-xs font-semibold">{crewRatings[c.id]}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleReEvaluate}
                    className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all text-sm font-medium flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" /> Re-Evaluate
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {CURRENT_FLIGHT.crew.map((crew) => (
                  <div
                    key={crew.id}
                    className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.07] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {crew.avatar}
                      </div>
                      <div>
                        <h4 className="text-white font-medium text-sm">{crew.name}</h4>
                        <p className="text-blue-200/50 text-xs">{crew.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                      {crewRatings[crew.id] ? (
                        <div className="flex items-center gap-2">
                          <StarRating rating={Math.round(crewRatings[crew.id])} />
                          <span className="text-yellow-400 text-sm font-semibold">{crewRatings[crew.id]}</span>
                        </div>
                      ) : (
                        <span className="text-blue-200/40 text-xs">Not evaluated</span>
                      )}
                      <button
                        onClick={() => handleStartEvaluation(crew)}
                        className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-500/30 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                      >
                        <ClipboardCheck className="w-3.5 h-3.5" />
                        {crewRatings[crew.id] ? 'Re-evaluate' : 'Evaluate'}
                      </button>
                    </div>
                  </div>
                ))}

                {evaluatedCount > 0 && (
                  <div className="flex flex-col sm:flex-row gap-3 mt-4">
                    {allEvaluated && (
                      <button
                        onClick={handleSubmitAll}
                        className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-green-500/25 cursor-pointer flex items-center justify-center gap-2 text-sm"
                      >
                        <Send className="w-4 h-4" /> Submit All Evaluations
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab: Past Flights */}
        {activeTab === 'past' && (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Past Flight Evaluations</h2>
            <div className="space-y-3">
              {PAST_FLIGHTS.map((flight) => (
                <div
                  key={flight.id}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5 hover:bg-white/[0.07] transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center shrink-0">
                        <Plane className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-sm sm:text-base">{flight.flightNo}</h3>
                        <p className="text-blue-200/50 text-xs sm:text-sm">{flight.route} &middot; {flight.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 sm:gap-6">
                      <div className="text-center">
                        <p className="text-white font-semibold text-sm">{flight.crewCount}</p>
                        <p className="text-blue-200/40 text-[10px] uppercase tracking-wider">Crew</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-yellow-400 font-semibold text-sm">{flight.avgRating}</span>
                        </div>
                        <p className="text-blue-200/40 text-[10px] uppercase tracking-wider">Avg Rating</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-blue-200/30 hidden sm:block" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Crew Profiles */}
        {activeTab === 'profiles' && (
          <div>
            {selectedProfile ? (
              <div>
                <button
                  onClick={() => setSelectedProfile(null)}
                  className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm mb-6 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to profiles
                </button>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6 sm:p-8 mb-6">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-500/20">
                      {selectedProfile.avatar}
                    </div>
                    <div className="text-center sm:text-left">
                      <h2 className="text-2xl font-bold text-white">{selectedProfile.name}</h2>
                      <p className="text-blue-200/60 text-sm mt-1">{selectedProfile.role}</p>
                      <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
                        <StarRating rating={Math.round(selectedProfile.avgRating)} />
                        <span className="text-yellow-400 font-semibold">{selectedProfile.avgRating}</span>
                        <span className="text-blue-200/40 text-sm">average</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                    <BarChart3 className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{selectedProfile.avgRating}</p>
                    <p className="text-blue-200/50 text-xs mt-1">Average Rating</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                    <Clock className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{selectedProfile.flights}</p>
                    <p className="text-blue-200/50 text-xs mt-1">Total Flights</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                    <Award className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{selectedProfile.evaluations}</p>
                    <p className="text-blue-200/50 text-xs mt-1">Evaluations</p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                  <h3 className="text-white font-semibold mb-4 text-sm">Recent Evaluation Breakdown</h3>
                  <div className="space-y-3">
                    {EVALUATION_CRITERIA.map((criteria) => {
                      const score = (Math.random() * 2 + 3).toFixed(1);
                      const pct = (parseFloat(score) / 5) * 100;
                      return (
                        <div key={criteria}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-blue-200/70">{criteria}</span>
                            <span className="text-sm text-white font-medium">{score}/5</span>
                          </div>
                          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Crew Profiles</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {CREW_PROFILES.map((profile) => (
                    <button
                      key={profile.id}
                      onClick={() => setSelectedProfile(profile)}
                      className="bg-white/5 border border-white/10 rounded-xl p-5 text-left hover:bg-white/[0.07] hover:border-white/20 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                          {profile.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold text-sm truncate">{profile.name}</h3>
                          <p className="text-blue-200/50 text-xs truncate">{profile.role}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-blue-200/30 group-hover:text-blue-400 transition-colors shrink-0" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-yellow-400 font-semibold text-sm">{profile.avgRating}</span>
                          <span className="text-blue-200/40 text-xs">avg</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-blue-200/50">
                          <span>{profile.flights} flights</span>
                          <span>{profile.evaluations} evals</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
