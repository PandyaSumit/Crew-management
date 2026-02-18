import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { cabinCrewCategories, crewMembers, flights } from "../data/mockData";
import { ratingColors } from "../theme";
import type { RatingValue } from "../types";

const RATING_LABELS: {
  value: RatingValue;
  label: string;
  fullLabel: string;
}[] = [
  { value: "U", label: "U", fullLabel: "Unsatisfactory" },
  { value: "N", label: "N", fullLabel: "Needs Improvement" },
  { value: "M", label: "M", fullLabel: "Meets Standard" },
  { value: "E", label: "E", fullLabel: "Exceeds Standard" },
  { value: "O", label: "O", fullLabel: "Outstanding" },
];

// Neutral soft palette per rating
const RATING_STYLES: Record<
  RatingValue,
  { selected: string; light: string; text: string }
> = {
  U: { selected: "#ef4444", light: "#fef2f2", text: "#dc2626" },
  N: { selected: "#f97316", light: "#fff7ed", text: "#c2410c" },
  M: { selected: "#f59e0b", light: "#fffbeb", text: "#d97706" },
  E: { selected: "#22c55e", light: "#f0fdf4", text: "#15803d" },
  O: { selected: "#4f6ef7", light: "#eef1fe", text: "#3b4fd8" },
};

const REMARKS_REQUIRED: RatingValue[] = ["U", "N", "E", "O"];

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
        initial[c.id] = { rating: null, remarks: "" };
      });
    });
    return initial;
  });

  const [overallRemarks, setOverallRemarks] = useState("");
  const [signature, setSignature] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const totalCriteria = useMemo(
    () =>
      cabinCrewCategories.reduce((acc, cat) => acc + cat.criteria.length, 0),
    [],
  );

  const completedCriteria = useMemo(
    () => Object.values(form).filter((v) => v.rating !== null).length,
    [form],
  );

  const missingRemarks = useMemo(
    () =>
      Object.entries(form).filter(
        ([, v]) =>
          v.rating &&
          REMARKS_REQUIRED.includes(v.rating) &&
          v.remarks.trim() === "",
      ),
    [form],
  );

  const progress =
    totalCriteria > 0 ? (completedCriteria / totalCriteria) * 100 : 0;

  const overallScore = useMemo(() => {
    const categoryScores = cabinCrewCategories.map((cat) => {
      const catCriteria = cat.criteria.filter(
        (c) => form[c.id]?.rating !== null,
      );
      if (catCriteria.length === 0) return null;
      const catTotal = catCriteria.reduce((acc, crit) => {
        const rating = form[crit.id].rating;
        return acc + (rating ? crit.weights[rating] : 0);
      }, 0);
      const ratedMax = catCriteria.reduce((acc, c) => acc + c.weights.O, 0);
      const allMax = cat.criteria.reduce((acc, c) => acc + c.weights.O, 0);
      return (catTotal / ratedMax) * allMax;
    });
    const valid = categoryScores.filter((s): s is number => s !== null);
    if (valid.length === 0) return null;
    return Math.round(valid.reduce((a, s) => a + s, 0) / valid.length);
  }, [form]);

  const handleRatingChange = (
    criterionId: string,
    rating: RatingValue | null,
  ) => {
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
    completedCriteria === totalCriteria &&
    missingRemarks.length === 0 &&
    signature.trim() !== "";

  const scoreColor =
    overallScore !== null
      ? overallScore >= 80
        ? "#15803d"
        : overallScore >= 60
          ? "#d97706"
          : "#dc2626"
      : "#111827";

  // ── Not Found ───────────────────────────────────────────────────────────────
  if (!flight || !crew) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography sx={{ fontSize: "0.875rem", color: "#6b7280" }}>
          Flight or crew member not found.
        </Typography>
        <Button
          onClick={() => navigate("/flight")}
          sx={{ mt: 2, textTransform: "none", fontSize: "0.825rem" }}
        >
          Back to Flight
        </Button>
      </Box>
    );
  }

  // ── Submitted ───────────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <Box sx={{ maxWidth: 620, mx: "auto", mt: 4 }}>
        <Card
          elevation={0}
          sx={{
            border: "1px solid #e8eaed",
            borderRadius: "12px",
            bgcolor: "#ffffff",
          }}
        >
          <Box
            sx={{
              p: 4,
              textAlign: "center",
              borderBottom: "1px solid #f3f4f6",
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                bgcolor: "#f0fdf4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 26, color: "#22c55e" }} />
            </Box>

            <Typography
              sx={{
                fontSize: "1.05rem",
                fontWeight: 600,
                color: "#111827",
                letterSpacing: "-0.02em",
                mb: 0.5,
              }}
            >
              Evaluation Submitted
            </Typography>
            <Typography
              sx={{ fontSize: "0.825rem", color: "#6b7280", mb: 2.5 }}
            >
              {crew.name}&nbsp;·&nbsp;{flight.flightNumber}&nbsp;·&nbsp;
              {flight.route}
            </Typography>

            <Box
              sx={{
                display: "inline-flex",
                flexDirection: "column",
                alignItems: "center",
                px: 3,
                py: 1.5,
                borderRadius: "10px",
                border: "1px solid #e8eaed",
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.62rem",
                  fontWeight: 600,
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  mb: 0.25,
                }}
              >
                Overall Score
              </Typography>
              <Typography
                sx={{
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: scoreColor,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                }}
              >
                {overallScore}%
              </Typography>
            </Box>
          </Box>

          {/* Category Breakdown */}
          <Box sx={{ p: 3 }}>
            <Typography
              sx={{
                fontSize: "0.72rem",
                fontWeight: 600,
                color: "#9ca3af",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                mb: 1.5,
              }}
            >
              Category Breakdown
            </Typography>

            {cabinCrewCategories.map((cat, idx) => {
              const ratedCriteria = cat.criteria.filter(
                (c) => form[c.id]?.rating !== null,
              );
              const catScore =
                ratedCriteria.length > 0
                  ? Math.round(
                      ratedCriteria.reduce((acc, crit) => {
                        const rating = form[crit.id].rating;
                        return acc + (rating ? crit.weights[rating] : 0);
                      }, 0),
                    )
                  : 0;
              const isLast = idx === cabinCrewCategories.length - 1;
              const cs =
                catScore >= 75
                  ? "#15803d"
                  : catScore >= 55
                    ? "#d97706"
                    : "#dc2626";

              return (
                <Box key={cat.id}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      py: 1.5,
                    }}
                  >
                    <Typography sx={{ fontSize: "0.825rem", color: "#374151" }}>
                      {cat.name}
                    </Typography>
                    <Typography
                      sx={{ fontSize: "0.825rem", fontWeight: 600, color: cs }}
                    >
                      {catScore}%
                    </Typography>
                  </Box>
                  {!isLast && <Divider sx={{ borderColor: "#f3f4f6" }} />}
                </Box>
              );
            })}
          </Box>

          <Divider sx={{ borderColor: "#f3f4f6" }} />

          <Box
            sx={{ p: 3, display: "flex", gap: 1.5, justifyContent: "flex-end" }}
          >
            <Button
              onClick={() => navigate("/flight")}
              disableElevation
              sx={{
                fontSize: "0.8rem",
                fontWeight: 500,
                textTransform: "none",
                borderRadius: "8px",
                border: "1px solid #e8eaed",
                color: "#374151",
                "&:hover": { bgcolor: "#f9fafb", borderColor: "#d1d5db" },
              }}
            >
              Back to Flight
            </Button>
            <Button
              variant="contained"
              disableElevation
              onClick={() => setSubmitted(false)}
              sx={{
                fontSize: "0.8rem",
                fontWeight: 500,
                textTransform: "none",
                borderRadius: "8px",
                bgcolor: "#111827",
                "&:hover": { bgcolor: "#1f2937" },
              }}
            >
              Start New Evaluation
            </Button>
          </Box>
        </Card>
      </Box>
    );
  }

  // ── Main Form ───────────────────────────────────────────────────────────────
  return (
    <Box>
      {/* Back */}
      <Button
        startIcon={<ArrowBackIcon sx={{ fontSize: "15px !important" }} />}
        onClick={() => navigate("/flight")}
        disableElevation
        sx={{
          fontSize: "0.8rem",
          fontWeight: 500,
          color: "#6b7280",
          textTransform: "none",
          mb: 2.5,
          px: 0,
          "&:hover": { bgcolor: "transparent", color: "#374151" },
        }}
      >
        Back to Flight
      </Button>

      {/* Header Card */}
      <Card
        elevation={0}
        sx={{
          border: "1px solid #e8eaed",
          borderRadius: "12px",
          bgcolor: "#ffffff",
          mb: 2,
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "1rem",
                fontWeight: 600,
                color: "#111827",
                letterSpacing: "-0.02em",
                mb: 0.4,
              }}
            >
              Cabin Crew Assessment — {crew.name}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                flexWrap: "wrap",
              }}
            >
              {[flight.flightNumber, flight.route, flight.date, crew.id].map(
                (val, i) => (
                  <Box
                    key={i}
                    sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                  >
                    {i > 0 && (
                      <Box
                        sx={{
                          width: 3,
                          height: 3,
                          borderRadius: "50%",
                          bgcolor: "#e5e7eb",
                        }}
                      />
                    )}
                    <Typography sx={{ fontSize: "0.775rem", color: "#6b7280" }}>
                      {val}
                    </Typography>
                  </Box>
                ),
              )}
            </Box>
          </Box>

          {/* Live Score */}
          {overallScore !== null && (
            <Box
              sx={{
                px: 2,
                py: 1,
                borderRadius: "8px",
                border: "1px solid #e8eaed",
                textAlign: "center",
                minWidth: 80,
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.62rem",
                  fontWeight: 600,
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  mb: 0.25,
                }}
              >
                Score
              </Typography>
              <Typography
                sx={{
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  color: scoreColor,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                }}
              >
                {overallScore}%
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ borderColor: "#f3f4f6" }} />

        {/* Progress */}
        <Box sx={{ px: 3, py: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography
              sx={{ fontSize: "0.775rem", color: "#6b7280", fontWeight: 500 }}
            >
              {completedCriteria} of {totalCriteria} criteria rated
            </Typography>
            <Typography
              sx={{
                fontSize: "0.775rem",
                fontWeight: 600,
                color: progress === 100 ? "#15803d" : "#374151",
              }}
            >
              {Math.round(progress)}%
            </Typography>
          </Box>

          <Box
            sx={{
              height: 5,
              bgcolor: "#f3f4f6",
              borderRadius: "3px",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                height: "100%",
                width: `${progress}%`,
                bgcolor: progress === 100 ? "#22c55e" : "primary.main",
                borderRadius: "3px",
                transition: "width 0.3s ease",
              }}
            />
          </Box>

          {missingRemarks.length > 0 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                mt: 1.25,
                px: 1.5,
                py: 0.75,
                borderRadius: "6px",
                bgcolor: "#fef2f2",
              }}
            >
              <WarningAmberIcon
                sx={{ fontSize: 14, color: "#dc2626", flexShrink: 0 }}
              />
              <Typography
                sx={{ fontSize: "0.75rem", color: "#dc2626", fontWeight: 500 }}
              >
                {missingRemarks.length} rating
                {missingRemarks.length > 1 ? "s" : ""} require remarks before
                submission
              </Typography>
            </Box>
          )}
        </Box>
      </Card>

      {/* Rating Legend */}
      <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap", px: 0.5 }}>
        {RATING_LABELS.map((r) => {
          const s = RATING_STYLES[r.value];
          return (
            <Box
              key={r.value}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                px: 1.25,
                py: 0.45,
                borderRadius: "6px",
                bgcolor: s.light,
              }}
            >
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: "4px",
                  bgcolor: s.selected,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{ fontSize: "0.6rem", fontWeight: 800, color: "#fff" }}
                >
                  {r.label}
                </Typography>
              </Box>
              <Typography
                sx={{ fontSize: "0.72rem", color: s.text, fontWeight: 500 }}
              >
                {r.fullLabel}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Category Accordions */}
      {cabinCrewCategories.map((category) => {
        const catCompleted = category.criteria.filter(
          (c) => form[c.id].rating !== null,
        ).length;
        const isComplete = catCompleted === category.criteria.length;

        return (
          <Accordion
            key={category.id}
            defaultExpanded
            elevation={0}
            sx={{
              border: "1px solid #e8eaed",
              borderRadius: "12px !important",
              mb: 1.5,
              overflow: "hidden",
              "&:before": { display: "none" },
            }}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon sx={{ fontSize: 18, color: "#9ca3af" }} />
              }
              sx={{
                px: 3,
                py: 0,
                minHeight: "52px !important",
                bgcolor: "#fafafa",
                borderBottom: "1px solid #f3f4f6",
                "& .MuiAccordionSummary-content": { my: "14px !important" },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  width: "100%",
                  pr: 1,
                }}
              >
                <Typography
                  sx={{
                    flex: 1,
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#111827",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {category.name}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.6,
                    px: 1.25,
                    py: 0.3,
                    borderRadius: "6px",
                    bgcolor: isComplete ? "#f0fdf4" : "#f3f4f6",
                  }}
                >
                  {isComplete && (
                    <CheckCircleIcon sx={{ fontSize: 11, color: "#22c55e" }} />
                  )}
                  <Typography
                    sx={{
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      color: isComplete ? "#15803d" : "#6b7280",
                    }}
                  >
                    {catCompleted}/{category.criteria.length}
                  </Typography>
                </Box>
              </Box>
            </AccordionSummary>

            <AccordionDetails sx={{ p: 0 }}>
              {category.criteria.map((criterion, idx) => {
                const state = form[criterion.id];
                const needsRemarks =
                  state.rating !== null &&
                  REMARKS_REQUIRED.includes(state.rating) &&
                  state.remarks.trim() === "";
                const isLast = idx === category.criteria.length - 1;
                const ratingStyle = state.rating
                  ? RATING_STYLES[state.rating]
                  : null;

                return (
                  <Box key={criterion.id}>
                    <Box sx={{ px: 3, py: 2.5 }}>
                      {/* Label row */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          gap: 2,
                          mb: 1.5,
                          flexWrap: "wrap",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "0.825rem",
                            fontWeight: 500,
                            color: "#111827",
                            flex: 1,
                            minWidth: 180,
                            lineHeight: 1.5,
                          }}
                        >
                          {criterion.name}
                        </Typography>

                        {/* Weight badge — shown when rated */}
                        {state.rating && ratingStyle && (
                          <Box
                            sx={{
                              px: 1.25,
                              py: 0.3,
                              borderRadius: "6px",
                              bgcolor: ratingStyle.light,
                              flexShrink: 0,
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "0.7rem",
                                fontWeight: 600,
                                color: ratingStyle.text,
                              }}
                            >
                              Weight: {criterion.weights[state.rating]}%
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      {/* Rating Buttons */}
                      <ToggleButtonGroup
                        exclusive
                        value={state.rating}
                        onChange={(_, val) =>
                          handleRatingChange(criterion.id, val)
                        }
                        size="small"
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 0.75,
                          mb: state.rating ? 1.5 : 0,
                          "& .MuiToggleButtonGroup-grouped": {
                            border: "none !important",
                            borderRadius: "8px !important",
                          },
                        }}
                      >
                        {RATING_LABELS.map((r) => {
                          const s = RATING_STYLES[r.value];
                          const isSelected = state.rating === r.value;
                          return (
                            <ToggleButton
                              key={r.value}
                              value={r.value}
                              sx={{
                                px: 2,
                                py: 0.6,
                                fontSize: "0.775rem",
                                fontWeight: 600,
                                textTransform: "none",
                                letterSpacing: "-0.01em",
                                border: `1px solid ${isSelected ? s.selected : "#e8eaed"} !important`,
                                borderRadius: "8px !important",
                                color: isSelected ? "#fff" : "#6b7280",
                                bgcolor: isSelected ? s.selected : "#fff",
                                "&:hover": {
                                  bgcolor: isSelected ? s.selected : s.light,
                                  color: isSelected ? "#fff" : s.text,
                                },
                                "&.Mui-selected": {
                                  bgcolor: s.selected,
                                  color: "#fff",
                                  "&:hover": { bgcolor: s.selected },
                                },
                              }}
                            >
                              <span style={{ marginRight: 5 }}>{r.label}</span>
                              <span
                                style={{
                                  fontSize: "0.68rem",
                                  fontWeight: 400,
                                  opacity: isSelected ? 0.85 : 0.55,
                                }}
                              >
                                {r.fullLabel}
                              </span>
                            </ToggleButton>
                          );
                        })}
                      </ToggleButtonGroup>

                      {/* Remarks — shown when rating is selected */}
                      {state.rating && (
                        <TextField
                          fullWidth
                          size="small"
                          multiline
                          minRows={needsRemarks ? 2 : 1}
                          placeholder={
                            needsRemarks
                              ? "Remarks are required for this rating…"
                              : "Add observations (optional)…"
                          }
                          value={state.remarks}
                          onChange={(e) =>
                            handleRemarksChange(criterion.id, e.target.value)
                          }
                          error={needsRemarks}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "8px",
                              fontSize: "0.8rem",
                              bgcolor: needsRemarks ? "#fff8f8" : "#fafafa",
                              "& fieldset": {
                                borderColor: needsRemarks
                                  ? "#fca5a5"
                                  : "#e8eaed",
                              },
                              "&:hover fieldset": {
                                borderColor: needsRemarks
                                  ? "#f87171"
                                  : "#d1d5db",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: needsRemarks
                                  ? "#ef4444"
                                  : "#4f6ef7",
                                borderWidth: 1.5,
                              },
                            },
                          }}
                        />
                      )}
                    </Box>
                    {!isLast && <Divider sx={{ borderColor: "#f3f4f6" }} />}
                  </Box>
                );
              })}
            </AccordionDetails>
          </Accordion>
        );
      })}

      {/* Final Review */}
      <Card
        elevation={0}
        sx={{
          border: "1px solid #e8eaed",
          borderRadius: "12px",
          bgcolor: "#ffffff",
          mt: 2,
        }}
      >
        <Box sx={{ px: 3, pt: 3, pb: 2 }}>
          <Typography
            sx={{
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "#111827",
              letterSpacing: "-0.01em",
              mb: 0.25,
            }}
          >
            Final Review
          </Typography>
          <Typography sx={{ fontSize: "0.775rem", color: "#9ca3af", mb: 2.5 }}>
            Add any closing observations before submission.
          </Typography>

          <TextField
            fullWidth
            multiline
            minRows={3}
            placeholder="Enter overall remarks or observations…"
            value={overallRemarks}
            onChange={(e) => setOverallRemarks(e.target.value)}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                fontSize: "0.825rem",
                "& fieldset": { borderColor: "#e8eaed" },
                "&:hover fieldset": { borderColor: "#d1d5db" },
                "&.Mui-focused fieldset": {
                  borderColor: "#4f6ef7",
                  borderWidth: 1.5,
                },
              },
            }}
          />

          <TextField
            fullWidth
            placeholder="Evaluator full name (digital signature)…"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                fontSize: "0.825rem",
                "& fieldset": { borderColor: "#e8eaed" },
                "&:hover fieldset": { borderColor: "#d1d5db" },
                "&.Mui-focused fieldset": {
                  borderColor: "#4f6ef7",
                  borderWidth: 1.5,
                },
              },
            }}
          />
        </Box>

        <Divider sx={{ borderColor: "#f3f4f6" }} />

        {/* Validation notice */}
        {(completedCriteria < totalCriteria || missingRemarks.length > 0) && (
          <Box
            sx={{
              mx: 3,
              mt: 2,
              px: 2,
              py: 1.5,
              borderRadius: "8px",
              bgcolor: "#fffbeb",
              border: "1px solid #fde68a",
              display: "flex",
              alignItems: "flex-start",
              gap: 1,
            }}
          >
            <WarningAmberIcon
              sx={{ fontSize: 15, color: "#d97706", mt: 0.1, flexShrink: 0 }}
            />
            <Box>
              {completedCriteria < totalCriteria && (
                <Typography
                  sx={{
                    fontSize: "0.775rem",
                    color: "#92400e",
                    fontWeight: 500,
                  }}
                >
                  {totalCriteria - completedCriteria} criteria not yet rated
                </Typography>
              )}
              {missingRemarks.length > 0 && (
                <Typography
                  sx={{
                    fontSize: "0.775rem",
                    color: "#92400e",
                    fontWeight: 500,
                  }}
                >
                  {missingRemarks.length} item
                  {missingRemarks.length > 1 ? "s" : ""} require remarks before
                  submitting
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {/* Actions */}
        <Box
          sx={{
            px: 3,
            py: 2.5,
            display: "flex",
            gap: 1.5,
            justifyContent: "flex-end",
          }}
        >
          <Button
            disableElevation
            sx={{
              fontSize: "0.8rem",
              fontWeight: 500,
              textTransform: "none",
              borderRadius: "8px",
              border: "1px solid #e8eaed",
              color: "#374151",
              px: 2.5,
              "&:hover": { bgcolor: "#f9fafb", borderColor: "#d1d5db" },
            }}
          >
            Save Draft
          </Button>
          <Button
            variant="contained"
            disableElevation
            disabled={!canSubmit}
            onClick={() => canSubmit && setSubmitted(true)}
            sx={{
              fontSize: "0.8rem",
              fontWeight: 500,
              textTransform: "none",
              borderRadius: "8px",
              px: 2.5,
              bgcolor: "#111827",
              "&:hover": { bgcolor: "#1f2937" },
              "&.Mui-disabled": { bgcolor: "#f3f4f6", color: "#9ca3af" },
            }}
          >
            Submit Evaluation
          </Button>
        </Box>
      </Card>

      <Box sx={{ mb: 4 }} />
    </Box>
  );
}
