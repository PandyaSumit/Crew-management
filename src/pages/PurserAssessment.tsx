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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import BoltIcon from "@mui/icons-material/Bolt";
import { purserSections, crewMembers, flights } from "../data/mockData";
import { purserRatingColors } from "../theme";
import type { PurserRating } from "../types";

const RATING_LABELS: { value: PurserRating; label: string; full: string }[] = [
  { value: "N", label: "N", full: "Needs Improvement" },
  { value: "R", label: "R", full: "Meets Requirements" },
  { value: "A", label: "A", full: "Above Standard" },
];

const RATING_STYLES: Record<
  PurserRating,
  { selected: string; text: string; light: string }
> = {
  N: { selected: "#ef4444", text: "#ef4444", light: "#fef2f2" },
  R: { selected: "#f59e0b", text: "#d97706", light: "#fffbeb" },
  A: { selected: "#22c55e", text: "#16a34a", light: "#f0fdf4" },
};

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
        initial[item.id] = { rating: null, remarks: "" };
      });
    });
    return initial;
  });

  const [overallRemarks, setOverallRemarks] = useState("");
  const [signature, setSignature] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const totalItems = useMemo(
    () => purserSections.reduce((acc, sec) => acc + sec.items.length, 0),
    [],
  );

  const completedItems = useMemo(
    () => Object.values(form).filter((v) => v.rating !== null).length,
    [form],
  );

  const safetyCriticalItems = useMemo(
    () =>
      purserSections.flatMap((sec) =>
        sec.items.filter((item) => item.isSafetyCritical),
      ),
    [],
  );

  const unratedSafetyCritical = useMemo(
    () => safetyCriticalItems.filter((item) => form[item.id].rating === null),
    [safetyCriticalItems, form],
  );

  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  const overallScore = useMemo(() => {
    const rated = Object.values(form).filter((v) => v.rating !== null);
    if (rated.length === 0) return null;
    const scoreMap: Record<PurserRating, number> = { N: 33, R: 66, A: 100 };
    const total = rated.reduce(
      (acc, v) => acc + (v.rating ? scoreMap[v.rating] : 0),
      0,
    );
    return Math.round(total / rated.length);
  }, [form]);

  const handleRatingChange = (itemId: string, rating: PurserRating | null) => {
    setForm((prev) => ({ ...prev, [itemId]: { ...prev[itemId], rating } }));
  };

  const handleRemarksChange = (itemId: string, remarks: string) => {
    setForm((prev) => ({ ...prev, [itemId]: { ...prev[itemId], remarks } }));
  };

  const canSubmit =
    completedItems === totalItems &&
    unratedSafetyCritical.length === 0 &&
    signature.trim() !== "";

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitted(true);
  };

  const scoreColor =
    overallScore !== null
      ? overallScore >= 80
        ? "#15803d"
        : overallScore >= 60
          ? "#d97706"
          : "#dc2626"
      : "#111827";

  // ── Not Found ──────────────────────────────────────────────────────────────
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

  // ── Submitted State ────────────────────────────────────────────────────────
  if (submitted) {
    const scoreMap: Record<PurserRating, number> = { N: 33, R: 66, A: 100 };

    return (
      <Box sx={{ maxWidth: 640, mx: "auto", mt: 4 }}>
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
                width: 52,
                height: 52,
                borderRadius: "50%",
                bgcolor: "#f0fdf4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 28, color: "#22c55e" }} />
            </Box>

            <Typography
              sx={{
                fontSize: "1.1rem",
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
              {crew.name} &nbsp;·&nbsp; {flight.flightNumber} &nbsp;·&nbsp;{" "}
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
                  fontSize: "0.65rem",
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

          {/* Section Breakdown */}
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
              Section Breakdown
            </Typography>

            {purserSections.map((sec, idx) => {
              const secItems = sec.items.map((item) => form[item.id]);
              const rated = secItems.filter((v) => v.rating !== null);
              const secScore =
                rated.length > 0
                  ? Math.round(
                      rated.reduce(
                        (acc, v) => acc + (v.rating ? scoreMap[v.rating] : 0),
                        0,
                      ) / rated.length,
                    )
                  : 0;

              const isLast = idx === purserSections.length - 1;

              return (
                <Box key={sec.id}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      py: 1.5,
                    }}
                  >
                    <Typography sx={{ fontSize: "0.825rem", color: "#374151" }}>
                      {sec.name}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.825rem",
                        fontWeight: 600,
                        color:
                          secScore >= 75
                            ? "#15803d"
                            : secScore >= 55
                              ? "#d97706"
                              : "#dc2626",
                      }}
                    >
                      {secScore}%
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
              variant="outlined"
              onClick={() => navigate("/flight")}
              disableElevation
              sx={{
                fontSize: "0.8rem",
                fontWeight: 500,
                textTransform: "none",
                borderRadius: "8px",
                borderColor: "#e8eaed",
                color: "#374151",
                "&:hover": { borderColor: "#d1d5db", bgcolor: "#f9fafb" },
              }}
            >
              Back to Flight
            </Button>
            <Button
              variant="contained"
              onClick={() => setSubmitted(false)}
              disableElevation
              sx={{
                fontSize: "0.8rem",
                fontWeight: 500,
                textTransform: "none",
                borderRadius: "8px",
                bgcolor: "#111827",
                "&:hover": { bgcolor: "#1f2937" },
              }}
            >
              Re-Evaluate
            </Button>
          </Box>
        </Card>
      </Box>
    );
  }

  // ── Main Form ──────────────────────────────────────────────────────────────
  return (
    <Box sx={{ maxWidth: 820 }}>
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
              Purser Assessment — {crew.name}
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

        {/* Progress Bar */}
        <Box sx={{ px: 3, py: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography
              sx={{ fontSize: "0.775rem", color: "#6b7280", fontWeight: 500 }}
            >
              {completedItems} of {totalItems} items rated
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

          {/* Track */}
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

          {unratedSafetyCritical.length > 0 && (
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
                {unratedSafetyCritical.length} safety-critical item
                {unratedSafetyCritical.length > 1 ? "s" : ""} not yet assessed
              </Typography>
            </Box>
          )}
        </Box>
      </Card>

      {/* Rating Legend */}
      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          mb: 2,
          flexWrap: "wrap",
          alignItems: "center",
          px: 0.5,
        }}
      >
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
                py: 0.5,
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
                  {r.value}
                </Typography>
              </Box>
              <Typography
                sx={{ fontSize: "0.72rem", color: s.text, fontWeight: 500 }}
              >
                {r.full}
              </Typography>
            </Box>
          );
        })}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            px: 1.25,
            py: 0.5,
            borderRadius: "6px",
            bgcolor: "#fffbeb",
          }}
        >
          <BoltIcon sx={{ fontSize: 13, color: "#d97706" }} />
          <Typography
            sx={{ fontSize: "0.72rem", color: "#d97706", fontWeight: 500 }}
          >
            Safety-Critical
          </Typography>
        </Box>
      </Box>

      {/* Sections */}
      {purserSections.map((section) => {
        const secCompleted = section.items.filter(
          (item) => form[item.id].rating !== null,
        ).length;
        const isComplete = secCompleted === section.items.length;

        return (
          <Accordion
            key={section.id}
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
                  {section.name}
                </Typography>

                {/* Section progress pill */}
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
                    {secCompleted}/{section.items.length}
                  </Typography>
                </Box>
              </Box>
            </AccordionSummary>

            <AccordionDetails sx={{ p: 0 }}>
              {section.items.map((item, idx) => {
                const state = form[item.id];
                const isLast = idx === section.items.length - 1;

                return (
                  <Box key={item.id}>
                    <Box sx={{ px: 3, py: 2.5 }}>
                      {/* Item label */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 1,
                          mb: 1.5,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "0.825rem",
                            fontWeight: 500,
                            color: "#111827",
                            flex: 1,
                            lineHeight: 1.5,
                          }}
                        >
                          {item.name}
                        </Typography>
                        {item.isSafetyCritical && (
                          <Tooltip title="Safety-Critical Item" placement="top">
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.4,
                                px: 1,
                                py: 0.25,
                                borderRadius: "5px",
                                bgcolor: "#fffbeb",
                                flexShrink: 0,
                              }}
                            >
                              <BoltIcon
                                sx={{ fontSize: 11, color: "#d97706" }}
                              />
                              <Typography
                                sx={{
                                  fontSize: "0.65rem",
                                  fontWeight: 600,
                                  color: "#d97706",
                                }}
                              >
                                Critical
                              </Typography>
                            </Box>
                          </Tooltip>
                        )}
                      </Box>

                      {/* Rating Buttons */}
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          mb: 1.5,
                          flexWrap: "wrap",
                        }}
                      >
                        <ToggleButtonGroup
                          exclusive
                          value={state.rating}
                          onChange={(_, val) =>
                            handleRatingChange(item.id, val)
                          }
                          size="small"
                          sx={{
                            gap: 0.75,
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
                                  px: 2.5,
                                  py: 0.75,
                                  fontSize: "0.775rem",
                                  fontWeight: 600,
                                  textTransform: "none",
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
                                {r.label} &nbsp;
                                <span
                                  style={{
                                    fontSize: "0.7rem",
                                    fontWeight: 400,
                                    opacity: isSelected ? 0.85 : 0.6,
                                  }}
                                >
                                  {r.full}
                                </span>
                              </ToggleButton>
                            );
                          })}
                        </ToggleButtonGroup>
                      </Box>

                      {/* Remarks */}
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Add remarks (optional)…"
                        value={state.remarks}
                        onChange={(e) =>
                          handleRemarksChange(item.id, e.target.value)
                        }
                        inputProps={{ maxLength: 500 }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                            fontSize: "0.8rem",
                            bgcolor: "#fafafa",
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
            placeholder="Evaluator full name (signature)…"
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
        {(completedItems < totalItems || unratedSafetyCritical.length > 0) && (
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
              {completedItems < totalItems && (
                <Typography
                  sx={{
                    fontSize: "0.775rem",
                    color: "#92400e",
                    fontWeight: 500,
                  }}
                >
                  {totalItems - completedItems} item
                  {totalItems - completedItems > 1 ? "s" : ""} not yet rated
                </Typography>
              )}
              {unratedSafetyCritical.length > 0 && (
                <Typography
                  sx={{
                    fontSize: "0.775rem",
                    color: "#92400e",
                    fontWeight: 500,
                  }}
                >
                  {unratedSafetyCritical.length} safety-critical item
                  {unratedSafetyCritical.length > 1 ? "s" : ""} must be assessed
                  before submitting
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
            onClick={handleSubmit}
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
