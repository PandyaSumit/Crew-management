import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectPlans from "./pages/ProjectPlans";
import PlanCanvas from "./pages/PlanCanvas";
import FlightView from "./pages/FlightView";
import FlightList from "./pages/FlightList";
import CabinCrewAssessment from "./pages/CabinCrewAssessment";
import PurserAssessment from "./pages/PurserAssessment";
import PastFlights from "./pages/PastFlights";
import CrewProfiles from "./pages/CrewProfiles";
import CrewProfile from "./pages/CrewProfile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./pages/ProtectedRoute";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:projectId/plans" element={<ProjectPlans />} />
            <Route path="/projects/:projectId/plans/:planId" element={<PlanCanvas />} />
            <Route path="/flights" element={<FlightList />} />
            <Route path="/flights/:flightId" element={<FlightView />} />
            <Route
              path="/evaluate/cabin-crew/:flightId/:crewId"
              element={<CabinCrewAssessment />}
            />
            <Route
              path="/evaluate/purser/:flightId/:crewId"
              element={<PurserAssessment />}
            />
            <Route path="/past-flights" element={<PastFlights />} />
            <Route path="/crew" element={<CrewProfiles />} />
            <Route path="/crew/:crewId" element={<CrewProfile />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
