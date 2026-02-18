import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  Divider,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  useTheme,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BoltIcon from "@mui/icons-material/Bolt";
import StarIcon from "@mui/icons-material/Star";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { purserSections, crewMembers, flights } from "../data/mockData";
import type { PurserRating } from "../types";

const RATING_LABELS: { value: PurserRating; label: string; full: string }[] = [
  { value: "N", label: "N", full: "Not Achieved" },
  { value: "R", label: "R", full: "Requires Improvement" },
  { value: "A", label: "A", full: "Achieved / Standard" },
];

const RATING_STYLES: Record<
  PurserRating,
  { selected: string; text: string; light: string }
> = {
  N: { selected: "#ef4444", text: "#ef4444", light: "#fef2f2" }, // Red
  R: { selected: "#f59e0b", text: "#d97706", light: "#fffbeb" }, // Amber
  A: { selected: "#22c55e", text: "#16a34a", light: "#f0fdf4" }, // Green
};

interface ItemState {
  rating: PurserRating | null;
  remarks: string;
}

type FormState = Record<string, ItemState>;

export default function PurserAssessment() {
  const { flightId, crewId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const flight = flights.find((f) => f.id === flightId);
  const crew = crewMembers.find((c) => c.id === crewId);

  // Form State
  const [form, setForm] = useState<FormState>(() => {
    const initial: FormState = {};
    purserSections.forEach((sec) => {
      sec.items.forEach((item) => {
        initial[item.id] = { rating: null, remarks: "" };
      });
    });
    return initial;
  });

  // Structured Remarks State
  const [remarks, setRemarks] = useState({
    summary: "",
    strengths: "",
    development: "",
    actionPlan: "",
  });

  // Signatures State
  const [signatures, setSignatures] = useState({
    purser: { name: "", date: "", signed: false },
    evaluator: { name: "", date: "", signed: false },
    manager: { name: "", date: "", signed: false },
  });

  const [submitted, setSubmitted] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Derived Data
  const totalItems = useMemo(
    () => purserSections.reduce((acc, sec) => acc + sec.items.length, 0),
    [],
  );
  const completedItems = useMemo(
    () => Object.values(form).filter((v) => v.rating !== null).length,
    [form],
  );
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  const safetyCriticalItems = useMemo(
    () =>
      purserSections.flatMap((sec) =>
        sec.items.filter((item) => item.isSafetyCritical),
      ),
    [],
  );

  const failedSafetyItems = useMemo(
    () => safetyCriticalItems.filter((item) => form[item.id].rating === "N"),
    [safetyCriticalItems, form],
  );

  const overallScore = useMemo(() => {
    const rated = Object.values(form).filter((v) => v.rating !== null);
    if (rated.length === 0) return 0;

    // N=0, R=50, A=100
    const scoreMap: Record<PurserRating, number> = { N: 0, R: 50, A: 100 };
    const total = rated.reduce(
      (acc, v) => acc + (v.rating ? scoreMap[v.rating] : 0),
      0,
    );
    return Math.round(total / rated.length);
  }, [form]);

  const ratingLabel = useMemo(() => {
    if (overallScore < 40)
      return { label: "Unsatisfactory", color: "#ef4444", bg: "#fef2f2" };
    if (overallScore < 60)
      return { label: "Needs Improvement", color: "#f97316", bg: "#fff7ed" };
    if (overallScore < 80)
      return { label: "Meets Standard", color: "#eab308", bg: "#fefce8" };
    if (overallScore < 100)
      return { label: "Exceeds Standard", color: "#22c55e", bg: "#f0fdf4" };
    return { label: "Outstanding", color: "#15803d", bg: "#dcfce7" };
  }, [overallScore]);

  // Handlers
  const handleRatingChange = (itemId: string, rating: PurserRating | null) => {
    setForm((prev) => ({ ...prev, [itemId]: { ...prev[itemId], rating } }));
  };

  const handleItemRemarksChange = (itemId: string, text: string) => {
    setForm((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], remarks: text },
    }));
  };

  const handleStructuredRemarkChange = (
    field: keyof typeof remarks,
    value: string,
  ) => {
    setRemarks((prev) => ({ ...prev, [field]: value }));
  };

  const handleSign = (role: keyof typeof signatures) => {
    const now = new Date().toISOString().split("T")[0];
    const nameMap = {
      purser: crew?.name || "Purser",
      evaluator: "Current User", // Mock
      manager: "Manager Name", // Mock
    };
    setSignatures((prev) => ({
      ...prev,
      [role]: { name: nameMap[role], date: now, signed: true },
    }));
  };

  const handleSubmit = () => {
    // 1. Completion Check
    if (completedItems < totalItems) {
      setValidationError(`Please complete all ${totalItems} assessment items.`);
      return;
    }

    // 2. Safety Critical Check
    if (failedSafetyItems.length > 0) {
      setValidationError(
        "Assessment FAILED: Safety-critical items were marked as 'Not Achieved'. You cannot submit a successful evaluation with failed safety items.",
      );
      return;
    }

    // 3. Signature Check
    if (!signatures.evaluator.signed || !signatures.purser.signed) {
      setValidationError("Both Evaluator and Purser must sign the assessment.");
      return;
    }

    setValidationError(null);
    setSubmitted(true);
  };

  if (!flight || !crew) return <Box>Flight or Crew not found</Box>;

  if (submitted) {
    return (
      <Box sx={{ maxWidth: 800, mx: "auto", mt: 4, textAlign: "center" }}>
        <CheckCircleIcon sx={{ fontSize: 64, color: "#22c55e", mb: 2 }} />
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Assessment Submitted
        </Typography>
        <Typography color="textSecondary" sx={{ mb: 4 }}>
          The evaluation for {crew.name} on flight {flight.flightNumber} has
          been recorded.
        </Typography>
        <Button variant="contained" onClick={() => navigate("/flights")}>
          Return to Flights
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Error Dialog */}
      <Dialog open={!!validationError} onClose={() => setValidationError(null)}>
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "#dc2626",
          }}
        >
          <ErrorOutlineIcon color="error" /> Submission Blocked
        </DialogTitle>
        <DialogContent>
          <Typography>{validationError}</Typography>
          {failedSafetyItems.length > 0 && (
            <Box sx={{ mt: 2, p: 2, bgcolor: "#fef2f2", borderRadius: 1 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, color: "#991b1b" }}
              >
                Failed Safety Items:
              </Typography>
              <ul
                style={{ margin: "4px 0", paddingLeft: 20, color: "#b91c1c" }}
              >
                {failedSafetyItems.map((item) => (
                  <li key={item.id}>{item.name}</li>
                ))}
              </ul>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setValidationError(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(`/flights/${flightId}`)}
        sx={{ mb: 3, color: "#6b7280", textTransform: "none" }}
      >
        Back to Flight
      </Button>

      {/* Header */}
      <Card
        elevation={0}
        sx={{ border: "1px solid #e8eaed", borderRadius: "12px", mb: 3 }}
      >
        <Box
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              sx={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827" }}
            >
              Purser Assessment
            </Typography>
            <Typography sx={{ color: "#6b7280" }}>
              {crew.name} • {flight.flightNumber}
            </Typography>
          </Box>

          <Box
            sx={{
              textAlign: "center",
              px: 3,
              py: 1,
              bgcolor: ratingLabel.bg,
              borderRadius: "8px",
              border: `1px solid ${ratingLabel.color}30`,
            }}
          >
            <Typography
              sx={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: ratingLabel.color,
                textTransform: "uppercase",
              }}
            >
              Overall Score
            </Typography>
            <Typography
              sx={{
                fontSize: "1.5rem",
                fontWeight: 800,
                color: ratingLabel.color,
              }}
            >
              {overallScore}%
            </Typography>
            <Typography
              sx={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: ratingLabel.color,
              }}
            >
              {ratingLabel.label}
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Box sx={{ px: 3, py: 2, bgcolor: "#f9fafb" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography sx={{ fontSize: "0.875rem", fontWeight: 500 }}>
              Progress
            </Typography>
            <Typography sx={{ fontSize: "0.875rem", fontWeight: 600 }}>
              {Math.round(progress)}%
            </Typography>
          </Box>
          <Box
            sx={{
              w: "100%",
              h: 6,
              bgcolor: "#e5e7eb",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                width: `${progress}%`,
                height: "100%",
                bgcolor:
                  progress === 100 ? "#22c55e" : theme.palette.primary.main,
                transition: "width 0.3s",
              }}
            />
          </Box>
          {failedSafetyItems.length > 0 && (
            <Alert severity="error" icon={<BoltIcon />} sx={{ mt: 2 }}>
              Critical Safety Failure Detected: {failedSafetyItems.length} items
              failed.
            </Alert>
          )}
        </Box>
      </Card>

      {/* Assessment Sections */}
      {purserSections.map((section) => {
        const completedCount = section.items.filter(
          (i) => form[i.id].rating !== null,
        ).length;
        const isComplete = completedCount === section.items.length;

        return (
          <Accordion
            key={section.id}
            defaultExpanded
            elevation={0}
            sx={{
              border: "1px solid #e8eaed",
              borderRadius: "8px !important",
              mb: 2,
              overflow: "hidden",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ bgcolor: isComplete ? "#f0fdf4" : "#ffffff" }}
            >
              <Typography sx={{ fontWeight: 600, flex: 1 }}>
                {section.name}
              </Typography>
              <Chip
                label={`${completedCount}/${section.items.length}`}
                size="small"
                sx={{
                  bgcolor: isComplete ? "#dcfce7" : "#f3f4f6",
                  color: isComplete ? "#166534" : "#374151",
                  fontWeight: 600,
                }}
              />
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              {section.items.map((item, idx) => {
                const state = form[item.id];
                return (
                  <Box
                    key={item.id}
                    sx={{
                      p: 3,
                      borderBottom:
                        idx !== section.items.length - 1
                          ? "1px solid #f3f4f6"
                          : "none",
                      bgcolor: item.isSafetyCritical
                        ? "#fffbeb"
                        : "transparent",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1,
                        mb: 1.5,
                      }}
                    >
                      {item.isSafetyCritical && (
                        <Tooltip title="Safety Critical - Mandatory Pass">
                          <StarIcon sx={{ color: "#d97706", fontSize: 20 }} />
                        </Tooltip>
                      )}
                      <Typography
                        sx={{
                          fontWeight: 500,
                          flex: 1,
                          color: item.isSafetyCritical ? "#92400e" : "#111827",
                        }}
                      >
                        {item.name}
                      </Typography>
                    </Box>

                    <Grid container spacing={2} alignItems="center">
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <ToggleButtonGroup
                          exclusive
                          value={state.rating}
                          onChange={(_, val) =>
                            handleRatingChange(item.id, val)
                          }
                          fullWidth
                          size="small"
                        >
                          {RATING_LABELS.map((r) => (
                            <ToggleButton
                              key={r.value}
                              value={r.value}
                              sx={{
                                fontWeight: 600,
                                "&.Mui-selected": {
                                  bgcolor: `${RATING_STYLES[r.value].selected} !important`,
                                  color: "white !important",
                                },
                              }}
                            >
                              {r.full}
                            </ToggleButton>
                          ))}
                        </ToggleButtonGroup>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          placeholder="Add remarks..."
                          fullWidth
                          size="small"
                          value={state.remarks}
                          onChange={(e) =>
                            handleItemRemarksChange(item.id, e.target.value)
                          }
                          sx={{ bgcolor: "white" }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                );
              })}
            </AccordionDetails>
          </Accordion>
        );
      })}

      {/* Remarks Section */}
      <Card
        elevation={0}
        sx={{ border: "1px solid #e8eaed", borderRadius: "12px", mb: 3, p: 3 }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Final Feedback
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
              Performance Summary
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Overall summary..."
              value={remarks.summary}
              onChange={(e) =>
                handleStructuredRemarkChange("summary", e.target.value)
              }
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
              Key Strengths
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Bullet points..."
              value={remarks.strengths}
              onChange={(e) =>
                handleStructuredRemarkChange("strengths", e.target.value)
              }
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
              Development Areas
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Bullet points..."
              value={remarks.development}
              onChange={(e) =>
                handleStructuredRemarkChange("development", e.target.value)
              }
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
              Action Plan
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder="Next steps..."
              value={remarks.actionPlan}
              onChange={(e) =>
                handleStructuredRemarkChange("actionPlan", e.target.value)
              }
            />
          </Grid>
        </Grid>
      </Card>

      {/* Signatures */}
      <Card
        elevation={0}
        sx={{ border: "1px solid #e8eaed", borderRadius: "12px", mb: 4, p: 3 }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Signatures
        </Typography>
        <Grid container spacing={3}>
          {/* Purser */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                p: 2,
                border: "1px dashed #d1d5db",
                borderRadius: 2,
                textAlign: "center",
                bgcolor: signatures.purser.signed ? "#f0fdf4" : "transparent",
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Purser / Evaluatee
              </Typography>
              {signatures.purser.signed ? (
                <Box>
                  <Typography
                    sx={{
                      fontFamily: "cursive",
                      fontSize: "1.2rem",
                      color: "#16a34a",
                    }}
                  >
                    {signatures.purser.name}
                  </Typography>
                  <Typography variant="caption">
                    {signatures.purser.date}
                  </Typography>
                </Box>
              ) : (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleSign("purser")}
                >
                  Sign as {crew.name}
                </Button>
              )}
            </Box>
          </Grid>
          {/* Evaluator */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                p: 2,
                border: "1px dashed #d1d5db",
                borderRadius: 2,
                textAlign: "center",
                bgcolor: signatures.evaluator.signed
                  ? "#f0fdf4"
                  : "transparent",
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Evaluator
              </Typography>
              {signatures.evaluator.signed ? (
                <Box>
                  <Typography
                    sx={{
                      fontFamily: "cursive",
                      fontSize: "1.2rem",
                      color: "#16a34a",
                    }}
                  >
                    {signatures.evaluator.name}
                  </Typography>
                  <Typography variant="caption">
                    {signatures.evaluator.date}
                  </Typography>
                </Box>
              ) : (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleSign("evaluator")}
                >
                  Sign as Evaluator
                </Button>
              )}
            </Box>
          </Grid>
          {/* Manager */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                p: 2,
                border: "1px dashed #d1d5db",
                borderRadius: 2,
                textAlign: "center",
                bgcolor: signatures.manager.signed ? "#f0fdf4" : "transparent",
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Line Checker / Manager
              </Typography>
              {signatures.manager.signed ? (
                <Box>
                  <Typography
                    sx={{
                      fontFamily: "cursive",
                      fontSize: "1.2rem",
                      color: "#16a34a",
                    }}
                  >
                    {signatures.manager.name}
                  </Typography>
                  <Typography variant="caption">
                    {signatures.manager.date}
                  </Typography>
                </Box>
              ) : (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleSign("manager")}
                >
                  Sign as Manager
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Card>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate(`/flights/${flightId}`)}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          sx={{ bgcolor: "#111827", px: 4 }}
          disabled={submitted}
        >
          Submit Assessment
        </Button>
      </Box>
    </Box>
  );
}
