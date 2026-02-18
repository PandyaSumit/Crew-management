import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Divider,
} from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { currentFlight } from "../data/mockData";

const statusConfig: Record<
  string,
  { bg: string; color: string; dot: string; label: string }
> = {
  "Not Started": {
    bg: "#f3f4f6",
    color: "#6b7280",
    dot: "#d1d5db",
    label: "Not Started",
  },
  "In Progress": {
    bg: "#fffbeb",
    color: "#d97706",
    dot: "#f59e0b",
    label: "In Progress",
  },
  Completed: {
    bg: "#f0fdf4",
    color: "#15803d",
    dot: "#22c55e",
    label: "Completed",
  },
};

const performanceConfig: Record<string, { bg: string; color: string }> = {
  excellent: { bg: "#f0fdf4", color: "#15803d" },
  good: { bg: "#eff6ff", color: "#1d4ed8" },
  average: { bg: "#fff7ed", color: "#c2410c" },
  poor: { bg: "#fef2f2", color: "#b91c1c" },
};

const getPerformanceStyle = (perf: string) => {
  const key = perf.toLowerCase().replace("-", " ");
  return performanceConfig[key] ?? { bg: "#f3f4f6", color: "#6b7280" };
};

export default function FlightView() {
  const navigate = useNavigate();
  const flight = currentFlight;

  const completed = flight.crew.filter(
    (m) => m.evaluationStatus === "Completed",
  ).length;
  const total = flight.crew.length;
  const progressPct = Math.round((completed / total) * 100);

  return (
    <Box>
      {/* Flight Header Card */}
      <Card
        elevation={0}
        sx={{
          border: "1px solid #e8eaed",
          borderRadius: "12px",
          bgcolor: "#ffffff",
          mb: 3,
        }}
      >
        <CardContent sx={{ p: "24px !important" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            {/* Icon */}
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#eef1fe",
                color: "primary.main",
                flexShrink: 0,
              }}
            >
              <FlightTakeoffIcon sx={{ fontSize: 20 }} />
            </Box>

            {/* Flight Info */}
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  flexWrap: "wrap",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "#111827",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {flight.flightNumber}
                </Typography>
                <Box
                  sx={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    bgcolor: "#d1d5db",
                  }}
                />
                <Typography
                  sx={{ fontSize: "1rem", fontWeight: 600, color: "#111827" }}
                >
                  {flight.route}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mt: 0.5,
                  flexWrap: "wrap",
                }}
              >
                {[
                  { label: "Aircraft", value: flight.aircraft },
                  { label: "Date", value: flight.date },
                ].map((item) => (
                  <Typography
                    key={item.label}
                    sx={{ fontSize: "0.8rem", color: "#9ca3af" }}
                  >
                    <span style={{ color: "#6b7280", fontWeight: 500 }}>
                      {item.label}:
                    </span>{" "}
                    {item.value}
                  </Typography>
                ))}
              </Box>
            </Box>

            {/* Progress */}
            <Box
              sx={{
                textAlign: "right",
                flexShrink: 0,
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.72rem",
                  color: "#9ca3af",
                  fontWeight: 500,
                  mb: 0.5,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Evaluations
              </Typography>
              <Typography
                sx={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "#111827",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                {completed}
                <span style={{ color: "#d1d5db", fontWeight: 400 }}>
                  /{total}
                </span>
              </Typography>
              {/* Progress bar */}
              <Box
                sx={{
                  mt: 1,
                  width: 80,
                  height: 4,
                  bgcolor: "#f3f4f6",
                  borderRadius: "2px",
                  overflow: "hidden",
                  ml: "auto",
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    width: `${progressPct}%`,
                    bgcolor: progressPct === 100 ? "#22c55e" : "primary.main",
                    borderRadius: "2px",
                  }}
                />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Section Label */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: "0.72rem",
            fontWeight: 600,
            color: "#9ca3af",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Assigned Crew · {total} members
        </Typography>
      </Box>

      {/* Crew List */}
      <Card
        elevation={0}
        sx={{
          border: "1px solid #e8eaed",
          borderRadius: "12px",
          bgcolor: "#ffffff",
          overflow: "hidden",
        }}
      >
        {flight.crew.map((member, idx) => {
          const status =
            statusConfig[member.evaluationStatus] ??
            statusConfig["Not Started"];
          const perfStyle = getPerformanceStyle(member.previousPerformance);
          const isCompleted = member.evaluationStatus === "Completed";
          const isLast = idx === flight.crew.length - 1;

          return (
            <Box key={member.id}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  px: 3,
                  py: 2.5,
                  flexWrap: "wrap",
                  "&:hover": { bgcolor: "#fafafa" },
                  transition: "background-color 0.12s",
                }}
              >
                {/* Avatar */}
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: "#eef1fe",
                    color: "primary.main",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {member.name.charAt(0)}
                </Avatar>

                {/* Name + Meta */}
                <Box sx={{ flex: 1, minWidth: 160 }}>
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: "#111827",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {member.name}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      color: "#9ca3af",
                      mt: 0.2,
                    }}
                  >
                    <span style={{ color: "#6b7280" }}>{member.id}</span>
                    <span style={{ margin: "0 6px", color: "#e5e7eb" }}>·</span>
                    {member.role}
                  </Typography>
                </Box>

                {/* Badges */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    flexWrap: "wrap",
                  }}
                >
                  {/* Performance badge */}
                  <Box
                    sx={{
                      px: 1.5,
                      py: 0.4,
                      borderRadius: "6px",
                      bgcolor: perfStyle.bg,
                      color: perfStyle.color,
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      textTransform: "capitalize",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {member.previousPerformance.replace("-", " ")}
                  </Box>

                  {/* Status badge */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.6,
                      px: 1.5,
                      py: 0.4,
                      borderRadius: "6px",
                      bgcolor: status.bg,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Box
                      sx={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        bgcolor: status.dot,
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        color: status.color,
                      }}
                    >
                      {status.label}
                    </Typography>
                  </Box>
                </Box>

                {/* Action Button */}
                <Button
                  variant={isCompleted ? "outlined" : "contained"}
                  size="small"
                  endIcon={
                    <ArrowForwardIcon sx={{ fontSize: "13px !important" }} />
                  }
                  onClick={() => {
                    const evaluationType =
                      member.role === "Purser" ? "purser" : "cabin-crew";
                    navigate(
                      `/evaluate/${evaluationType}/${flight.id}/${member.id}`,
                    );
                  }}
                  disableElevation
                  sx={{
                    minWidth: 140,
                    fontSize: "0.775rem",
                    fontWeight: 500,
                    borderRadius: "8px",
                    textTransform: "none",
                    flexShrink: 0,
                    ...(isCompleted
                      ? {
                          borderColor: "#e8eaed",
                          color: "#374151",
                          "&:hover": {
                            borderColor: "#d1d5db",
                            bgcolor: "#f9fafb",
                          },
                        }
                      : {
                          bgcolor: "#111827",
                          color: "#ffffff",
                          "&:hover": { bgcolor: "#1f2937" },
                        }),
                  }}
                >
                  {member.evaluationStatus === "Not Started"
                    ? "Start Evaluation"
                    : member.evaluationStatus === "In Progress"
                      ? "Continue"
                      : "View Report"}
                </Button>
              </Box>

              {!isLast && <Divider sx={{ borderColor: "#f3f4f6" }} />}
            </Box>
          );
        })}
      </Card>
    </Box>
  );
}
