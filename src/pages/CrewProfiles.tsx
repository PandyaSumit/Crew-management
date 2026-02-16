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
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          fontWeight: 600,
          letterSpacing: '-0.02em',
        }}
      >
        Crew Profiles
      </Typography>

      <Grid container spacing={3}>
        {crewMembers.map((member) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={member.id}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: '0 4px 12px rgba(74, 29, 112, 0.12)',
                  transform: 'translateY(-2px)',
                },
              }}
              onClick={() => navigate(`/crew/${member.id}`)}
            >
              <CardContent sx={{ textAlign: 'center', py: 4, px: 3 }}>
                <Avatar
                  sx={{
                    width: 72,
                    height: 72,
                    mx: 'auto',
                    mb: 2,
                    bgcolor: '#4A1D70',
                    fontSize: '1.5rem',
                    boxShadow: '0 2px 8px rgba(74, 29, 112, 0.2)',
                  }}
                >
                  <PersonIcon sx={{ fontSize: 36 }} />
                </Avatar>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 0.5,
                    fontWeight: 600,
                    fontSize: '1.125rem',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {member.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    mb: 2,
                    fontSize: '0.875rem',
                  }}
                >
                  {member.id} &bull; {member.role}
                </Typography>
                <Chip
                  label={member.previousPerformance.replace('-', ' ')}
                  size="small"
                  sx={{
                    bgcolor: `${performanceBadgeColors[member.previousPerformance]}18`,
                    color: performanceBadgeColors[member.previousPerformance],
                    textTransform: 'capitalize',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    height: 28,
                    borderRadius: '6px',
                    px: 1.5,
                    border: '1px solid',
                    borderColor: `${performanceBadgeColors[member.previousPerformance]}30`,
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    mt: 2,
                    color: 'text.secondary',
                    fontSize: '0.75rem',
                  }}
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
