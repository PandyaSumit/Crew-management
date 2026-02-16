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
        sx={{
          color: 'text.secondary',
          mb: 3,
          '&:hover': { bgcolor: 'action.hover' },
        }}
      >
        Back to Profiles
      </Button>

      {/* Personal Info */}
      <Card
        sx={{
          mb: 4,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        <CardContent
          sx={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap', py: 4, px: 4 }}
        >
          <Avatar
            sx={{
              width: 96,
              height: 96,
              bgcolor: '#4A1D70',
              fontSize: '2rem',
              boxShadow: '0 4px 12px rgba(74, 29, 112, 0.2)',
            }}
          >
            <PersonIcon sx={{ fontSize: 48 }} />
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 250 }}>
            <Typography
              variant="h4"
              sx={{
                mb: 1.5,
                fontWeight: 600,
                letterSpacing: '-0.02em',
              }}
            >
              {member.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 2 }}>
              <Chip
                label={member.role}
                size="small"
                sx={{
                  bgcolor: '#4A1D7014',
                  color: '#4A1D70',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  height: 28,
                  borderRadius: '6px',
                  border: '1px solid #4A1D7030',
                }}
              />
              <Chip
                label={member.previousPerformance.replace('-', ' ')}
                size="small"
                sx={{
                  bgcolor: `${performanceBadgeColors[member.previousPerformance]}18`,
                  color: performanceBadgeColors[member.previousPerformance],
                  textTransform: 'capitalize',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  height: 28,
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: `${performanceBadgeColors[member.previousPerformance]}30`,
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', color: 'text.secondary' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <BadgeIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                  {member.id}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <CalendarTodayIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                  Joined {member.joinDate}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <EmailIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                  {member.contact}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              textAlign: 'center',
              px: 3,
              py: 2,
              bgcolor: 'primary.main',
              borderRadius: 2,
              minWidth: 120,
              boxShadow: '0 2px 8px rgba(74, 29, 112, 0.2)',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: 'rgba(255,255,255,0.8)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              Average Score
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: '#fff',
                mt: 0.5,
                letterSpacing: '-0.02em',
              }}
            >
              {avgScore}%
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Category Radar */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              height: '100%',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 3,
                  fontWeight: 600,
                  fontSize: '1.125rem',
                  letterSpacing: '-0.01em',
                }}
              >
                Category Performance
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={categoryPerformance}>
                  <PolarGrid stroke="#E0E0E8" strokeWidth={1} />
                  <PolarAngleAxis
                    dataKey="category"
                    tick={{ fontSize: 11, fill: '#5A5A7A', fontWeight: 500 }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fontSize: 10, fill: '#8A8A9A' }}
                  />
                  <Radar
                    dataKey="score"
                    stroke="#4A1D70"
                    fill="#4A1D70"
                    fillOpacity={0.25}
                    strokeWidth={2.5}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Trend Line */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              height: '100%',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 3,
                  fontWeight: 600,
                  fontSize: '1.125rem',
                  letterSpacing: '-0.01em',
                }}
              >
                Performance Trend
              </Typography>
              {trendData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData} margin={{ top: 5, right: 5, bottom: 5, left: -15 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8E8EE" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: '#5A5A7A' }}
                      stroke="#D0D0D8"
                    />
                    <YAxis
                      domain={[50, 100]}
                      tick={{ fontSize: 11, fill: '#5A5A7A' }}
                      stroke="#D0D0D8"
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: '1px solid #E8E8EE',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#4A1D70"
                      strokeWidth={3}
                      dot={{ fill: '#4A1D70', r: 5, strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Box
                  sx={{
                    height: 300,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'background.default',
                    borderRadius: 1,
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
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              height: '100%',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2.5,
                  color: '#2E7D32',
                  fontWeight: 600,
                  fontSize: '1.125rem',
                  letterSpacing: '-0.01em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 24,
                    bgcolor: '#2E7D32',
                    borderRadius: 1,
                  }}
                />
                Strengths
              </Typography>
              {strengths.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {strengths.map((s) => (
                    <Box
                      key={s}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        py: 1.5,
                        px: 2,
                        bgcolor: '#E8F5E9',
                        borderRadius: 1.5,
                        border: '1px solid #C8E6C9',
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: '#E8F5E9',
                          boxShadow: '0 2px 4px rgba(46, 125, 50, 0.1)',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: '#2E7D32',
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, fontSize: '0.875rem' }}
                      >
                        {s}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontStyle: 'italic',
                    textAlign: 'center',
                    py: 3,
                  }}
                >
                  No identified strengths yet
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              height: '100%',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2.5,
                  color: '#E65100',
                  fontWeight: 600,
                  fontSize: '1.125rem',
                  letterSpacing: '-0.01em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 24,
                    bgcolor: '#E65100',
                    borderRadius: 1,
                  }}
                />
                Development Areas
              </Typography>
              {developmentAreas.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {developmentAreas.map((d) => (
                    <Box
                      key={d}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        py: 1.5,
                        px: 2,
                        bgcolor: '#FFF3E0',
                        borderRadius: 1.5,
                        border: '1px solid #FFE0B2',
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: '#FFF3E0',
                          boxShadow: '0 2px 4px rgba(230, 81, 0, 0.1)',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: '#E65100',
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, fontSize: '0.875rem' }}
                      >
                        {d}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontStyle: 'italic',
                    textAlign: 'center',
                    py: 3,
                  }}
                >
                  No development areas identified
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Evaluations */}
      <Card
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{
              mb: 3,
              fontWeight: 600,
              fontSize: '1.125rem',
              letterSpacing: '-0.01em',
            }}
          >
            Recent Evaluations
          </Typography>
          {memberFlights.length === 0 ? (
            <Box
              sx={{
                py: 4,
                textAlign: 'center',
                bgcolor: 'background.default',
                borderRadius: 1.5,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontStyle: 'italic',
                }}
              >
                No evaluations found for this crew member.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {memberFlights.map((flight) => {
                const scoreColor =
                  flight.overallScore >= 90
                    ? { bg: '#E8F5E9', text: '#2E7D32', border: '#C8E6C9' }
                    : flight.overallScore >= 75
                    ? { bg: '#E3F2FD', text: '#1565C0', border: '#BBDEFB' }
                    : flight.overallScore >= 60
                    ? { bg: '#FFF3E0', text: '#E65100', border: '#FFE0B2' }
                    : { bg: '#FFEBEE', text: '#C62828', border: '#FFCDD2' };
                return (
                  <Box
                    key={flight.id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 2,
                      px: 2.5,
                      bgcolor: 'background.paper',
                      borderRadius: 1.5,
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: 'action.hover',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                      },
                    }}
                  >
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.9375rem',
                          mb: 0.5,
                        }}
                      >
                        {flight.flightNumber} — {flight.route}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          fontSize: '0.8125rem',
                        }}
                      >
                        {flight.date}
                      </Typography>
                    </Box>
                    <Chip
                      label={`${flight.overallScore}%`}
                      size="small"
                      sx={{
                        bgcolor: scoreColor.bg,
                        color: scoreColor.text,
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        height: 32,
                        minWidth: 60,
                        borderRadius: '8px',
                        border: '1px solid',
                        borderColor: scoreColor.border,
                      }}
                    />
                  </Box>
                );
              })}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
