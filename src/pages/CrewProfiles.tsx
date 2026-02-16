import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { crewMembers } from '../data/mockData';
import { performanceBadgeColors } from '../theme';

export default function CrewProfiles() {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Crew Profiles
      </Typography>

      <Grid container spacing={2}>
        {crewMembers.map((member) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={member.id}>
            <Card
              sx={{
                cursor: 'pointer',
                '&:hover': { borderColor: 'primary.main' },
              }}
              onClick={() => navigate(`/crew/${member.id}`)}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    mx: 'auto',
                    mb: 1.5,
                    bgcolor: '#4A1D70',
                    fontSize: '1.5rem',
                  }}
                >
                  <PersonIcon sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography variant="h6" sx={{ mb: 0.5 }}>
                  {member.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                  {member.id} &bull; {member.role}
                </Typography>
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
                <Typography
                  variant="caption"
                  sx={{ display: 'block', mt: 1, color: 'text.secondary' }}
                >
                  Joined: {member.joinDate}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
