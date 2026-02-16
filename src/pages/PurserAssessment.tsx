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
      <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 1 }}>
              Purser Evaluation Submitted
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {crew.name} — {flight.flightNumber} {flight.route}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 3 }}>
              {overallScore}%
            </Typography>

            <Typography variant="h6" sx={{ mb: 2, textAlign: 'left' }}>
              Section Breakdown
            </Typography>
            {purserSections.map((sec) => {
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
                    py: 1,
                    borderBottom: '1px solid #F0F0F5',
                  }}
                >
                  <Typography variant="body2">{sec.name}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {secScore}%
                  </Typography>
                </Box>
              );
            })}

            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button variant="outlined" onClick={() => navigate('/flight')}>
                Back to Flight
              </Button>
              <Button variant="contained" onClick={() => setSubmitted(false)}>
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
            Purser Assessment — {crew.name}
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
              Progress: {completedItems}/{totalItems} items rated
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
          {unratedSafetyCritical.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
              <WarningIcon sx={{ fontSize: 16, color: 'error.main' }} />
              <Typography variant="caption" sx={{ color: 'error.main' }}>
                {unratedSafetyCritical.length} safety-critical item(s) not yet assessed
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Rating Legend */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        {RATING_LABELS.map((r) => (
          <Chip
            key={r.value}
            label={`${r.value} — ${r.full}`}
            size="small"
            sx={{
              bgcolor: `${purserRatingColors[r.value]}14`,
              color: purserRatingColors[r.value],
              fontWeight: 500,
              fontSize: '0.7rem',
            }}
          />
        ))}
        <Chip
          icon={<StarIcon sx={{ fontSize: 14, color: '#F57C00' }} />}
          label="Safety-Critical"
          size="small"
          sx={{ bgcolor: '#FFF3E0', color: '#E65100', fontWeight: 500, fontSize: '0.7rem' }}
        />
      </Box>

      {/* Sections */}
      {purserSections.map((section) => {
        const secCompleted = section.items.filter((item) => form[item.id].rating !== null).length;
        return (
          <Accordion key={section.id} defaultExpanded sx={{ mb: 1, '&:before': { display: 'none' } }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                <Typography variant="subtitle1" sx={{ flex: 1 }}>
                  {section.name}
                </Typography>
                <Chip
                  label={`${secCompleted}/${section.items.length}`}
                  size="small"
                  sx={{
                    bgcolor: secCompleted === section.items.length ? '#E8F5E9' : '#F5F5F7',
                    color: secCompleted === section.items.length ? '#2E7D32' : '#5A5A7A',
                    fontWeight: 500,
                    mr: 1,
                  }}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {section.items.map((item) => {
                const state = form[item.id];
                return (
                  <Box
                    key={item.id}
                    sx={{
                      mb: 2,
                      pb: 2,
                      borderBottom: '1px solid #F0F0F5',
                      '&:last-child': { borderBottom: 'none', mb: 0, pb: 0 },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, flex: 1 }}>
                        {item.name}
                      </Typography>
                      {item.isSafetyCritical && (
                        <Tooltip title="Safety-Critical Item">
                          <StarIcon sx={{ fontSize: 18, color: '#F57C00' }} />
                        </Tooltip>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                      <ToggleButtonGroup
                        exclusive
                        value={state.rating}
                        onChange={(_, val) => handleRatingChange(item.id, val)}
                        size="small"
                      >
                        {RATING_LABELS.map((r) => (
                          <ToggleButton
                            key={r.value}
                            value={r.value}
                            sx={{
                              px: 2.5,
                              fontWeight: 600,
                              fontSize: '0.8rem',
                              borderColor: '#E8E8EE',
                              '&.Mui-selected': {
                                bgcolor: purserRatingColors[r.value],
                                color: '#fff',
                                '&:hover': { bgcolor: purserRatingColors[r.value] },
                              },
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
                    />
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

      {/* Validation */}
      {(completedItems < totalItems || unratedSafetyCritical.length > 0) && (
        <Alert severity="info" sx={{ mt: 2 }}>
          {completedItems < totalItems && (
            <Typography variant="body2">
              {totalItems - completedItems} item(s) not yet rated.
            </Typography>
          )}
          {unratedSafetyCritical.length > 0 && (
            <Typography variant="body2">
              {unratedSafetyCritical.length} safety-critical item(s) must be assessed.
            </Typography>
          )}
        </Alert>
      )}

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 2, mt: 2, mb: 4, justifyContent: 'flex-end' }}>
        <Button variant="outlined" size="large">
          Save Draft
        </Button>
        <Button variant="contained" size="large" disabled={!canSubmit} onClick={handleSubmit}>
          Submit Evaluation
        </Button>
      </Box>
    </Box>
  );
}
