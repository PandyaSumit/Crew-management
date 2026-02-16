import type {
  CrewMember,
  Flight,
  PastFlight,
  PerformanceData,
  CabinCrewCategory,
  PurserSection,
} from '../types';

export const performanceData: PerformanceData[] = [
  { category: 'Professional Image', year2025: 78, year2026: 85, fullMark: 100 },
  { category: 'SOP Adherence', year2025: 82, year2026: 88, fullMark: 100 },
  { category: 'Passenger Service', year2025: 75, year2026: 82, fullMark: 100 },
  { category: 'Teamwork & CRM', year2025: 88, year2026: 91, fullMark: 100 },
  { category: 'Situational Competence', year2025: 70, year2026: 79, fullMark: 100 },
];

export const crewMembers: CrewMember[] = [
  {
    id: 'CC001',
    name: 'Ahmed Hassan',
    photo: '',
    role: 'Cabin Crew',
    joinDate: '2020-03-15',
    contact: 'ahmed.hassan@aircairo.com',
    previousPerformance: 'excellent',
    evaluationStatus: 'Not Started',
  },
  {
    id: 'CC002',
    name: 'Sara Mohamed',
    photo: '',
    role: 'Cabin Crew',
    joinDate: '2019-07-22',
    contact: 'sara.mohamed@aircairo.com',
    previousPerformance: 'good',
    evaluationStatus: 'In Progress',
  },
  {
    id: 'CC003',
    name: 'Omar Khaled',
    photo: '',
    role: 'Cabin Crew',
    joinDate: '2021-01-10',
    contact: 'omar.khaled@aircairo.com',
    previousPerformance: 'average',
    evaluationStatus: 'Not Started',
  },
  {
    id: 'PS001',
    name: 'Fatma Ali',
    photo: '',
    role: 'Purser',
    joinDate: '2017-05-18',
    contact: 'fatma.ali@aircairo.com',
    previousPerformance: 'excellent',
    evaluationStatus: 'Completed',
  },
  {
    id: 'CC004',
    name: 'Youssef Ibrahim',
    photo: '',
    role: 'Cabin Crew',
    joinDate: '2022-09-01',
    contact: 'youssef.ibrahim@aircairo.com',
    previousPerformance: 'needs-improvement',
    evaluationStatus: 'Not Started',
  },
  {
    id: 'PS002',
    name: 'Nour El-Din',
    photo: '',
    role: 'Purser',
    joinDate: '2018-11-20',
    contact: 'nour.eldin@aircairo.com',
    previousPerformance: 'good',
    evaluationStatus: 'Not Started',
  },
];

export const currentFlight: Flight = {
  id: 'FL001',
  flightNumber: 'SM 302',
  route: 'CAI → DXB',
  aircraft: 'A320',
  date: '2026-02-16',
  crew: crewMembers,
};

export const flights: Flight[] = [
  currentFlight,
  {
    id: 'FL002',
    flightNumber: 'SM 415',
    route: 'CAI → JED',
    aircraft: 'A321',
    date: '2026-02-15',
    crew: crewMembers.slice(0, 4),
  },
  {
    id: 'FL003',
    flightNumber: 'SM 108',
    route: 'CAI → RUH',
    aircraft: 'A320',
    date: '2026-02-14',
    crew: crewMembers.slice(1, 5),
  },
];

export const pastFlights: PastFlight[] = [
  { id: 'PF001', date: '2026-02-10', flightNumber: 'SM 201', route: 'CAI → LHR', crewMemberName: 'Ahmed Hassan', crewMemberId: 'CC001', role: 'Cabin Crew', overallScore: 87, status: 'Completed' },
  { id: 'PF002', date: '2026-02-08', flightNumber: 'SM 305', route: 'CAI → CDG', crewMemberName: 'Sara Mohamed', crewMemberId: 'CC002', role: 'Cabin Crew', overallScore: 92, status: 'Completed' },
  { id: 'PF003', date: '2026-02-05', flightNumber: 'SM 412', route: 'CAI → FRA', crewMemberName: 'Fatma Ali', crewMemberId: 'PS001', role: 'Purser', overallScore: 95, status: 'Completed' },
  { id: 'PF004', date: '2026-01-28', flightNumber: 'SM 102', route: 'CAI → IST', crewMemberName: 'Omar Khaled', crewMemberId: 'CC003', role: 'Cabin Crew', overallScore: 74, status: 'Completed' },
  { id: 'PF005', date: '2026-01-25', flightNumber: 'SM 510', route: 'CAI → AMM', crewMemberName: 'Youssef Ibrahim', crewMemberId: 'CC004', role: 'Cabin Crew', overallScore: 65, status: 'Completed' },
  { id: 'PF006', date: '2026-01-20', flightNumber: 'SM 220', route: 'CAI → FCO', crewMemberName: 'Nour El-Din', crewMemberId: 'PS002', role: 'Purser', overallScore: 88, status: 'Completed' },
  { id: 'PF007', date: '2026-01-15', flightNumber: 'SM 305', route: 'CAI → CDG', crewMemberName: 'Ahmed Hassan', crewMemberId: 'CC001', role: 'Cabin Crew', overallScore: 83, status: 'Completed' },
  { id: 'PF008', date: '2026-01-10', flightNumber: 'SM 201', route: 'CAI → LHR', crewMemberName: 'Sara Mohamed', crewMemberId: 'CC002', role: 'Cabin Crew', overallScore: 90, status: 'Completed' },
  { id: 'PF009', date: '2025-12-20', flightNumber: 'SM 108', route: 'CAI → RUH', crewMemberName: 'Fatma Ali', crewMemberId: 'PS001', role: 'Purser', overallScore: 93, status: 'Completed' },
  { id: 'PF010', date: '2025-12-15', flightNumber: 'SM 412', route: 'CAI → FRA', crewMemberName: 'Omar Khaled', crewMemberId: 'CC003', role: 'Cabin Crew', overallScore: 71, status: 'Completed' },
];

export const cabinCrewCategories: CabinCrewCategory[] = [
  {
    id: 'cat1',
    name: 'Professional Image & Conduct',
    criteria: [
      { id: 'c1_1', name: 'Grooming and uniform compliance', weights: { U: 0, N: 25, M: 50, E: 75, O: 100 } },
      { id: 'c1_2', name: 'Punctuality and attendance', weights: { U: 0, N: 25, M: 50, E: 75, O: 100 } },
      { id: 'c1_3', name: 'Professional demeanor and attitude', weights: { U: 0, N: 25, M: 50, E: 75, O: 100 } },
      { id: 'c1_4', name: 'Communication skills (verbal & non-verbal)', weights: { U: 0, N: 25, M: 50, E: 75, O: 100 } },
    ],
  },
  {
    id: 'cat2',
    name: 'Adherence to SOPs',
    criteria: [
      { id: 'c2_1', name: 'Pre-flight safety check completion', weights: { U: 0, N: 25, M: 50, E: 75, O: 100 } },
      { id: 'c2_2', name: 'Boarding procedure compliance', weights: { U: 0, N: 25, M: 50, E: 75, O: 100 } },
      { id: 'c2_3', name: 'Safety demonstration accuracy', weights: { U: 0, N: 25, M: 50, E: 75, O: 100 } },
      { id: 'c2_4', name: 'In-flight service procedure adherence', weights: { U: 0, N: 25, M: 50, E: 75, O: 100 } },
      { id: 'c2_5', name: 'Cabin securing for takeoff/landing', weights: { U: 0, N: 25, M: 50, E: 75, O: 100 } },
      { id: 'c2_6', name: 'Emergency equipment knowledge', weights: { U: 0, N: 25, M: 50, E: 75, O: 100 } },
      { id: 'c2_7', name: 'Documentation and reporting accuracy', weights: { U: 0, N: 25, M: 50, E: 75, O: 100 } },
    ],
  },
  {
    id: 'cat3',
    name: 'Passenger Service Excellence',
    criteria: [
      { id: 'c3_1', name: 'Passenger greeting and engagement', weights: { U: 0, N: 25, M: 50, E: 75, O: 100 } },
      { id: 'c3_2', name: 'Service delivery quality and timeliness', weights: { U: 0, N: 25, M: 50, E: 75, O: 100 } },
      { id: 'c3_3', name: 'Handling passenger requests and complaints', weights: { U: 0, N: 25, M: 50, E: 75, O: 100 } },
      { id: 'c3_4', name: 'Special needs passenger assistance', weights: { U: 0, N: 25, M: 50, E: 75, O: 100 } },
    ],
  },
  {
    id: 'cat4',
    name: 'Teamwork & CRM',
    criteria: [
      { id: 'c4_1', name: 'Crew coordination and cooperation', weights: { U: 0, N: 25, M: 50, E: 75, O: 100 } },
      { id: 'c4_2', name: 'Effective communication with team members', weights: { U: 0, N: 25, M: 50, E: 75, O: 100 } },
    ],
  },
  {
    id: 'cat5',
    name: 'Abnormal Situational Competence',
    criteria: [
      { id: 'c5_1', name: 'Response to abnormal/emergency scenarios', weights: { U: 0, N: 25, M: 50, E: 75, O: 100 } },
      { id: 'c5_2', name: 'Decision-making under pressure', weights: { U: 0, N: 25, M: 50, E: 75, O: 100 } },
    ],
  },
];

export const purserSections: PurserSection[] = [
  {
    id: 'ps1',
    name: 'Pre-Flight Briefing',
    items: [
      { id: 'p1_1', name: 'Conducts thorough crew briefing', isSafetyCritical: true },
      { id: 'p1_2', name: 'Reviews safety and emergency procedures', isSafetyCritical: true },
      { id: 'p1_3', name: 'Assigns crew positions and duties', isSafetyCritical: false },
      { id: 'p1_4', name: 'Communicates special passenger requirements', isSafetyCritical: false },
      { id: 'p1_5', name: 'Reviews catering and service plan', isSafetyCritical: false },
      { id: 'p1_6', name: 'Confirms crew documentation compliance', isSafetyCritical: false },
      { id: 'p1_7', name: 'Briefs security procedures', isSafetyCritical: true },
      { id: 'p1_8', name: 'Discusses weather and route information', isSafetyCritical: false },
      { id: 'p1_9', name: 'Sets service standards expectations', isSafetyCritical: false },
    ],
  },
  {
    id: 'ps2',
    name: 'Pre-Flight Cabin Preparation',
    items: [
      { id: 'p2_1', name: 'Verifies emergency equipment status', isSafetyCritical: true },
      { id: 'p2_2', name: 'Checks cabin cleanliness and readiness', isSafetyCritical: false },
      { id: 'p2_3', name: 'Confirms catering load and quality', isSafetyCritical: false },
      { id: 'p2_4', name: 'Inspects galley setup and equipment', isSafetyCritical: false },
      { id: 'p2_5', name: 'Verifies IFE system functionality', isSafetyCritical: false },
      { id: 'p2_6', name: 'Confirms safety card placement', isSafetyCritical: true },
    ],
  },
  {
    id: 'ps3',
    name: 'Boarding & Pre-Takeoff',
    items: [
      { id: 'p3_1', name: 'Supervises boarding process', isSafetyCritical: false },
      { id: 'p3_2', name: 'Manages seating conflicts', isSafetyCritical: false },
      { id: 'p3_3', name: 'Ensures overhead bin compliance', isSafetyCritical: true },
      { id: 'p3_4', name: 'Coordinates with flight deck', isSafetyCritical: true },
      { id: 'p3_5', name: 'Verifies cabin secure for takeoff', isSafetyCritical: true },
      { id: 'p3_6', name: 'Supervises safety demonstration', isSafetyCritical: true },
      { id: 'p3_7', name: 'Handles pre-departure announcements', isSafetyCritical: false },
    ],
  },
  {
    id: 'ps4',
    name: 'In-Flight',
    items: [
      { id: 'p4_1', name: 'Manages cabin service delivery', isSafetyCritical: false },
      { id: 'p4_2', name: 'Monitors crew performance', isSafetyCritical: false },
      { id: 'p4_3', name: 'Handles passenger complaints professionally', isSafetyCritical: false },
      { id: 'p4_4', name: 'Manages turbulence procedures', isSafetyCritical: true },
      { id: 'p4_5', name: 'Coordinates meal and beverage service', isSafetyCritical: false },
      { id: 'p4_6', name: 'Conducts cabin checks', isSafetyCritical: true },
      { id: 'p4_7', name: 'Manages duty-free sales process', isSafetyCritical: false },
      { id: 'p4_8', name: 'Handles medical situations', isSafetyCritical: true },
      { id: 'p4_9', name: 'Maintains communication with flight deck', isSafetyCritical: true },
    ],
  },
  {
    id: 'ps5',
    name: 'Pre-Landing & Disembarkation',
    items: [
      { id: 'p5_1', name: 'Supervises cabin preparation for landing', isSafetyCritical: true },
      { id: 'p5_2', name: 'Ensures crew in positions for landing', isSafetyCritical: true },
      { id: 'p5_3', name: 'Manages arrival announcements', isSafetyCritical: false },
      { id: 'p5_4', name: 'Coordinates with ground services', isSafetyCritical: false },
      { id: 'p5_5', name: 'Supervises orderly disembarkation', isSafetyCritical: false },
      { id: 'p5_6', name: 'Handles connecting passenger assistance', isSafetyCritical: false },
      { id: 'p5_7', name: 'Verifies cabin post-disembarkation', isSafetyCritical: false },
    ],
  },
  {
    id: 'ps6',
    name: 'Post Flight',
    items: [
      { id: 'p6_1', name: 'Conducts crew debrief', isSafetyCritical: false },
      { id: 'p6_2', name: 'Completes flight reports', isSafetyCritical: false },
      { id: 'p6_3', name: 'Documents incidents or irregularities', isSafetyCritical: true },
      { id: 'p6_4', name: 'Submits performance observations', isSafetyCritical: false },
    ],
  },
];
