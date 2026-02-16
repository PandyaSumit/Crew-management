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
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          fontWeight: 600,
          color: 'text.primary',
          letterSpacing: '-0.02em'
        }}
      >
        Past Flights
      </Typography>

      {/* Filters */}
      <Card
        sx={{
          mb: 3,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <CardContent sx={{
          display: 'flex',
          gap: 2.5,
          flexWrap: 'wrap',
          alignItems: 'center',
          px: 3,
          py: 2.5,
          '&:last-child': { pb: 2.5 }
        }}>
          <TextField
            size="small"
            placeholder="Search by name, flight, or route..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{
              input: {
                startAdornment: <SearchIcon sx={{ color: 'text.disabled', mr: 1, fontSize: 20 }} />,
              },
            }}
            sx={{
              minWidth: 280,
              flex: 1,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'background.paper',
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                '&.Mui-focused': {
                  backgroundColor: 'background.paper',
                  boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.08)',
                }
              }
            }}
          />
          <FormControl
            size="small"
            sx={{
              minWidth: 170,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'background.paper',
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: 'action.hover',
                }
              }
            }}
          >
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
          <FormControl
            size="small"
            sx={{
              minWidth: 150,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'background.paper',
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: 'action.hover',
                }
              }
            }}
          >
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
      <Card
        sx={{
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden'
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: 'grey.50',
                  '& .MuiTableCell-root': {
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }
                }}
              >
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.8125rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em',
                    color: 'text.secondary',
                    py: 2
                  }}
                >
                  Date
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.8125rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em',
                    color: 'text.secondary',
                    py: 2
                  }}
                >
                  Flight
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.8125rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em',
                    color: 'text.secondary',
                    py: 2
                  }}
                >
                  Route
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.8125rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em',
                    color: 'text.secondary',
                    py: 2
                  }}
                >
                  Crew Member
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.8125rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em',
                    color: 'text.secondary',
                    py: 2
                  }}
                >
                  Role
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.8125rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em',
                    color: 'text.secondary',
                    py: 2
                  }}
                >
                  Score
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.8125rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em',
                    color: 'text.secondary',
                    py: 2
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8, border: 'none' }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        fontSize: '0.9375rem'
                      }}
                    >
                      No matching flights found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((flight) => {
                  const scoreColor = getScoreColor(flight.overallScore);
                  return (
                    <TableRow
                      key={flight.id}
                      hover
                      sx={{
                        '&:hover': {
                          backgroundColor: 'action.hover'
                        },
                        '&:last-child .MuiTableCell-root': {
                          borderBottom: 'none'
                        }
                      }}
                    >
                      <TableCell sx={{ py: 2.5 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: '0.875rem',
                            color: 'text.secondary'
                          }}
                        >
                          {flight.date}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 2.5 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            color: 'text.primary'
                          }}
                        >
                          {flight.flightNumber}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 2.5 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: '0.875rem',
                            color: 'text.primary'
                          }}
                        >
                          {flight.route}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 2.5 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            color: 'primary.main',
                            transition: 'all 0.2s',
                            display: 'inline-block',
                            '&:hover': {
                              textDecoration: 'underline',
                              opacity: 0.8
                            },
                          }}
                          onClick={() => navigate(`/crew/${flight.crewMemberId}`)}
                        >
                          {flight.crewMemberName}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 2.5 }}>
                        <Chip
                          label={flight.role}
                          size="small"
                          sx={{
                            bgcolor: flight.role === 'Purser' ? '#4A1D7012' : '#1976D212',
                            color: flight.role === 'Purser' ? '#4A1D70' : '#1976D2',
                            fontWeight: 500,
                            fontSize: '0.75rem',
                            height: 26,
                            borderRadius: '6px',
                            border: '1px solid',
                            borderColor: flight.role === 'Purser' ? '#4A1D7020' : '#1976D220',
                            '& .MuiChip-label': {
                              px: 1.5
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ py: 2.5 }}>
                        <Chip
                          label={`${flight.overallScore}%`}
                          size="small"
                          sx={{
                            bgcolor: scoreColor.bg,
                            color: scoreColor.text,
                            fontWeight: 600,
                            fontSize: '0.8125rem',
                            height: 26,
                            minWidth: 56,
                            borderRadius: '6px',
                            '& .MuiChip-label': {
                              px: 1.5
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ py: 2.5 }}>
                        <Button
                          size="small"
                          startIcon={<VisibilityIcon sx={{ fontSize: 16 }} />}
                          sx={{
                            fontSize: '0.8125rem',
                            fontWeight: 500,
                            textTransform: 'none',
                            px: 2,
                            py: 0.75,
                            borderRadius: '6px',
                            transition: 'all 0.2s',
                            '&:hover': {
                              backgroundColor: 'primary.main',
                              color: 'white',
                            }
                          }}
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
