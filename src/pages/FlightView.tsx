import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Typography,
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

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#4A1D7014',
              color: '#4A1D70',
            }}
          >
            <FlightTakeoffIcon />
          </Box>
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography variant="h5">
              {flight.flightNumber} — {flight.route}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Aircraft: {flight.aircraft} &bull; Date: {flight.date}
            </Typography>
          </Box>
          <Chip
            label={`${flight.crew.length} crew members`}
            sx={{ bgcolor: '#4A1D7014', color: '#4A1D70', fontWeight: 500 }}
          />
        </CardContent>
      </Card>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Assigned Crew
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {flight.crew.map((member) => (
          <Card key={member.id}>
            <CardContent
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                py: 2,
                flexWrap: 'wrap',
              }}
            >
              <Avatar sx={{ bgcolor: '#4A1D70', width: 44, height: 44 }}>
                <PersonIcon />
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 160 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  {member.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {member.id} &bull; {member.role}
                </Typography>
              </Box>
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
              <Chip
                label={member.evaluationStatus}
                size="small"
                sx={{
                  bgcolor: statusColors[member.evaluationStatus].bg,
                  color: statusColors[member.evaluationStatus].text,
                  fontWeight: 500,
                }}
              />
              <Button
                variant={member.evaluationStatus === 'Completed' ? 'outlined' : 'contained'}
                size="small"
                onClick={() => {
                  const evaluationType = member.role === 'Purser' ? 'purser' : 'cabin-crew';
                  navigate(`/evaluate/${evaluationType}/${flight.id}/${member.id}`);
                }}
                sx={{ minWidth: 130 }}
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
