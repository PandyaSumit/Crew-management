# AirCairo Crew Evaluation System

A comprehensive React + TypeScript application for evaluating cabin crew and purser performance according to AirCairo's Assessment Toolbox standards.

## Features

### 1. Dashboard
- **Performance Overview**: Radar chart comparing year-over-year performance across 5 assessment categories
- **Statistics Cards**: Total flights evaluated, average performance, pending evaluations, recent activity
- **Recent Evaluations List**: Quick view of latest assessments with color-coded scores

### 2. Flight Management
- **Current Flight View**: Display crew roster with real-time evaluation status
- **Crew Information**: ID, role, previous performance indicators, evaluation status
- **Quick Actions**: Start, continue, or view evaluation based on crew role and status

### 3. Cabin Crew Assessment

#### Categories & Criteria (19 total):
1. **Professional Image & Conduct** (4 criteria)
   - Punctuality (Reports for Duty on time)
   - Uniform is Complete, Clean & Standard
   - Self-Hygiene & BMI
   - Maintains a professional, Respectful & Composed demeanor

2. **Adherence to SOPs across all Flight Phases** (7 criteria)
   - Pre-Flight Briefing attendance & Engagement
   - Pre-Flight Safety Equipment Checks
   - Pre-Boarding Safety & Security procedures
   - Pre-Take off Duties & Securing Cabin Checks
   - Vigilance & Presence during In-Flight Phases
   - Pre-Landing Duties & Securing Cabin Checks
   - Proper Completion of post-Flight duties

3. **Passenger Service Excellence** (7 criteria)
   - Boarding: Creates a warm & Welcoming Impression
   - Boarding: Manage Boarding Process & Assists with Seating and Baggage
   - In-Flight: Visible and attentive in the cabin, gauges PAXs needs
   - In-Flight: Gauging Sale & Service Recovery Efficiently with Empathy
   - In-Flight: Collaborates effectively with team to ensure seamless Service
   - Disembarkation: Attentive, Courteous & Assist PAXs (PRM, UM, etc.)
   - Disembarkation: Catering Handover

4. **Teamwork, Collaboration & CRM** (2 criteria)
   - Communicates clearly, concisely with mutual understanding
   - Demonstrates flexibility and adaptability to raised situations

5. **Abnormal Situational Competence** (2 criteria)
   - Maintain strong situational awareness
   - Effective Emergency procedures & Drills Implementation

#### Rating System:
- **U** (Unsatisfactory) - Red
- **N** (Need Improvement) - Orange
- **M** (Meet Standard) - Green
- **E** (Exceeds Standard) - Blue
- **O** (Outstanding) - Purple

#### Remarks Requirements:
- **U & N**: Mandatory remarks highlighting gaps and recommended actions
- **M**: Remarks optional but encouraged
- **E & O**: Mandatory remarks acknowledging strengths and positive impact

#### Scoring System:
Each criterion has specific weight percentages per rating level. For example:
- Category 1 criteria: U=5%, N=10%, M=15%, E=20%, O=25%
- Category 2 Pre-Flight items: U=4%, N=8%, M=12%, E=16%, O=20%
- Category 4 criteria: U=10%, N=20%, M=30%, E=40%, O=50%

**Category scores** = Sum of all criterion weights within that category (max 100%)
**Overall score** = Average of all 5 category scores

### 4. Purser Assessment

#### Sections & Items (42 total):
1. **Pre-Flight Briefing** (9 items) - ★ 5 safety-critical
2. **Pre-Flight Cabin Preparation** (6 items) - ★ 2 safety-critical
3. **Boarding & Pre-Takeoff Preparation** (7 items) - ★ 4 safety-critical
4. **In-Flight** (9 items) - ★ 2 safety-critical
5. **Pre-Landing & Disembarkation** (7 items) - ★ 3 safety-critical
6. **Post Flight** (4 items)

#### Rating System:
- **N** (Not Achieved / Not-yet Competent) - Orange
- **R** (Require Improvement) - Blue
- **A** (Achieved / Competent) - Green

#### Safety-Critical Items (★):
Items marked with ★ are mandatory pass criteria. Any failure to demonstrate competence on safety-critical items results in unsuccessful assessment.

### 5. Past Flights
- **Search & Filter**: By crew name, flight number, route, performance level, and role
- **Performance Tracking**: Color-coded score display with direct links to crew profiles
- **Evaluation History**: Complete record of all assessments with timestamps

### 6. Crew Profiles
- **Personal Information**: ID, role, join date, contact information
- **Performance Metrics**:
  - Average score across all evaluations
  - Category performance radar chart
  - Performance trend line over time
- **Strengths & Development Areas**: Auto-identified from evaluation patterns
- **Evaluation History**: Complete list of recent assessments

## Technical Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI) v6
- **Routing**: React Router v6
- **Charts**: Recharts
- **Styling**: Emotion (CSS-in-JS via MUI)

## Design System

### Brand Colors
- **Primary Purple**: #4A1D70 (AirCairo brand)
- **Secondary Orange**: #FF6B35 (accent color)
- **Background**: #F5F5F7 (light gray)
- **Text**: #1A1A2E (primary), #5A5A7A (secondary)

### Rating Colors
- **U (Unsatisfactory)**: #D32F2F (red)
- **N (Need Improvement)**: #F57C00 (orange)
- **M (Meet Standard)**: #66BB6A (green)
- **E (Exceeds Standard)**: #1976D2 (blue)
- **O (Outstanding)**: #7B1FA2 (purple)

### Design Principles
- Clean, minimalist interface
- No gradients or heavy animations
- Professional, functional layout
- Clear visual hierarchy
- Tablet-optimized for in-flight use

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Assessment Philosophy

**"Assessment is not just about scoring—it's about fairness, guiding growth and excellence."**

The system is designed to:
- ✓ Provide transparent, objective evaluations
- ✓ Support professional development through actionable feedback
- ✓ Maintain consistent standards across all evaluators
- ✓ Track performance trends over time
- ✓ Ensure safety-critical competencies are validated
- ✓ Foster a culture of continuous improvement

---

Built with React + TypeScript + Material-UI for AirCairo cabin crew training department.
