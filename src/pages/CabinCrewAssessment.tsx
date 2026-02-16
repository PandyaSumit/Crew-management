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
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import { cabinCrewCategories, crewMembers, flights } from '../data/mockData';
import { ratingColors } from '../theme';
import type { RatingValue } from '../types';

const RATING_LABELS: { value: RatingValue; label: string }[] = [
  { value: 'U', label: 'U' },
  { value: 'N', label: 'N' },
  { value: 'M', label: 'M' },
  { value: 'E', label: 'E' },
  { value: 'O', label: 'O' },
];

const REMARKS_REQUIRED: RatingValue[] = ['U', 'N', 'E', 'O'];

interface CriterionState {
  rating: RatingValue | null;
  remarks: string;
}

type FormState = Record<string, CriterionState>;

export default function CabinCrewAssessment() {
  const { flightId, crewId } = useParams();
  const navigate = useNavigate();

  const flight = flights.find((f) => f.id === flightId);
  const crew = crewMembers.find((c) => c.id === crewId);

  const [form, setForm] = useState<FormState>(() => {
    const initial: FormState = {};
    cabinCrewCategories.forEach((cat) => {
      cat.criteria.forEach((c) => {
        initial[c.id] = { rating: null, remarks: '' };
      });
    });
    return initial;
  });
  const [overallRemarks, setOverallRemarks] = useState('');
  const [signature, setSignature] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const totalCriteria = useMemo(
    () => cabinCrewCategories.reduce((acc, cat) => acc + cat.criteria.length, 0),
    []
  );

  const completedCriteria = useMemo(
    () => Object.values(form).filter((v) => v.rating !== null).length,
    [form]
  );

  const missingRemarks = useMemo(() => {
    return Object.entries(form).filter(
      ([, v]) => v.rating && REMARKS_REQUIRED.includes(v.rating) && v.remarks.trim() === ''
    );
  }, [form]);

  const progress = totalCriteria > 0 ? (completedCriteria / totalCriteria) * 100 : 0;

  const overallScore = useMemo(() => {
    // Calculate category scores (each category's criteria weights sum to 100)
    const categoryScores = cabinCrewCategories.map((cat) => {
      const catCriteria = cat.criteria.filter((c) => form[c.id]?.rating !== null);
      if (catCriteria.length === 0) return null;

      const catTotal = catCriteria.reduce((acc, crit) => {
        const rating = form[crit.id].rating;
        return acc + (rating ? crit.weights[rating] : 0);
      }, 0);

      // If not all criteria rated, proportionally scale the score
      const allCriteriaMaxScore = cat.criteria.reduce(
        (acc, c) => acc + c.weights.O,
        0
      );
      const ratedCriteriaMaxScore = catCriteria.reduce(
        (acc, c) => acc + c.weights.O,
        0
      );

      return (catTotal / ratedCriteriaMaxScore) * allCriteriaMaxScore;
    });

    const validScores = categoryScores.filter((s): s is number => s !== null);
    if (validScores.length === 0) return null;

    // Average all category scores
    return Math.round(validScores.reduce((acc, s) => acc + s, 0) / validScores.length);
  }, [form]);

  const handleRatingChange = (criterionId: string, rating: RatingValue | null) => {
    setForm((prev) => ({
      ...prev,
      [criterionId]: { ...prev[criterionId], rating },
    }));
  };

  const handleRemarksChange = (criterionId: string, remarks: string) => {
    setForm((prev) => ({
      ...prev,
      [criterionId]: { ...prev[criterionId], remarks },
    }));
  };

  const canSubmit =
    completedCriteria === totalCriteria && missingRemarks.length === 0 && signature.trim() !== '';

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
      <Box sx={{ maxWidth: 700, mx: 'auto', mt: 6, px: 2 }}>
        <Card
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ textAlign: 'center', py: 6, px: { xs: 3, sm: 6 } }}>
            <CheckCircleIcon
              sx={{
                fontSize: 72,
                color: 'success.main',
                mb: 3,
                opacity: 0.9,
              }}
            />
            <Typography
              variant="h4"
              sx={{
                mb: 2,
                fontWeight: 600,
                letterSpacing: '-0.02em',
              }}
            >
              Evaluation Submitted
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 1,
                color: 'text.secondary',
                fontWeight: 500,
              }}
            >
              {crew.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mb: 4,
                color: 'text.secondary',
              }}
            >
              {flight.flightNumber} {flight.route}
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                mb: 6,
                letterSpacing: '-0.03em',
              }}
            >
              {overallScore}%
            </Typography>

            <Typography
              variant="h6"
              sx={{
                mb: 3,
                textAlign: 'left',
                fontWeight: 600,
                letterSpacing: '-0.01em',
              }}
            >
              Category Breakdown
            </Typography>
            <Box sx={{ mb: 4 }}>
              {cabinCrewCategories.map((cat) => {
                const ratedCriteria = cat.criteria.filter((c) => form[c.id]?.rating !== null);
                const catScore =
                  ratedCriteria.length > 0
                    ? Math.round(
                        ratedCriteria.reduce((acc, crit) => {
                          const rating = form[crit.id].rating;
                          return acc + (rating ? crit.weights[rating] : 0);
                        }, 0)
                      )
                    : 0;
                return (
                  <Box
                    key={cat.id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 1.75,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      '&:last-child': { borderBottom: 'none' },
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 500,
                        color: 'text.primary',
                      }}
                    >
                      {cat.name}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 700,
                        color: 'primary.main',
                        minWidth: 56,
                        textAlign: 'right',
                      }}
                    >
                      {catScore}%
                    </Typography>
                  </Box>
                );
              })}
            </Box>

            {Object.entries(form).some(
              ([, v]) => v.rating === 'U' || v.rating === 'N'
            ) && (
              <Alert
                severity="warning"
                sx={{
                  mt: 2,
                  mb: 2,
                  textAlign: 'left',
                  borderRadius: 2,
                  bgcolor: 'warning.lighter',
                  border: '1px solid',
                  borderColor: 'warning.light',
                  '& .MuiAlert-icon': {
                    color: 'warning.main',
                  },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    mb: 1.5,
                    color: 'warning.dark',
                  }}
                >
                  Flagged Items
                </Typography>
                {Object.entries(form)
                  .filter(([, v]) => v.rating === 'U' || v.rating === 'N')
                  .map(([id, v]) => {
                    const name = cabinCrewCategories
                      .flatMap((c) => c.criteria)
                      .find((c) => c.id === id)?.name;
                    return (
                      <Typography
                        key={id}
                        variant="body2"
                        sx={{
                          color: 'warning.dark',
                          mb: 0.5,
                          '&:last-child': { mb: 0 },
                        }}
                      >
                        • {name}: {v.rating === 'U' ? 'Unsatisfactory' : 'Needs Improvement'}
                      </Typography>
                    );
                  })}
              </Alert>
            )}

            <Box sx={{ mt: 5, display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/flight')}
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Back to Flight
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  setSubmitted(false);
                }}
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
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
    <Box sx={{ maxWidth: 900, mx: 'auto', px: { xs: 2, sm: 3 }, py: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/flight')}
          size="small"
          sx={{
            color: 'text.secondary',
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          Back
        </Button>
      </Box>

      <Card
        elevation={0}
        sx={{
          mb: 4,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ py: 4, px: { xs: 3, sm: 4 } }}>
          <Typography
            variant="h4"
            sx={{
              mb: 2,
              fontWeight: 600,
              letterSpacing: '-0.02em',
            }}
          >
            Cabin Crew Assessment
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 1.5,
              fontWeight: 500,
              color: 'text.primary',
            }}
          >
            {crew.name}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              alignItems: 'center',
            }}
          >
            <Box component="span">{flight.flightNumber}</Box>
            <Box component="span" sx={{ opacity: 0.5 }}>
              •
            </Box>
            <Box component="span">{flight.route}</Box>
            <Box component="span" sx={{ opacity: 0.5 }}>
              •
            </Box>
            <Box component="span">{flight.date}</Box>
            <Box component="span" sx={{ opacity: 0.5 }}>
              •
            </Box>
            <Box component="span">ID: {crew.id}</Box>
          </Typography>
        </CardContent>
      </Card>

      {/* Progress */}
      <Card
        elevation={0}
        sx={{
          mb: 4,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          bgcolor: 'background.paper',
        }}
      >
        <CardContent sx={{ py: 3.5, px: { xs: 3, sm: 4 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 2.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, letterSpacing: '-0.01em' }}>
              Progress
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
              {Math.round(progress)}%
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: 'text.secondary',
              mb: 2,
            }}
          >
            {completedCriteria} of {totalCriteria} criteria rated
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 10,
              borderRadius: 5,
              bgcolor: 'action.hover',
              '& .MuiLinearProgress-bar': {
                bgcolor: 'primary.main',
                borderRadius: 5,
              },
            }}
          />
          {missingRemarks.length > 0 && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mt: 2.5,
                p: 1.5,
                borderRadius: 2,
                bgcolor: 'warning.lighter',
                border: '1px solid',
                borderColor: 'warning.light',
              }}
            >
              <WarningIcon sx={{ fontSize: 20, color: 'warning.main' }} />
              <Typography variant="body2" sx={{ color: 'warning.dark', fontWeight: 500 }}>
                {missingRemarks.length} rating{missingRemarks.length > 1 ? 's' : ''} require remarks
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Rating Legend */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 4, flexWrap: 'wrap' }}>
        {[
          { key: 'U', label: 'Unsatisfactory' },
          { key: 'N', label: 'Needs Improvement' },
          { key: 'M', label: 'Meets Standard' },
          { key: 'E', label: 'Exceeds Standard' },
          { key: 'O', label: 'Outstanding' },
        ].map((r) => (
          <Chip
            key={r.key}
            label={`${r.key} — ${r.label}`}
            size="medium"
            sx={{
              bgcolor: `${ratingColors[r.key]}14`,
              color: ratingColors[r.key],
              fontWeight: 600,
              fontSize: '0.8125rem',
              px: 0.5,
              border: '1px solid',
              borderColor: `${ratingColors[r.key]}30`,
            }}
          />
        ))}
      </Box>

      <Alert
        severity="info"
        sx={{
          mb: 4,
          borderRadius: 2,
          bgcolor: 'info.lighter',
          border: '1px solid',
          borderColor: 'info.light',
          '& .MuiAlert-icon': {
            color: 'info.main',
          },
        }}
      >
        <Typography
          variant="body2"
          sx={{
            display: 'block',
            fontWeight: 600,
            mb: 1.5,
            color: 'info.dark',
          }}
        >
          Remarks Requirements
        </Typography>
        <Typography
          variant="body2"
          sx={{
            display: 'block',
            mb: 1,
            color: 'info.dark',
          }}
        >
          • <strong>U / N</strong>: Mandatory remarks highlighting gaps and recommended actions
        </Typography>
        <Typography
          variant="body2"
          sx={{
            display: 'block',
            mb: 1,
            color: 'info.dark',
          }}
        >
          • <strong>M</strong>: Remarks optional but encouraged
        </Typography>
        <Typography
          variant="body2"
          sx={{
            display: 'block',
            color: 'info.dark',
          }}
        >
          • <strong>E / O</strong>: Mandatory remarks acknowledging strengths and positive impact
        </Typography>
      </Alert>

      {/* Categories */}
      {cabinCrewCategories.map((category) => {
        const catCompleted = category.criteria.filter((c) => form[c.id].rating !== null).length;
        return (
          <Accordion
            key={category.id}
            defaultExpanded
            elevation={0}
            sx={{
              mb: 3,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '12px !important',
              '&:before': { display: 'none' },
              '&.Mui-expanded': {
                margin: '0 0 24px 0',
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                px: { xs: 2.5, sm: 3.5 },
                py: 1.5,
                minHeight: 72,
                '&.Mui-expanded': {
                  minHeight: 72,
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                <Typography
                  variant="h6"
                  sx={{
                    flex: 1,
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {category.name}
                </Typography>
                <Chip
                  label={`${catCompleted}/${category.criteria.length}`}
                  size="medium"
                  sx={{
                    bgcolor: catCompleted === category.criteria.length ? 'success.lighter' : 'action.hover',
                    color: catCompleted === category.criteria.length ? 'success.dark' : 'text.secondary',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    mr: 1,
                    border: '1px solid',
                    borderColor:
                      catCompleted === category.criteria.length ? 'success.light' : 'transparent',
                  }}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                px: { xs: 2.5, sm: 3.5 },
                py: 3,
                pt: 1,
              }}
            >
              {category.criteria.map((criterion) => {
                const state = form[criterion.id];
                const needsRemarks =
                  state.rating !== null && REMARKS_REQUIRED.includes(state.rating) && state.remarks.trim() === '';
                return (
                  <Box
                    key={criterion.id}
                    sx={{
                      mb: 3.5,
                      pb: 3.5,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      '&:last-child': { borderBottom: 'none', mb: 0, pb: 0 },
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        mb: 2,
                        color: 'text.primary',
                      }}
                    >
                      {criterion.name}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        mb: 2.5,
                        flexWrap: 'wrap',
                      }}
                    >
                      <ToggleButtonGroup
                        exclusive
                        value={state.rating}
                        onChange={(_, val) => handleRatingChange(criterion.id, val)}
                        size="medium"
                        sx={{
                          gap: 0.5,
                        }}
                      >
                        {RATING_LABELS.map((r) => (
                          <ToggleButton
                            key={r.value}
                            value={r.value}
                            sx={{
                              px: 2.5,
                              py: 1,
                              fontWeight: 700,
                              fontSize: '0.875rem',
                              borderRadius: '8px !important',
                              border: '1.5px solid',
                              borderColor: 'divider',
                              color: 'text.secondary',
                              transition: 'all 0.2s',
                              '&:hover': {
                                bgcolor: `${ratingColors[r.value]}14`,
                                borderColor: `${ratingColors[r.value]}50`,
                                color: ratingColors[r.value],
                              },
                              '&.Mui-selected': {
                                bgcolor: ratingColors[r.value],
                                color: '#fff',
                                borderColor: ratingColors[r.value],
                                '&:hover': {
                                  bgcolor: ratingColors[r.value],
                                  opacity: 0.9,
                                },
                              },
                            }}
                          >
                            {r.label}
                          </ToggleButton>
                        ))}
                      </ToggleButtonGroup>
                      {state.rating && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.secondary',
                            fontWeight: 500,
                            px: 1.5,
                            py: 0.75,
                            borderRadius: 1.5,
                            bgcolor: 'action.hover',
                          }}
                        >
                          Weight: {criterion.weights[state.rating]}%
                        </Typography>
                      )}
                    </Box>
                    {state.rating && REMARKS_REQUIRED.includes(state.rating) && (
                      <Box>
                        <TextField
                          fullWidth
                          multiline
                          minRows={3}
                          placeholder={`Remarks required for rating "${state.rating}"`}
                          value={state.remarks}
                          onChange={(e) => handleRemarksChange(criterion.id, e.target.value)}
                          error={needsRemarks}
                          helperText={
                            needsRemarks
                              ? 'Remarks are mandatory for this rating'
                              : `${state.remarks.length}/500 characters`
                          }
                          slotProps={{ htmlInput: { maxLength: 500 } }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              fontSize: '0.9375rem',
                              '& fieldset': {
                                borderWidth: '1.5px',
                              },
                            },
                          }}
                        />
                      </Box>
                    )}
                    {state.rating && !REMARKS_REQUIRED.includes(state.rating) && (
                      <TextField
                        fullWidth
                        placeholder="Optional remarks"
                        value={state.remarks}
                        onChange={(e) => handleRemarksChange(criterion.id, e.target.value)}
                        slotProps={{ htmlInput: { maxLength: 500 } }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            fontSize: '0.9375rem',
                            '& fieldset': {
                              borderWidth: '1.5px',
                            },
                          },
                        }}
                      />
                    )}
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
          mt: 4,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ py: 4, px: { xs: 3, sm: 4 } }}>
          <Typography
            variant="h5"
            sx={{
              mb: 3.5,
              fontWeight: 600,
              letterSpacing: '-0.01em',
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
                fontSize: '0.9375rem',
                '& fieldset': {
                  borderWidth: '1.5px',
                },
              },
              '& .MuiInputLabel-root': {
                fontWeight: 500,
              },
            }}
          />
          <TextField
            fullWidth
            label="Evaluator Signature"
            placeholder="Enter your full name"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                fontSize: '0.9375rem',
                '& fieldset': {
                  borderWidth: '1.5px',
                },
              },
              '& .MuiInputLabel-root': {
                fontWeight: 500,
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Validation Warnings */}
      {(completedCriteria < totalCriteria || missingRemarks.length > 0) && (
        <Alert
          severity="info"
          sx={{
            mt: 4,
            borderRadius: 2,
            bgcolor: 'info.lighter',
            border: '1px solid',
            borderColor: 'info.light',
            '& .MuiAlert-icon': {
              color: 'info.main',
            },
          }}
        >
          {completedCriteria < totalCriteria && (
            <Typography variant="body2" sx={{ mb: missingRemarks.length > 0 ? 1 : 0, color: 'info.dark' }}>
              • {totalCriteria - completedCriteria} criteria not yet rated
            </Typography>
          )}
          {missingRemarks.length > 0 && (
            <Typography variant="body2" sx={{ color: 'info.dark' }}>
              • {missingRemarks.length} rating{missingRemarks.length > 1 ? 's' : ''} require remarks before submission
            </Typography>
          )}
        </Alert>
      )}

      {/* Actions */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mt: 4,
          mb: 6,
          justifyContent: 'flex-end',
          flexWrap: 'wrap',
        }}
      >
        <Button
          variant="outlined"
          size="large"
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.9375rem',
            borderWidth: '1.5px',
            '&:hover': {
              borderWidth: '1.5px',
            },
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
            px: 4,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.9375rem',
          }}
        >
          Submit Evaluation
        </Button>
      </Box>
    </Box>
  );
}
