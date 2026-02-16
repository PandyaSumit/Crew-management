import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import FlightView from './pages/FlightView';
import CabinCrewAssessment from './pages/CabinCrewAssessment';
import PurserAssessment from './pages/PurserAssessment';
import PastFlights from './pages/PastFlights';
import CrewProfiles from './pages/CrewProfiles';
import CrewProfile from './pages/CrewProfile';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/flight" element={<FlightView />} />
            <Route path="/evaluate/cabin-crew/:flightId/:crewId" element={<CabinCrewAssessment />} />
            <Route path="/evaluate/purser/:flightId/:crewId" element={<PurserAssessment />} />
            <Route path="/past-flights" element={<PastFlights />} />
            <Route path="/crew" element={<CrewProfiles />} />
            <Route path="/crew/:crewId" element={<CrewProfile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
