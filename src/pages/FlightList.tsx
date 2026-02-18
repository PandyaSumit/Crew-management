import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Card, Typography, Select, MenuItem } from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { flights } from "../data/mockData";
import type { Flight } from "../types";

export default function FlightList() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  const getFlightStatus = (flight: Flight) => {
    const today = new Date().toISOString().split("T")[0];

    if (flight.date > today) {
      return { label: "Scheduled", color: "#0369a1", bg: "#f0f9ff" };
    }

    if (flight.date === today && flight.id === "FL001") {
      return { label: "In Progress", color: "#d97706", bg: "#fffbeb" };
    }

    const allEvaluated = flight.crew.every(
      (c) => c.evaluationStatus === "Completed",
    );
    if (allEvaluated) {
      return { label: "Completed", color: "#15803d", bg: "#f0fdf4" };
    }

    return { label: "Pending Evaluations", color: "#d97706", bg: "#fffbeb" };
  };

  const filteredFlights = flights.filter((f) => {
    if (filter === "all") return true;
    const today = new Date().toISOString().split("T")[0];
    if (filter === "today") return f.date === today;
    if (filter === "week") {
      const d = new Date(f.date);
      const now = new Date();
      const diff = Math.abs(now.getTime() - d.getTime());
      return diff / (1000 * 60 * 60 * 24) < 7;
    }
    return true;
  });

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 3,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: "1.3rem",
              fontWeight: 600,
              color: "#111827",
              letterSpacing: "-0.02em",
              mb: 0.4,
            }}
          >
            Flights
          </Typography>
          <Typography sx={{ fontSize: "0.825rem", color: "#6b7280" }}>
            Manage and evaluate crew performance across all flights
          </Typography>
        </Box>

        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          size="small"
          sx={{
            minWidth: 140,
            fontSize: "0.825rem",
            borderRadius: "8px",
            bgcolor: "#ffffff",
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e8eaed" },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#d1d5db",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#4f6ef7",
              borderWidth: 1.5,
            },
          }}
        >
          <MenuItem value="all" sx={{ fontSize: "0.825rem" }}>
            All Flights
          </MenuItem>
          <MenuItem value="today" sx={{ fontSize: "0.825rem" }}>
            Today
          </MenuItem>
          <MenuItem value="week" sx={{ fontSize: "0.825rem" }}>
            This Week
          </MenuItem>
        </Select>
      </Box>

      {/* Flights List */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {filteredFlights.map((flight) => {
          const status = getFlightStatus(flight);
          const crewCount = flight.crew.length;
          const evaluatedCount = flight.crew.filter(
            (c) => c.evaluationStatus === "Completed",
          ).length;
          const progress =
            crewCount > 0 ? (evaluatedCount / crewCount) * 100 : 0;

          return (
            <Card
              key={flight.id}
              elevation={0}
              sx={{
                border: "1px solid #e8eaed",
                borderRadius: "12px",
                bgcolor: "#ffffff",
                cursor: "pointer",
                transition: "all 0.15s",
                "&:hover": {
                  borderColor: "#c7d2fe",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                },
              }}
              onClick={() => navigate(`/flights/${flight.id}`)}
            >
              <Box sx={{ p: 2.5 }}>
                {/* Main Row */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2.5,
                    flexWrap: "wrap",
                  }}
                >
                  {/* Icon + Flight Number */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      minWidth: 180,
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "8px",
                        bgcolor: status.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <FlightTakeoffIcon
                        sx={{ fontSize: 20, color: status.color }}
                      />
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          color: "#111827",
                          letterSpacing: "-0.01em",
                          lineHeight: 1.3,
                        }}
                      >
                        {flight.flightNumber}
                      </Typography>
                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 0.5,
                          mt: 0.25,
                          px: 0.75,
                          py: 0.2,
                          borderRadius: "4px",
                          bgcolor: status.bg,
                        }}
                      >
                        <Box
                          sx={{
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            bgcolor: status.color,
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: "0.68rem",
                            fontWeight: 500,
                            color: status.color,
                          }}
                        >
                          {status.label}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Route & Aircraft */}
                  <Box sx={{ minWidth: 200, flex: 1 }}>
                    <Typography
                      sx={{ fontSize: "0.72rem", color: "#9ca3af", mb: 0.3 }}
                    >
                      Route & Aircraft
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.825rem",
                        fontWeight: 500,
                        color: "#111827",
                        mb: 0.2,
                      }}
                    >
                      {flight.route}
                    </Typography>
                    <Typography sx={{ fontSize: "0.75rem", color: "#6b7280" }}>
                      {flight.aircraft}
                    </Typography>
                  </Box>

                  {/* Date */}
                  <Box sx={{ minWidth: 120 }}>
                    <Typography
                      sx={{ fontSize: "0.72rem", color: "#9ca3af", mb: 0.3 }}
                    >
                      Date
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.825rem",
                        fontWeight: 500,
                        color: "#111827",
                      }}
                    >
                      {flight.date}
                    </Typography>
                  </Box>

                  {/* Progress */}
                  <Box sx={{ minWidth: 220, flex: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 0.75,
                      }}
                    >
                      <Typography
                        sx={{ fontSize: "0.72rem", color: "#9ca3af" }}
                      >
                        Crew Evaluation
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          color: "#374151",
                        }}
                      >
                        {evaluatedCount}/{crewCount}
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
                          bgcolor: progress === 100 ? "#22c55e" : "#4f6ef7",
                          borderRadius: "3px",
                          transition: "width 0.3s ease",
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Action */}
                  <Box sx={{ ml: "auto" }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        color: "#4f6ef7",
                        fontSize: "0.8rem",
                        fontWeight: 500,
                      }}
                    >
                      <span>View</span>
                      <ArrowForwardIcon sx={{ fontSize: 14 }} />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Card>
          );
        })}
      </Box>

      {/* Empty State */}
      {filteredFlights.length === 0 && (
        <Card
          elevation={0}
          sx={{
            border: "1px solid #e8eaed",
            borderRadius: "12px",
            bgcolor: "#ffffff",
            p: 6,
            textAlign: "center",
          }}
        >
          <FlightTakeoffIcon sx={{ fontSize: 48, color: "#d1d5db", mb: 2 }} />
          <Typography
            sx={{
              fontSize: "0.9rem",
              fontWeight: 500,
              color: "#6b7280",
              mb: 0.5,
            }}
          >
            No flights found
          </Typography>
          <Typography sx={{ fontSize: "0.775rem", color: "#9ca3af" }}>
            Try adjusting your filter or check back later
          </Typography>
        </Card>
      )}
    </Box>
  );
}
