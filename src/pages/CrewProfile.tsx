import { useParams, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { crewMembers, pastFlights } from '../data/mockData';
import { performanceBadgeColors } from '../theme';

const categoryPerformance = [
  { category: 'Professional Image', score: 85 },
  { category: 'SOP Adherence', score: 88 },
  { category: 'Passenger Service', score: 82 },
  { category: 'Teamwork & CRM', score: 91 },
  { category: 'Situational Competence', score: 79 },
];

export default function CrewProfile() {
  const { crewId } = useParams();
  const navigate = useNavigate();

  const member = crewMembers.find((c) => c.id === crewId);
  const memberFlights = pastFlights.filter((f) => f.crewMemberId === crewId);

  const trendData = memberFlights
    .slice()
    .reverse()
    .map((f) => ({
      date: f.date.slice(5),
      score: f.overallScore,
    }));

  if (!member) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Crew member not found.</Typography>
        <Button onClick={() => navigate('/crew')} sx={{ mt: 2 }}>
          Back to Profiles
        </Button>
      </Box>
    );
  }

  const avgScore =
    memberFlights.length > 0
      ? Math.round(memberFlights.reduce((acc, f) => acc + f.overallScore, 0) / memberFlights.length)
      : 0;

  const strengths = categoryPerformance
    .filter((c) => c.score >= 85)
    .map((c) => c.category);
  const developmentAreas = categoryPerformance
    .filter((c) => c.score < 80)
    .map((c) => c.category);

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/crew')}
        size="small"
        sx={{ color: 'text.secondary', mb: 2 }}
      >
        Back to Profiles
      </Button>

      {/* Personal Info */}
      <Card sx={{ mb: 2 }}>
        <CardContent
          sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap', py: 3 }}
        >
          <Avatar sx={{ width: 80, height: 80, bgcolor: '#4A1D70', fontSize: '2rem' }}>
            <PersonIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography variant="h5" sx={{ mb: 0.5 }}>
              {member.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 1 }}>
              <Chip
                label={member.role}
                size="small"
                sx={{ bgcolor: '#4A1D7014', color: '#4A1D70', fontWeight: 500 }}
              />
              <Chip
                label={member.previousPerformance.replace('-', ' ')}
                size="small"
                sx={{
                  bgcolor: `${performanceBadgeColors[member.previousPerformance]}18`,
                  color: performanceBadgeColors[member.previousPerformance],
                  textTransform: 'capitalize',
                  fontWeight: 500,
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', color: 'text.secondary' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <BadgeIcon sx={{ fontSize: 16 }} />
                <Typography variant="body2">{member.id}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CalendarTodayIcon sx={{ fontSize: 16 }} />
                <Typography variant="body2">Joined {member.joinDate}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <EmailIcon sx={{ fontSize: 16 }} />
                <Typography variant="body2">{member.contact}</Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Average Score
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
              {avgScore}%
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* Category Radar */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Category Performance
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={categoryPerformance}>
                  <PolarGrid stroke="#E8E8EE" />
                  <PolarAngleAxis dataKey="category" tick={{ fontSize: 10, fill: '#5A5A7A' }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9 }} />
                  <Radar
                    dataKey="score"
                    stroke="#4A1D70"
                    fill="#4A1D70"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Trend Line */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Performance Trend
              </Typography>
              {trendData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8E8EE" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis domain={[50, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#4A1D70"
                      strokeWidth={2}
                      dot={{ fill: '#4A1D70', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Box
                  sx={{
                    height: 280,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    No evaluation data available
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Strengths & Development */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1.5, color: '#2E7D32' }}>
                Strengths
              </Typography>
              {strengths.length > 0 ? (
                strengths.map((s) => (
                  <Box
                    key={s}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      py: 1,
                      borderBottom: '1px solid #F0F0F5',
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: '#2E7D32',
                      }}
                    />
                    <Typography variant="body2">{s}</Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  No identified strengths yet
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1.5, color: '#E65100' }}>
                Development Areas
              </Typography>
              {developmentAreas.length > 0 ? (
                developmentAreas.map((d) => (
                  <Box
                    key={d}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      py: 1,
                      borderBottom: '1px solid #F0F0F5',
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: '#E65100',
                      }}
                    />
                    <Typography variant="body2">{d}</Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  No development areas identified
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Evaluations */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Recent Evaluations
          </Typography>
          {memberFlights.length === 0 ? (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              No evaluations found for this crew member.
            </Typography>
          ) : (
            memberFlights.map((flight) => {
              const scoreColor =
                flight.overallScore >= 90
                  ? { bg: '#E8F5E9', text: '#2E7D32' }
                  : flight.overallScore >= 75
                  ? { bg: '#E3F2FD', text: '#1565C0' }
                  : flight.overallScore >= 60
                  ? { bg: '#FFF3E0', text: '#E65100' }
                  : { bg: '#FFEBEE', text: '#C62828' };
              return (
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
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {flight.flightNumber} — {flight.route}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {flight.date}
                    </Typography>
                  </Box>
                  <Chip
                    label={`${flight.overallScore}%`}
                    size="small"
                    sx={{
                      bgcolor: scoreColor.bg,
                      color: scoreColor.text,
                      fontWeight: 600,
                    }}
                  />
                </Box>
              );
            })
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
