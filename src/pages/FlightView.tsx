import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import PersonIcon from '@mui/icons-material/Person';
import { currentFlight } from '../data/mockData';
import { performanceBadgeColors } from '../theme';

const statusColors: Record<string, { bg: string; text: string }> = {
  'Not Started': { bg: '#F5F5F7', text: '#5A5A7A' },
  'In Progress': { bg: '#FFF3E0', text: '#E65100' },
  Completed: { bg: '#E8F5E9', text: '#2E7D32' },
};

export default function FlightView() {
  const navigate = useNavigate();
  const flight = currentFlight;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box>
      {/* Flight Header Card */}
      <Card
        elevation={0}
        sx={{
          mb: 4,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2.5,
          overflow: 'hidden',
        }}
      >
        <CardContent
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            flexWrap: 'wrap',
            p: 3,
            '&:last-child': { pb: 3 },
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#4A1D7012',
              color: '#4A1D70',
              flexShrink: 0,
            }}
          >
            <FlightTakeoffIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: isMobile ? '100%' : 220 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mb: 0.5,
                letterSpacing: '-0.01em',
              }}
            >
              {flight.flightNumber} — {flight.route}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontSize: '0.9375rem',
              }}
            >
              Aircraft: {flight.aircraft} &bull; Date: {flight.date}
            </Typography>
          </Box>
          <Chip
            label={`${flight.crew.length} crew members`}
            sx={{
              bgcolor: '#4A1D7012',
              color: '#4A1D70',
              fontWeight: 600,
              fontSize: '0.875rem',
              height: 36,
              borderRadius: 2,
              px: 1,
            }}
          />
        </CardContent>
      </Card>

      {/* Section Header */}
      <Typography
        variant="h6"
        sx={{
          mb: 3,
          fontWeight: 600,
          letterSpacing: '-0.01em',
        }}
      >
        Assigned Crew
      </Typography>

      {/* Crew Members List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {flight.crew.map((member) => (
          <Card
            key={member.id}
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2.5,
              overflow: 'hidden',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                borderColor: 'primary.main',
                boxShadow: '0 4px 12px rgba(74, 29, 112, 0.08)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            <CardContent
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2.5,
                p: 3,
                flexWrap: isTablet ? 'wrap' : 'nowrap',
                '&:last-child': { pb: 3 },
              }}
            >
              {/* Avatar */}
              <Avatar
                sx={{
                  bgcolor: '#4A1D70',
                  width: 52,
                  height: 52,
                  boxShadow: '0 2px 8px rgba(74, 29, 112, 0.2)',
                  flexShrink: 0,
                }}
              >
                <PersonIcon sx={{ fontSize: 26 }} />
              </Avatar>

              {/* Member Info */}
              <Box
                sx={{
                  flex: 1,
                  minWidth: isMobile ? '100%' : 180,
                  order: isMobile ? 1 : 0,
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    mb: 0.25,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {member.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.875rem',
                  }}
                >
                  {member.id} &bull; {member.role}
                </Typography>
              </Box>

              {/* Badges Container */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 1.5,
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  order: isMobile ? 2 : 0,
                }}
              >
                {/* Performance Badge */}
                <Chip
                  label={member.previousPerformance.replace('-', ' ')}
                  size="small"
                  sx={{
                    bgcolor: `${performanceBadgeColors[member.previousPerformance]}15`,
                    color: performanceBadgeColors[member.previousPerformance],
                    textTransform: 'capitalize',
                    fontWeight: 600,
                    fontSize: '0.8125rem',
                    height: 32,
                    borderRadius: 1.5,
                    border: `1px solid ${performanceBadgeColors[member.previousPerformance]}30`,
                    px: 1.5,
                  }}
                />

                {/* Status Badge */}
                <Chip
                  label={member.evaluationStatus}
                  size="small"
                  sx={{
                    bgcolor: statusColors[member.evaluationStatus].bg,
                    color: statusColors[member.evaluationStatus].text,
                    fontWeight: 600,
                    fontSize: '0.8125rem',
                    height: 32,
                    borderRadius: 1.5,
                    px: 1.5,
                  }}
                />
              </Box>

              {/* Action Button */}
              <Button
                variant={member.evaluationStatus === 'Completed' ? 'outlined' : 'contained'}
                size="medium"
                onClick={() => {
                  const evaluationType = member.role === 'Purser' ? 'purser' : 'cabin-crew';
                  navigate(`/evaluate/${evaluationType}/${flight.id}/${member.id}`);
                }}
                sx={{
                  minWidth: isMobile ? '100%' : 150,
                  height: 42,
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  borderRadius: 2,
                  textTransform: 'none',
                  boxShadow: member.evaluationStatus === 'Completed' ? 'none' : '0 2px 8px rgba(74, 29, 112, 0.2)',
                  order: isMobile ? 3 : 0,
                  ...(member.evaluationStatus === 'Completed' && {
                    borderWidth: 1.5,
                    '&:hover': {
                      borderWidth: 1.5,
                      bgcolor: 'rgba(74, 29, 112, 0.04)',
                    },
                  }),
                  ...(member.evaluationStatus !== 'Completed' && {
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(74, 29, 112, 0.3)',
                    },
                  }),
                }}
              >
                {member.evaluationStatus === 'Not Started'
                  ? 'Start Evaluation'
                  : member.evaluationStatus === 'In Progress'
                  ? 'Continue'
                  : 'View Report'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
