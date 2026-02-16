import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  useTheme,
  alpha,
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
    icon: <FlightIcon fontSize="medium" />,
    colorKey: 'primary',
  },
  {
    title: 'Average Performance',
    value: '84.2%',
    icon: <TrendingUpIcon fontSize="medium" />,
    colorKey: 'success',
  },
  {
    title: 'Pending Evaluations',
    value: '12',
    icon: <PendingActionsIcon fontSize="medium" />,
    colorKey: 'warning',
  },
  {
    title: 'Recent Activity',
    value: '8 today',
    icon: <UpdateIcon fontSize="medium" />,
    colorKey: 'info',
  },
];

export default function Dashboard() {
  const theme = useTheme();

  return (
    <Box sx={{ maxWidth: 1600, mx: 'auto' }}>
      {/* Page Header */}
      <Box sx={{ mb: { xs: 4, sm: 5, md: 6 } }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: 'text.primary',
            mb: 1,
          }}
        >
          Performance Overview
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            fontSize: '0.9375rem',
          }}
        >
          Monitor crew performance metrics and recent evaluation activity
        </Typography>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }} sx={{ mb: { xs: 4, sm: 5, md: 6 } }}>
        {statCards.map((card) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={card.title}>
            <Card
              sx={{
                height: '100%',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[3],
                },
              }}
            >
              <CardContent
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: { xs: 2, sm: 2.5 },
                  p: { xs: 2.5, sm: 3 },
                  '&:last-child': {
                    pb: { xs: 2.5, sm: 3 },
                  },
                }}
              >
                <Box
                  sx={{
                    width: { xs: 52, sm: 56 },
                    height: { xs: 52, sm: 56 },
                    borderRadius: 2.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(theme.palette[card.colorKey as keyof typeof theme.palette].main, 0.08),
                    color: `${card.colorKey}.main`,
                    flexShrink: 0,
                  }}
                >
                  {card.icon}
                </Box>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                      mb: 0.75,
                      letterSpacing: '0.01em',
                    }}
                  >
                    {card.title}
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      letterSpacing: '-0.02em',
                      color: 'text.primary',
                    }}
                  >
                    {card.value}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts and Recent Activity */}
      <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
        {/* Performance Chart */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <CardContent
              sx={{
                p: { xs: 2.5, sm: 3, md: 4 },
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ mb: { xs: 3, sm: 4 } }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                    mb: 0.5,
                    letterSpacing: '-0.01em',
                  }}
                >
                  Assessment Categories
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.875rem',
                  }}
                >
                  Year-over-year performance comparison
                </Typography>
              </Box>
              <Box sx={{ flex: 1, minHeight: { xs: 320, sm: 380, md: 420 } }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    data={performanceData}
                    cx="50%"
                    cy="50%"
                    outerRadius="70%"
                    margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
                  >
                    <PolarGrid
                      stroke={theme.palette.divider}
                      strokeWidth={1}
                    />
                    <PolarAngleAxis
                      dataKey="category"
                      tick={{
                        fontSize: 12,
                        fill: theme.palette.text.secondary,
                        fontWeight: 500,
                      }}
                      tickLine={false}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      tick={{
                        fontSize: 11,
                        fill: theme.palette.text.secondary,
                      }}
                      tickCount={6}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: theme.shape.borderRadius,
                        boxShadow: theme.shadows[3],
                        padding: '12px',
                      }}
                      labelStyle={{
                        color: theme.palette.text.primary,
                        fontWeight: 600,
                        marginBottom: 8,
                      }}
                      itemStyle={{
                        color: theme.palette.text.secondary,
                        padding: '4px 0',
                      }}
                    />
                    <Radar
                      name="2025"
                      dataKey="year2025"
                      stroke={theme.palette.secondary.main}
                      fill={theme.palette.secondary.main}
                      fillOpacity={0.12}
                      strokeWidth={2.5}
                    />
                    <Radar
                      name="2026"
                      dataKey="year2026"
                      stroke={theme.palette.primary.main}
                      fill={theme.palette.primary.main}
                      fillOpacity={0.12}
                      strokeWidth={2.5}
                    />
                    <Legend
                      wrapperStyle={{
                        paddingTop: '20px',
                      }}
                      iconType="circle"
                      formatter={(value) => (
                        <span style={{
                          color: theme.palette.text.primary,
                          fontWeight: 500,
                          fontSize: '0.875rem',
                        }}>
                          {value}
                        </span>
                      )}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Evaluations */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <CardContent
              sx={{
                p: { xs: 2.5, sm: 3, md: 4 },
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ mb: { xs: 3, sm: 4 } }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                    mb: 0.5,
                    letterSpacing: '-0.01em',
                  }}
                >
                  Recent Evaluations
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.875rem',
                  }}
                >
                  Latest crew assessment results
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                {pastFlights.slice(0, 6).map((flight, index) => (
                  <Box
                    key={flight.id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: 2,
                      py: { xs: 2, sm: 2.5 },
                      borderBottom: index !== 5 ? `1px solid ${theme.palette.divider}` : 'none',
                      transition: 'background-color 0.2s ease',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.02),
                      },
                    }}
                  >
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: 'text.primary',
                          mb: 0.5,
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {flight.crewMemberName}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          fontSize: '0.8125rem',
                          display: 'block',
                          lineHeight: 1.5,
                        }}
                      >
                        {flight.flightNumber} • {flight.route}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          fontSize: '0.75rem',
                          display: 'block',
                          mt: 0.25,
                        }}
                      >
                        {flight.date}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        px: 2,
                        py: 0.75,
                        borderRadius: 1.5,
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        letterSpacing: '-0.01em',
                        flexShrink: 0,
                        bgcolor:
                          flight.overallScore >= 90
                            ? theme.palette.success.light
                            : flight.overallScore >= 75
                            ? theme.palette.info.light
                            : flight.overallScore >= 60
                            ? theme.palette.warning.light
                            : theme.palette.error.light,
                        color:
                          flight.overallScore >= 90
                            ? theme.palette.success.main
                            : flight.overallScore >= 75
                            ? theme.palette.info.main
                            : flight.overallScore >= 60
                            ? theme.palette.warning.main
                            : theme.palette.error.main,
                      }}
                    >
                      {flight.overallScore}%
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
