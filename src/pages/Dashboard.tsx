import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from '@mui/material';
import FlightIcon from '@mui/icons-material/Flight';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import UpdateIcon from '@mui/icons-material/Update';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { performanceData, pastFlights } from '../data/mockData';

const statCards = [
  {
    title: 'Total Flights Evaluated',
    value: '156',
    icon: <FlightIcon />,
    color: '#4A1D70',
  },
  {
    title: 'Average Performance',
    value: '84.2%',
    icon: <TrendingUpIcon />,
    color: '#388E3C',
  },
  {
    title: 'Pending Evaluations',
    value: '12',
    icon: <PendingActionsIcon />,
    color: '#F57C00',
  },
  {
    title: 'Recent Activity',
    value: '8 today',
    icon: <UpdateIcon />,
    color: '#1976D2',
  },
];

export default function Dashboard() {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Performance Overview
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statCards.map((card) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={card.title}>
            <Card>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2.5 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: `${card.color}14`,
                    color: card.color,
                  }}
                >
                  {card.icon}
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                    {card.title}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {card.value}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Assessment Categories — Year Comparison
              </Typography>
              <ResponsiveContainer width="100%" height={380}>
                <RadarChart data={performanceData} cx="50%" cy="50%" outerRadius="70%">
                  <PolarGrid stroke="#E8E8EE" />
                  <PolarAngleAxis
                    dataKey="category"
                    tick={{ fontSize: 11, fill: '#5A5A7A' }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fontSize: 10, fill: '#999' }}
                  />
                  <Tooltip />
                  <Radar
                    name="2025"
                    dataKey="year2025"
                    stroke="#FF6B35"
                    fill="#FF6B35"
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                  <Radar
                    name="2026"
                    dataKey="year2026"
                    stroke="#4A1D70"
                    fill="#4A1D70"
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Recent Evaluations
              </Typography>
              {pastFlights.slice(0, 6).map((flight) => (
                <Box
                  key={flight.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1.5,
                    borderBottom: '1px solid #F0F0F5',
                    '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                      {flight.crewMemberName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {flight.flightNumber} • {flight.route} • {flight.date}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      bgcolor:
                        flight.overallScore >= 90
                          ? '#E8F5E9'
                          : flight.overallScore >= 75
                          ? '#E3F2FD'
                          : flight.overallScore >= 60
                          ? '#FFF3E0'
                          : '#FFEBEE',
                      color:
                        flight.overallScore >= 90
                          ? '#2E7D32'
                          : flight.overallScore >= 75
                          ? '#1565C0'
                          : flight.overallScore >= 60
                          ? '#E65100'
                          : '#C62828',
                    }}
                  >
                    {flight.overallScore}%
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
