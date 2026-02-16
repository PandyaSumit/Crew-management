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
      <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 1 }}>
              Evaluation Submitted
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {crew.name} — {flight.flightNumber} {flight.route}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 3 }}>
              {overallScore}%
            </Typography>

            <Typography variant="h6" sx={{ mb: 2, textAlign: 'left' }}>
              Category Breakdown
            </Typography>
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
                    py: 1,
                    borderBottom: '1px solid #F0F0F5',
                  }}
                >
                  <Typography variant="body2">{cat.name}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {catScore}%
                  </Typography>
                </Box>
              );
            })}

            {Object.entries(form).some(
              ([, v]) => v.rating === 'U' || v.rating === 'N'
            ) && (
              <Alert severity="warning" sx={{ mt: 2, textAlign: 'left' }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Flagged Items
                </Typography>
                {Object.entries(form)
                  .filter(([, v]) => v.rating === 'U' || v.rating === 'N')
                  .map(([id, v]) => {
                    const name = cabinCrewCategories
                      .flatMap((c) => c.criteria)
                      .find((c) => c.id === id)?.name;
                    return (
                      <Typography key={id} variant="body2">
                        — {name}: {v.rating === 'U' ? 'Unsatisfactory' : 'Needs Improvement'}
                      </Typography>
                    );
                  })}
              </Alert>
            )}

            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button variant="outlined" onClick={() => navigate('/flight')}>
                Back to Flight
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  setSubmitted(false);
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
    <Box sx={{ maxWidth: 860, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/flight')}
          size="small"
          sx={{ color: 'text.secondary' }}
        >
          Back
        </Button>
      </Box>

      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ py: 2 }}>
          <Typography variant="h5" sx={{ mb: 0.5 }}>
            Cabin Crew Assessment — {crew.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {flight.flightNumber} &bull; {flight.route} &bull; {flight.date} &bull; ID: {crew.id}
          </Typography>
        </CardContent>
      </Card>

      {/* Progress */}
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Progress: {completedCriteria}/{totalCriteria} criteria rated
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {Math.round(progress)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: '#E8E8EE',
              '& .MuiLinearProgress-bar': { bgcolor: 'primary.main', borderRadius: 4 },
            }}
          />
          {missingRemarks.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
              <WarningIcon sx={{ fontSize: 16, color: 'warning.main' }} />
              <Typography variant="caption" sx={{ color: 'warning.main' }}>
                {missingRemarks.length} rating(s) require remarks
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Rating Legend */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
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
            size="small"
            sx={{
              bgcolor: `${ratingColors[r.key]}14`,
              color: ratingColors[r.key],
              fontWeight: 500,
              fontSize: '0.7rem',
            }}
          />
        ))}
      </Box>

      <Alert severity="info" sx={{ mb: 2, fontSize: '0.75rem' }}>
        <Typography variant="caption" sx={{ display: 'block', fontWeight: 600, mb: 0.5 }}>
          Remarks Requirements:
        </Typography>
        <Typography variant="caption" sx={{ display: 'block' }}>
          • <strong>U / N</strong>: Mandatory remarks highlighting gaps and recommended actions
        </Typography>
        <Typography variant="caption" sx={{ display: 'block' }}>
          • <strong>M</strong>: Remarks optional but encouraged
        </Typography>
        <Typography variant="caption" sx={{ display: 'block' }}>
          • <strong>E / O</strong>: Mandatory remarks acknowledging strengths and positive impact
        </Typography>
      </Alert>

      {/* Categories */}
      {cabinCrewCategories.map((category) => {
        const catCompleted = category.criteria.filter((c) => form[c.id].rating !== null).length;
        return (
          <Accordion key={category.id} defaultExpanded sx={{ mb: 1, '&:before': { display: 'none' } }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                <Typography variant="subtitle1" sx={{ flex: 1 }}>
                  {category.name}
                </Typography>
                <Chip
                  label={`${catCompleted}/${category.criteria.length}`}
                  size="small"
                  sx={{
                    bgcolor: catCompleted === category.criteria.length ? '#E8F5E9' : '#F5F5F7',
                    color: catCompleted === category.criteria.length ? '#2E7D32' : '#5A5A7A',
                    fontWeight: 500,
                    mr: 1,
                  }}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {category.criteria.map((criterion) => {
                const state = form[criterion.id];
                const needsRemarks =
                  state.rating !== null && REMARKS_REQUIRED.includes(state.rating) && state.remarks.trim() === '';
                return (
                  <Box
                    key={criterion.id}
                    sx={{
                      mb: 2,
                      pb: 2,
                      borderBottom: '1px solid #F0F0F5',
                      '&:last-child': { borderBottom: 'none', mb: 0, pb: 0 },
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                      {criterion.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                      <ToggleButtonGroup
                        exclusive
                        value={state.rating}
                        onChange={(_, val) => handleRatingChange(criterion.id, val)}
                        size="small"
                      >
                        {RATING_LABELS.map((r) => (
                          <ToggleButton
                            key={r.value}
                            value={r.value}
                            sx={{
                              px: 2,
                              fontWeight: 600,
                              fontSize: '0.8rem',
                              borderColor: '#E8E8EE',
                              '&.Mui-selected': {
                                bgcolor: ratingColors[r.value],
                                color: '#fff',
                                '&:hover': { bgcolor: ratingColors[r.value] },
                              },
                            }}
                          >
                            {r.label}
                          </ToggleButton>
                        ))}
                      </ToggleButtonGroup>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {state.rating && `Weight: ${criterion.weights[state.rating]}%`}
                      </Typography>
                    </Box>
                    {state.rating && REMARKS_REQUIRED.includes(state.rating) && (
                      <Box>
                        <TextField
                          fullWidth
                          size="small"
                          multiline
                          minRows={2}
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
                          sx={{ mt: 1 }}
                        />
                      </Box>
                    )}
                    {state.rating && !REMARKS_REQUIRED.includes(state.rating) && (
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Optional remarks"
                        value={state.remarks}
                        onChange={(e) => handleRemarksChange(criterion.id, e.target.value)}
                        slotProps={{ htmlInput: { maxLength: 500 } }}
                        sx={{ mt: 1 }}
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
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Final Review
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Overall Remarks"
            placeholder="Enter any final observations or comments..."
            value={overallRemarks}
            onChange={(e) => setOverallRemarks(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Evaluator Signature"
            placeholder="Enter your full name"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Validation Warnings */}
      {(completedCriteria < totalCriteria || missingRemarks.length > 0) && (
        <Alert severity="info" sx={{ mt: 2 }}>
          {completedCriteria < totalCriteria && (
            <Typography variant="body2">
              {totalCriteria - completedCriteria} criteria not yet rated.
            </Typography>
          )}
          {missingRemarks.length > 0 && (
            <Typography variant="body2">
              {missingRemarks.length} rating(s) require remarks before submission.
            </Typography>
          )}
        </Alert>
      )}

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 2, mt: 2, mb: 4, justifyContent: 'flex-end' }}>
        <Button variant="outlined" size="large">
          Save Draft
        </Button>
        <Button
          variant="contained"
          size="large"
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          Submit Evaluation
        </Button>
      </Box>
    </Box>
  );
}
