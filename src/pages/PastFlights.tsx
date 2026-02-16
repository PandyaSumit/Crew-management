import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { pastFlights } from '../data/mockData';

export default function PastFlights() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [performanceFilter, setPerformanceFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  const filtered = useMemo(() => {
    return pastFlights.filter((f) => {
      const matchSearch =
        search === '' ||
        f.crewMemberName.toLowerCase().includes(search.toLowerCase()) ||
        f.flightNumber.toLowerCase().includes(search.toLowerCase()) ||
        f.route.toLowerCase().includes(search.toLowerCase());

      const matchPerformance =
        performanceFilter === 'all' ||
        (performanceFilter === 'excellent' && f.overallScore >= 90) ||
        (performanceFilter === 'good' && f.overallScore >= 75 && f.overallScore < 90) ||
        (performanceFilter === 'average' && f.overallScore >= 60 && f.overallScore < 75) ||
        (performanceFilter === 'below' && f.overallScore < 60);

      const matchRole = roleFilter === 'all' || f.role === roleFilter;

      return matchSearch && matchPerformance && matchRole;
    });
  }, [search, performanceFilter, roleFilter]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return { bg: '#E8F5E9', text: '#2E7D32' };
    if (score >= 75) return { bg: '#E3F2FD', text: '#1565C0' };
    if (score >= 60) return { bg: '#FFF3E0', text: '#E65100' };
    return { bg: '#FFEBEE', text: '#C62828' };
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Past Flights
      </Typography>

      {/* Filters */}
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', py: 2 }}>
          <TextField
            size="small"
            placeholder="Search by name, flight, or route..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{
              input: {
                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />,
              },
            }}
            sx={{ minWidth: 260, flex: 1 }}
          />
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Performance</InputLabel>
            <Select
              value={performanceFilter}
              label="Performance"
              onChange={(e) => setPerformanceFilter(e.target.value)}
            >
              <MenuItem value="all">All Levels</MenuItem>
              <MenuItem value="excellent">Excellent (90+)</MenuItem>
              <MenuItem value="good">Good (75-89)</MenuItem>
              <MenuItem value="average">Average (60-74)</MenuItem>
              <MenuItem value="below">Below 60</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={roleFilter}
              label="Role"
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <MenuItem value="all">All Roles</MenuItem>
              <MenuItem value="Cabin Crew">Cabin Crew</MenuItem>
              <MenuItem value="Purser">Purser</MenuItem>
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Flight</TableCell>
                <TableCell>Route</TableCell>
                <TableCell>Crew Member</TableCell>
                <TableCell>Role</TableCell>
                <TableCell align="center">Score</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      No matching flights found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((flight) => {
                  const scoreColor = getScoreColor(flight.overallScore);
                  return (
                    <TableRow key={flight.id} hover>
                      <TableCell>
                        <Typography variant="body2">{flight.date}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {flight.flightNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{flight.route}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            cursor: 'pointer',
                            color: 'primary.main',
                            '&:hover': { textDecoration: 'underline' },
                          }}
                          onClick={() => navigate(`/crew/${flight.crewMemberId}`)}
                        >
                          {flight.crewMemberName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={flight.role}
                          size="small"
                          sx={{
                            bgcolor: flight.role === 'Purser' ? '#4A1D7014' : '#1976D214',
                            color: flight.role === 'Purser' ? '#4A1D70' : '#1976D2',
                            fontWeight: 500,
                            fontSize: '0.75rem',
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={`${flight.overallScore}%`}
                          size="small"
                          sx={{
                            bgcolor: scoreColor.bg,
                            color: scoreColor.text,
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          size="small"
                          startIcon={<VisibilityIcon />}
                          sx={{ fontSize: '0.75rem' }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
