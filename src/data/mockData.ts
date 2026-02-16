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
    name: '1. Professional Image & Conduct',
    criteria: [
      { id: 'c1_1', name: 'Punctuality (Reports for Duty on time)', weights: { U: 5, N: 10, M: 15, E: 20, O: 25 } },
      { id: 'c1_2', name: 'Uniform is Complete, Clean & Standard', weights: { U: 5, N: 10, M: 15, E: 20, O: 25 } },
      { id: 'c1_3', name: 'Self-Hygiene & BMI', weights: { U: 5, N: 10, M: 15, E: 20, O: 25 } },
      { id: 'c1_4', name: 'Maintains a professional, Respectful & Composed demeanor', weights: { U: 5, N: 10, M: 15, E: 20, O: 25 } },
    ],
  },
  {
    id: 'cat2',
    name: '2. Adherence to SOPs across all Flight Phases',
    criteria: [
      { id: 'c2_1', name: 'Pre-Flight Briefing attendance & Engagement', weights: { U: 4, N: 8, M: 12, E: 16, O: 20 } },
      { id: 'c2_2', name: 'Pre-Flight Safety Equipment Checks', weights: { U: 4, N: 8, M: 12, E: 16, O: 20 } },
      { id: 'c2_3', name: 'Pre-Boarding Safety & Security procedures', weights: { U: 4, N: 8, M: 12, E: 16, O: 20 } },
      { id: 'c2_4', name: 'Pre-Take off Duties & Securing Cabin Checks', weights: { U: 2, N: 4, M: 6, E: 8, O: 10 } },
      { id: 'c2_5', name: 'Vigilance & Presence during In-Flight Phases', weights: { U: 2, N: 4, M: 6, E: 8, O: 10 } },
      { id: 'c2_6', name: 'Pre-Landing Duties & Securing Cabin Checks', weights: { U: 2, N: 4, M: 6, E: 8, O: 10 } },
      { id: 'c2_7', name: 'Proper Completion of post-Flight duties', weights: { U: 2, N: 4, M: 6, E: 8, O: 10 } },
    ],
  },
  {
    id: 'cat3',
    name: '3. Passenger Service Excellence',
    criteria: [
      { id: 'c3_1', name: 'Boarding: Creates a warm & Welcoming Impression', weights: { U: 2, N: 4, M: 6, E: 8, O: 10 } },
      { id: 'c3_2', name: 'Boarding: Manage Boarding Process & Assists with Seating and Baggage', weights: { U: 2, N: 4, M: 6, E: 8, O: 10 } },
      { id: 'c3_3', name: 'In-Flight: Visible and attentive in the cabin, gauges PAXs needs', weights: { U: 4, N: 8, M: 12, E: 16, O: 20 } },
      { id: 'c3_4', name: 'In-Flight: Gauging Sale & Service Recovery Efficiently with Empathy', weights: { U: 4, N: 8, M: 12, E: 16, O: 20 } },
      { id: 'c3_5', name: 'In-Flight: Collaborates effectively with team to ensure seamless Service', weights: { U: 4, N: 8, M: 12, E: 16, O: 20 } },
      { id: 'c3_6', name: 'Disembarkation: Attentive, Courteous & Assist PAXs (PRM, UM, etc.)', weights: { U: 2, N: 4, M: 6, E: 8, O: 10 } },
      { id: 'c3_7', name: 'Disembarkation: Catering Handover', weights: { U: 2, N: 4, M: 6, E: 8, O: 10 } },
    ],
  },
  {
    id: 'cat4',
    name: '4. Teamwork, Collaboration & CRM',
    criteria: [
      { id: 'c4_1', name: 'Communicates clearly, concisely with mutual understanding', weights: { U: 10, N: 20, M: 30, E: 40, O: 50 } },
      { id: 'c4_2', name: 'Demonstrates flexibility and adaptability to raised situations', weights: { U: 10, N: 20, M: 30, E: 40, O: 50 } },
    ],
  },
  {
    id: 'cat5',
    name: '5. Abnormal Situational Competence',
    criteria: [
      { id: 'c5_1', name: 'Maintain strong situational awareness', weights: { U: 8, N: 16, M: 24, E: 32, O: 40 } },
      { id: 'c5_2', name: 'Effective Emergency procedures & Drills Implementation', weights: { U: 12, N: 24, M: 36, E: 48, O: 60 } },
    ],
  },
];

export const purserSections: PurserSection[] = [
  {
    id: 'ps1',
    name: '1. Pre-Flight Briefing',
    items: [
      { id: 'p1_1', name: 'Punctuality', isSafetyCritical: true },
      { id: 'p1_2', name: 'Grooming Standard', isSafetyCritical: false },
      { id: 'p1_3', name: 'Team introduction, Formation & Fit-to-Fly', isSafetyCritical: false },
      { id: 'p1_4', name: 'Checking crew documents, Equipment & Extras', isSafetyCritical: true },
      { id: 'p1_5', name: 'Discussing Company latest memos', isSafetyCritical: true },
      { id: 'p1_6', name: 'Passing Flight info', isSafetyCritical: false },
      { id: 'p1_7', name: 'Emphasizing SAFA protocol, Safety & Security Procedures', isSafetyCritical: true },
      { id: 'p1_8', name: 'Assess crew Safety and emergency knowledge', isSafetyCritical: true },
      { id: 'p1_9', name: 'Assigning tasks', isSafetyCritical: false },
    ],
  },
  {
    id: 'ps2',
    name: '2. Pre-Flight Cabin Preparation',
    items: [
      { id: 'p2_1', name: 'OTP onboard', isSafetyCritical: false },
      { id: 'p2_2', name: 'Emergency Equipment compatibility', isSafetyCritical: true },
      { id: 'p2_3', name: 'Crew Supervision and Standards Compliance', isSafetyCritical: false },
      { id: 'p2_4', name: 'Communication with all channels', isSafetyCritical: false },
      { id: 'p2_5', name: 'Managing and directing Security search & Protocol', isSafetyCritical: true },
      { id: 'p2_6', name: 'Declaring Cabin Readiness for Boarding', isSafetyCritical: false },
    ],
  },
  {
    id: 'ps3',
    name: '3. Boarding & Pre-Takeoff Preparation',
    items: [
      { id: 'p3_1', name: 'Crew Professional Presentation', isSafetyCritical: false },
      { id: 'p3_2', name: 'Boarding Process Oversight', isSafetyCritical: false },
      { id: 'p3_3', name: 'Handling PAXs Categories', isSafetyCritical: true },
      { id: 'p3_4', name: 'Receiving FLT related documents & Declaring All onboard', isSafetyCritical: true },
      { id: 'p3_5', name: 'Door Closure & Arming Protocol', isSafetyCritical: true },
      { id: 'p3_6', name: 'PA & Safety Demo Clarity', isSafetyCritical: true },
      { id: 'p3_7', name: 'Managing the Cabin Securing Process', isSafetyCritical: false },
    ],
  },
  {
    id: 'ps4',
    name: '4. In-Flight',
    items: [
      { id: 'p4_1', name: 'Regular Cabin & Cockpit Checks', isSafetyCritical: false },
      { id: 'p4_2', name: 'Flight Announcement', isSafetyCritical: false },
      { id: 'p4_3', name: 'Team Dynamics & Crew Performance Management', isSafetyCritical: false },
      { id: 'p4_4', name: 'Balance Timing & Flow of Service', isSafetyCritical: false },
      { id: 'p4_5', name: 'Clear Communication & CRM', isSafetyCritical: true },
      { id: 'p4_6', name: 'Compliance With Safety & Company Standards', isSafetyCritical: true },
      { id: 'p4_7', name: 'Rest & Fatigue Management', isSafetyCritical: false },
      { id: 'p4_8', name: 'Irregularities & Service Recovery', isSafetyCritical: false },
      { id: 'p4_9', name: 'Decision-making & Conflict Resolution Process', isSafetyCritical: false },
    ],
  },
  {
    id: 'ps5',
    name: '5. Pre-Landing & Disembarkation',
    items: [
      { id: 'p5_1', name: 'PA Announcement', isSafetyCritical: false },
      { id: 'p5_2', name: 'Cabin Pre-Landing checks', isSafetyCritical: true },
      { id: 'p5_3', name: 'Pre-Landing Clearance', isSafetyCritical: false },
      { id: 'p5_4', name: 'Cabin Ready Notification and declaration', isSafetyCritical: true },
      { id: 'p5_5', name: 'Disarming & Door Opening Protocol', isSafetyCritical: true },
      { id: 'p5_6', name: 'Documents Filling & Handovers', isSafetyCritical: false },
      { id: 'p5_7', name: 'Disembarkation Management', isSafetyCritical: false },
    ],
  },
  {
    id: 'ps6',
    name: '6. Post Flight',
    items: [
      { id: 'p6_1', name: 'Cabin Clearance', isSafetyCritical: false },
      { id: 'p6_2', name: 'Sales Handover', isSafetyCritical: false },
      { id: 'p6_3', name: 'Post-Flight Briefing', isSafetyCritical: false },
      { id: 'p6_4', name: 'Organizational Feedback & Reporting', isSafetyCritical: false },
    ],
  },
];
