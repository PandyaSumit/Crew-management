import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import WarningIcon from '@mui/icons-material/Warning';
import { purserSections, crewMembers, flights } from '../data/mockData';
import { purserRatingColors } from '../theme';
import type { PurserRating } from '../types';

const RATING_LABELS: { value: PurserRating; label: string; full: string }[] = [
  { value: 'N', label: 'N', full: 'Needs Improvement' },
  { value: 'R', label: 'R', full: 'Meets Requirements' },
  { value: 'A', label: 'A', full: 'Above Standard' },
];

interface ItemState {
  rating: PurserRating | null;
  remarks: string;
}

type FormState = Record<string, ItemState>;

export default function PurserAssessment() {
  const { flightId, crewId } = useParams();
  const navigate = useNavigate();

  const flight = flights.find((f) => f.id === flightId);
  const crew = crewMembers.find((c) => c.id === crewId);

  const [form, setForm] = useState<FormState>(() => {
    const initial: FormState = {};
    purserSections.forEach((sec) => {
      sec.items.forEach((item) => {
        initial[item.id] = { rating: null, remarks: '' };
      });
    });
    return initial;
  });
  const [overallRemarks, setOverallRemarks] = useState('');
  const [signature, setSignature] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const totalItems = useMemo(
    () => purserSections.reduce((acc, sec) => acc + sec.items.length, 0),
    []
  );

  const completedItems = useMemo(
    () => Object.values(form).filter((v) => v.rating !== null).length,
    [form]
  );

  const safetyCriticalItems = useMemo(() => {
    return purserSections.flatMap((sec) => sec.items.filter((item) => item.isSafetyCritical));
  }, []);

  const unratedSafetyCritical = useMemo(() => {
    return safetyCriticalItems.filter((item) => form[item.id].rating === null);
  }, [safetyCriticalItems, form]);

  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  const overallScore = useMemo(() => {
    const rated = Object.values(form).filter((v) => v.rating !== null);
    if (rated.length === 0) return null;
    const scoreMap: Record<PurserRating, number> = { N: 33, R: 66, A: 100 };
    const total = rated.reduce((acc, v) => acc + (v.rating ? scoreMap[v.rating] : 0), 0);
    return Math.round(total / rated.length);
  }, [form]);

  const handleRatingChange = (itemId: string, rating: PurserRating | null) => {
    setForm((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], rating },
    }));
  };

  const handleRemarksChange = (itemId: string, remarks: string) => {
    setForm((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], remarks },
    }));
  };

  const canSubmit =
    completedItems === totalItems && unratedSafetyCritical.length === 0 && signature.trim() !== '';

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitted(true);
  };

  if (!flight || !crew) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Flight or crew member not found.</Typography>
        <Button onClick={() => navigate('/flight')} sx={{ mt: 2 }}>
          Back to Flight
        </Button>
      </Box>
    );
  }

  if (submitted) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', mt: { xs: 2, sm: 4 }, px: { xs: 2, sm: 3 } }}>
        <Card
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            overflow: 'hidden'
          }}
        >
          <CardContent sx={{ textAlign: 'center', py: { xs: 4, sm: 6 }, px: { xs: 3, sm: 5 } }}>
            <CheckCircleIcon
              sx={{
                fontSize: { xs: 56, sm: 72 },
                color: 'success.main',
                mb: 3,
                filter: 'drop-shadow(0px 2px 8px rgba(76, 175, 80, 0.2))'
              }}
            />
            <Typography
              variant="h4"
              sx={{
                mb: 2,
                fontWeight: 700,
                fontSize: { xs: '1.5rem', sm: '2rem' }
              }}
            >
              Purser Evaluation Submitted
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 1,
                color: 'text.secondary',
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }}
            >
              {crew.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mb: 4,
                color: 'text.secondary',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                flexWrap: 'wrap'
              }}
            >
              <span>{flight.flightNumber}</span>
              <span>•</span>
              <span>{flight.route}</span>
            </Typography>

            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: { xs: 120, sm: 140 },
                height: { xs: 120, sm: 140 },
                borderRadius: '50%',
                bgcolor: 'primary.main',
                color: 'white',
                mb: 5,
                boxShadow: '0px 8px 24px rgba(25, 118, 210, 0.25)',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: -8,
                  borderRadius: '50%',
                  border: '2px solid',
                  borderColor: 'primary.light',
                  opacity: 0.2
                }
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2.5rem', sm: '3rem' }
                }}
              >
                {overallScore}%
              </Typography>
            </Box>

            <Typography
              variant="h6"
              sx={{
                mb: 3,
                textAlign: 'left',
                fontWeight: 600,
                fontSize: { xs: '1rem', sm: '1.25rem' }
              }}
            >
              Section Breakdown
            </Typography>
            <Box sx={{ mb: 4 }}>
              {purserSections.map((sec, idx) => {
                const secItems = sec.items.map((item) => form[item.id]);
                const rated = secItems.filter((v) => v.rating !== null);
                const scoreMap: Record<PurserRating, number> = { N: 33, R: 66, A: 100 };
                const secScore =
                  rated.length > 0
                    ? Math.round(
                        rated.reduce((acc, v) => acc + (v.rating ? scoreMap[v.rating] : 0), 0) /
                          rated.length
                      )
                    : 0;
                return (
                  <Box
                    key={sec.id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 2,
                      px: 2.5,
                      borderRadius: 2,
                      bgcolor: idx % 2 === 0 ? 'transparent' : 'rgba(0, 0, 0, 0.02)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: 'rgba(25, 118, 210, 0.04)',
                        transform: 'translateX(4px)'
                      }
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 500,
                        fontSize: { xs: '0.9rem', sm: '1rem' }
                      }}
                    >
                      {sec.name}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: secScore >= 80 ? 'success.main' : secScore >= 60 ? 'primary.main' : 'warning.main',
                        fontSize: { xs: '1rem', sm: '1.25rem' }
                      }}
                    >
                      {secScore}%
                    </Typography>
                  </Box>
                );
              })}
            </Box>

            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/flight')}
                sx={{
                  minWidth: { xs: '100%', sm: 140 },
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  py: 1.5
                }}
              >
                Back to Flight
              </Button>
              <Button
                variant="contained"
                size="large"
                onClick={() => setSubmitted(false)}
                sx={{
                  minWidth: { xs: '100%', sm: 140 },
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  py: 1.5,
                  boxShadow: '0px 4px 12px rgba(25, 118, 210, 0.25)',
                  '&:hover': {
                    boxShadow: '0px 6px 16px rgba(25, 118, 210, 0.35)'
                  }
                }}
              >
                Re-Evaluate
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 920, mx: 'auto', px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 0 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/flight')}
          size="small"
          sx={{
            color: 'text.secondary',
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.04)'
            }
          }}
        >
          Back
        </Button>
      </Box>

      <Card
        elevation={0}
        sx={{
          mb: 3,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          overflow: 'hidden'
        }}
      >
        <CardContent sx={{ py: { xs: 3, sm: 3.5 }, px: { xs: 2.5, sm: 3.5 } }}>
          <Typography
            variant="h4"
            sx={{
              mb: 1.5,
              fontWeight: 700,
              fontSize: { xs: '1.5rem', sm: '2rem' }
            }}
          >
            Purser Assessment
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 1,
              fontWeight: 500,
              fontSize: { xs: '1.1rem', sm: '1.25rem' }
            }}
          >
            {crew.name}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flexWrap: 'wrap',
              fontSize: { xs: '0.85rem', sm: '0.875rem' }
            }}
          >
            <span>{flight.flightNumber}</span>
            <span>•</span>
            <span>{flight.route}</span>
            <span>•</span>
            <span>{flight.date}</span>
            <span>•</span>
            <span>ID: {crew.id}</span>
          </Typography>
        </CardContent>
      </Card>

      {/* Progress */}
      <Card
        elevation={0}
        sx={{
          mb: 3,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          overflow: 'hidden'
        }}
      >
        <CardContent sx={{ py: { xs: 2.5, sm: 3 }, px: { xs: 2.5, sm: 3.5 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, alignItems: 'baseline' }}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                fontSize: { xs: '0.95rem', sm: '1rem' }
              }}
            >
              Progress
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: progress === 100 ? 'success.main' : 'primary.main',
                fontSize: { xs: '1.1rem', sm: '1.25rem' }
              }}
            >
              {Math.round(progress)}%
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              mb: 2,
              fontSize: { xs: '0.85rem', sm: '0.875rem' }
            }}
          >
            {completedItems} of {totalItems} items rated
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 10,
              borderRadius: 5,
              bgcolor: 'rgba(0, 0, 0, 0.06)',
              '& .MuiLinearProgress-bar': {
                bgcolor: progress === 100 ? 'success.main' : 'primary.main',
                borderRadius: 5,
                transition: 'all 0.3s ease'
              }
            }}
          />
          {unratedSafetyCritical.length > 0 && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mt: 2.5,
                p: 1.5,
                bgcolor: 'error.light',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'error.main'
              }}
            >
              <WarningIcon sx={{ fontSize: 20, color: 'error.main' }} />
              <Typography
                variant="body2"
                sx={{
                  color: 'error.dark',
                  fontWeight: 500,
                  fontSize: { xs: '0.85rem', sm: '0.875rem' }
                }}
              >
                {unratedSafetyCritical.length} safety-critical item{unratedSafetyCritical.length > 1 ? 's' : ''} not yet assessed
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Rating Legend */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        {RATING_LABELS.map((r) => (
          <Chip
            key={r.value}
            label={`${r.value} — ${r.full}`}
            size="small"
            sx={{
              bgcolor: `${purserRatingColors[r.value]}14`,
              color: purserRatingColors[r.value],
              fontWeight: 600,
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
              height: { xs: 28, sm: 30 },
              borderRadius: 1.5,
              px: 0.5,
              border: '1px solid',
              borderColor: `${purserRatingColors[r.value]}30`
            }}
          />
        ))}
        <Chip
          icon={
            <StarIcon
              sx={{
                fontSize: { xs: 15, sm: 16 },
                color: '#F57C00',
                ml: '4px !important'
              }}
            />
          }
          label="Safety-Critical"
          size="small"
          sx={{
            bgcolor: '#FFF3E0',
            color: '#E65100',
            fontWeight: 600,
            fontSize: { xs: '0.7rem', sm: '0.75rem' },
            height: { xs: 28, sm: 30 },
            borderRadius: 1.5,
            px: 0.5,
            border: '1px solid',
            borderColor: '#FFB74D'
          }}
        />
      </Box>

      {/* Sections */}
      {purserSections.map((section) => {
        const secCompleted = section.items.filter((item) => form[item.id].rating !== null).length;
        const isComplete = secCompleted === section.items.length;
        return (
          <Accordion
            key={section.id}
            defaultExpanded
            elevation={0}
            sx={{
              mb: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '12px !important',
              overflow: 'hidden',
              '&:before': { display: 'none' },
              '&.Mui-expanded': {
                margin: '0 0 16px 0'
              }
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                bgcolor: 'rgba(0, 0, 0, 0.01)',
                py: { xs: 1.5, sm: 2 },
                px: { xs: 2, sm: 3 },
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.02)'
                },
                '& .MuiAccordionSummary-content': {
                  my: 0.5
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                <Typography
                  variant="h6"
                  sx={{
                    flex: 1,
                    fontWeight: 600,
                    fontSize: { xs: '1rem', sm: '1.125rem' }
                  }}
                >
                  {section.name}
                </Typography>
                <Chip
                  label={`${secCompleted}/${section.items.length}`}
                  size="small"
                  sx={{
                    bgcolor: isComplete ? 'success.light' : 'rgba(0, 0, 0, 0.06)',
                    color: isComplete ? 'success.dark' : 'text.secondary',
                    fontWeight: 600,
                    minWidth: 50,
                    height: { xs: 26, sm: 28 },
                    fontSize: { xs: '0.75rem', sm: '0.8rem' },
                    borderRadius: 1.5,
                    border: '1px solid',
                    borderColor: isComplete ? 'success.main' : 'transparent'
                  }}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                px: { xs: 2, sm: 3 },
                py: { xs: 2, sm: 3 },
                bgcolor: 'background.paper'
              }}
            >
              {section.items.map((item) => {
                const state = form[item.id];
                return (
                  <Box
                    key={item.id}
                    sx={{
                      mb: 3,
                      pb: 3,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      '&:last-child': { borderBottom: 'none', mb: 0, pb: 0 }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 500,
                          flex: 1,
                          fontSize: { xs: '0.95rem', sm: '1rem' }
                        }}
                      >
                        {item.name}
                      </Typography>
                      {item.isSafetyCritical && (
                        <Tooltip
                          title="Safety-Critical Item"
                          arrow
                          placement="top"
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              bgcolor: '#FFF3E0',
                              border: '2px solid #FFB74D',
                              cursor: 'help',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                bgcolor: '#FFE0B2',
                                transform: 'scale(1.1)',
                                boxShadow: '0px 4px 12px rgba(255, 152, 0, 0.3)'
                              }
                            }}
                          >
                            <StarIcon sx={{ fontSize: 18, color: '#F57C00' }} />
                          </Box>
                        </Tooltip>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
                      <ToggleButtonGroup
                        exclusive
                        value={state.rating}
                        onChange={(_, val) => handleRatingChange(item.id, val)}
                        size="small"
                        sx={{
                          gap: 0.5,
                          '& .MuiToggleButtonGroup-grouped': {
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: '8px !important',
                            '&:not(:first-of-type)': {
                              marginLeft: 0
                            }
                          }
                        }}
                      >
                        {RATING_LABELS.map((r) => (
                          <ToggleButton
                            key={r.value}
                            value={r.value}
                            sx={{
                              px: { xs: 2, sm: 3 },
                              py: 1,
                              fontWeight: 700,
                              fontSize: { xs: '0.8rem', sm: '0.85rem' },
                              minWidth: { xs: 50, sm: 60 },
                              textTransform: 'uppercase',
                              transition: 'all 0.2s ease',
                              '&.Mui-selected': {
                                bgcolor: purserRatingColors[r.value],
                                color: '#fff',
                                borderColor: purserRatingColors[r.value],
                                boxShadow: `0px 4px 12px ${purserRatingColors[r.value]}40`,
                                transform: 'translateY(-2px)',
                                '&:hover': {
                                  bgcolor: purserRatingColors[r.value],
                                  boxShadow: `0px 6px 16px ${purserRatingColors[r.value]}50`
                                }
                              },
                              '&:not(.Mui-selected):hover': {
                                bgcolor: `${purserRatingColors[r.value]}14`,
                                borderColor: purserRatingColors[r.value]
                              }
                            }}
                          >
                            {r.label}
                          </ToggleButton>
                        ))}
                      </ToggleButtonGroup>
                    </Box>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Remarks (optional)"
                      value={state.remarks}
                      onChange={(e) => handleRemarksChange(item.id, e.target.value)}
                      slotProps={{ htmlInput: { maxLength: 500 } }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          fontSize: { xs: '0.9rem', sm: '0.95rem' },
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            bgcolor: 'rgba(0, 0, 0, 0.01)'
                          },
                          '&.Mui-focused': {
                            boxShadow: '0px 0px 0px 3px rgba(25, 118, 210, 0.1)'
                          }
                        }
                      }}
                    />
                  </Box>
                );
              })}
            </AccordionDetails>
          </Accordion>
        );
      })}

      {/* Overall Remarks & Signature */}
      <Card
        elevation={0}
        sx={{
          mt: 3,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          overflow: 'hidden'
        }}
      >
        <CardContent sx={{ py: { xs: 3, sm: 3.5 }, px: { xs: 2.5, sm: 3.5 } }}>
          <Typography
            variant="h6"
            sx={{
              mb: 3,
              fontWeight: 600,
              fontSize: { xs: '1.1rem', sm: '1.25rem' }
            }}
          >
            Final Review
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={4}
            label="Overall Remarks"
            placeholder="Enter any final observations or comments..."
            value={overallRemarks}
            onChange={(e) => setOverallRemarks(e.target.value)}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                fontSize: { xs: '0.9rem', sm: '0.95rem' },
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.01)'
                },
                '&.Mui-focused': {
                  boxShadow: '0px 0px 0px 3px rgba(25, 118, 210, 0.1)'
                }
              },
              '& .MuiInputLabel-root': {
                fontWeight: 500
              }
            }}
          />
          <TextField
            fullWidth
            label="Evaluator Signature"
            placeholder="Enter your full name"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                fontSize: { xs: '0.9rem', sm: '0.95rem' },
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.01)'
                },
                '&.Mui-focused': {
                  boxShadow: '0px 0px 0px 3px rgba(25, 118, 210, 0.1)'
                }
              },
              '& .MuiInputLabel-root': {
                fontWeight: 500
              }
            }}
          />
        </CardContent>
      </Card>

      {/* Validation */}
      {(completedItems < totalItems || unratedSafetyCritical.length > 0 || !signature.trim()) && (
        <Alert
          severity="info"
          sx={{
            mt: 3,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'info.light',
            '& .MuiAlert-icon': {
              fontSize: { xs: 20, sm: 22 }
            }
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {completedItems < totalItems && (
              <Typography
                variant="body2"
                sx={{ fontSize: { xs: '0.85rem', sm: '0.875rem' } }}
              >
                • {totalItems - completedItems} item{totalItems - completedItems > 1 ? 's' : ''} not yet rated
              </Typography>
            )}
            {unratedSafetyCritical.length > 0 && (
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: '0.85rem', sm: '0.875rem' },
                  fontWeight: 600
                }}
              >
                • {unratedSafetyCritical.length} safety-critical item{unratedSafetyCritical.length > 1 ? 's' : ''} must be assessed
              </Typography>
            )}
            {!signature.trim() && (
              <Typography
                variant="body2"
                sx={{ fontSize: { xs: '0.85rem', sm: '0.875rem' } }}
              >
                • Evaluator signature required
              </Typography>
            )}
          </Box>
        </Alert>
      )}

      {/* Actions */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mt: 3,
          mb: { xs: 4, sm: 6 },
          justifyContent: 'flex-end',
          flexDirection: { xs: 'column', sm: 'row' }
        }}
      >
        <Button
          variant="outlined"
          size="large"
          sx={{
            minWidth: { xs: '100%', sm: 140 },
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            py: 1.5,
            borderWidth: 2,
            fontSize: { xs: '0.95rem', sm: '1rem' },
            '&:hover': {
              borderWidth: 2,
              bgcolor: 'rgba(25, 118, 210, 0.04)'
            }
          }}
        >
          Save Draft
        </Button>
        <Button
          variant="contained"
          size="large"
          disabled={!canSubmit}
          onClick={handleSubmit}
          sx={{
            minWidth: { xs: '100%', sm: 180 },
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 700,
            py: 1.5,
            fontSize: { xs: '0.95rem', sm: '1rem' },
            boxShadow: canSubmit ? '0px 4px 12px rgba(25, 118, 210, 0.25)' : 'none',
            '&:hover': {
              boxShadow: canSubmit ? '0px 6px 16px rgba(25, 118, 210, 0.35)' : 'none'
            },
            '&.Mui-disabled': {
              bgcolor: 'rgba(0, 0, 0, 0.12)',
              color: 'rgba(0, 0, 0, 0.26)'
            }
          }}
        >
          Submit Evaluation
        </Button>
      </Box>
    </Box>
  );
}
