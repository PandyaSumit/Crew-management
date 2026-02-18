import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Divider,
} from "@mui/material";
import FlightIcon from "@mui/icons-material/Flight";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import UpdateIcon from "@mui/icons-material/Update";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useTheme } from "@mui/material";
import { performanceData, pastFlights } from "../data/mockData";

const getScoreStyle = (score: number) => {
  if (score >= 90) return { bg: "#f0fdf4", color: "#15803d", dot: "#22c55e" };
  if (score >= 75) return { bg: "#eff6ff", color: "#1d4ed8", dot: "#3b82f6" };
  if (score >= 60) return { bg: "#fff7ed", color: "#c2410c", dot: "#f97316" };
  return { bg: "#fef2f2", color: "#b91c1c", dot: "#ef4444" };
};

export default function Dashboard() {
  const theme = useTheme();

  const statCards = [
    {
      title: "Total Flights Evaluated",
      value: "156",
      delta: "+12 this month",
      positive: true,
      icon: <FlightIcon sx={{ fontSize: 18 }} />,
      accent: theme.palette.primary.main,
      accentBg: theme.palette.primary.light,
    },
    {
      title: "Average Performance",
      value: "84.2%",
      delta: "+2.4% vs last month",
      positive: true,
      icon: <TrendingUpIcon sx={{ fontSize: 18 }} />,
      accent: "#16a34a",
      accentBg: "#f0fdf4",
    },
    {
      title: "Pending Evaluations",
      value: "12",
      delta: "4 overdue",
      positive: false,
      icon: <PendingActionsIcon sx={{ fontSize: 18 }} />,
      accent: "#d97706",
      accentBg: "#fffbeb",
    },
    {
      title: "Recent Activity",
      value: "8 today",
      delta: "Last at 2:40 PM",
      positive: true,
      icon: <UpdateIcon sx={{ fontSize: 18 }} />,
      accent: "#0284c7",
      accentBg: "#f0f9ff",
    },
  ];

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          sx={{
            fontSize: "1.3rem",
            fontWeight: 600,
            color: "#111827",
            letterSpacing: "-0.02em",
            lineHeight: 1.3,
            mb: 0.5,
          }}
        >
          Performance Overview
        </Typography>
        <Typography
          sx={{
            fontSize: "0.875rem",
            color: "#6b7280",
            fontWeight: 400,
          }}
        >
          Welcome back — here's a summary of crew evaluations today.
        </Typography>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {statCards.map((card) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={card.title}>
            <Card
              elevation={0}
              sx={{
                border: "1px solid #e8eaed",
                borderRadius: "12px",
                bgcolor: "#ffffff",
                "&:hover": {
                  borderColor: "#d1d5db",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                },
                transition: "border-color 0.15s, box-shadow 0.15s",
              }}
            >
              <CardContent sx={{ p: "20px !important" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    mb: 2.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "8px",
                      bgcolor: card.accentBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: card.accent,
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>

                <Typography
                  sx={{
                    fontSize: "1.75rem",
                    fontWeight: 700,
                    color: "#111827",
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                    mb: 0.75,
                  }}
                >
                  {card.value}
                </Typography>

                <Typography
                  sx={{
                    fontSize: "0.78rem",
                    color: "#6b7280",
                    fontWeight: 500,
                    mb: 1.5,
                  }}
                >
                  {card.title}
                </Typography>

                <Divider sx={{ borderColor: "#f3f4f6", mb: 1.5 }} />

                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <ArrowUpwardIcon
                    sx={{
                      fontSize: 12,
                      color: card.positive ? "#16a34a" : "#dc2626",
                      transform: card.positive ? "none" : "rotate(180deg)",
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: "0.72rem",
                      color: card.positive ? "#16a34a" : "#dc2626",
                      fontWeight: 500,
                    }}
                  >
                    {card.delta}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={2.5}>
        {/* Radar Chart */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid #e8eaed",
              borderRadius: "12px",
              bgcolor: "#ffffff",
              height: "100%",
            }}
          >
            <CardContent sx={{ p: "24px !important" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  mb: 3,
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "#111827",
                      letterSpacing: "-0.01em",
                      mb: 0.25,
                    }}
                  >
                    Assessment Categories
                  </Typography>
                  <Typography sx={{ fontSize: "0.78rem", color: "#9ca3af" }}>
                    Year-over-year performance comparison
                  </Typography>
                </Box>

                {/* Legend */}
                <Box sx={{ display: "flex", gap: 2, flexShrink: 0 }}>
                  {[
                    { label: "2025", color: "#f97316" },
                    { label: "2026", color: theme.palette.primary.main },
                  ].map((l) => (
                    <Box
                      key={l.label}
                      sx={{ display: "flex", alignItems: "center", gap: 0.75 }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: l.color,
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: "0.75rem",
                          color: "#6b7280",
                          fontWeight: 500,
                        }}
                      >
                        {l.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              <ResponsiveContainer width="100%" height={340}>
                <RadarChart
                  data={performanceData}
                  cx="50%"
                  cy="50%"
                  outerRadius="72%"
                >
                  <PolarGrid stroke="#f3f4f6" strokeWidth={1} />
                  <PolarAngleAxis
                    dataKey="category"
                    tick={{
                      fontSize: 11,
                      fill: "#9ca3af",
                      fontWeight: 500,
                    }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fontSize: 9, fill: "#d1d5db" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e8eaed",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                      fontSize: "0.8rem",
                      padding: "8px 12px",
                    }}
                  />
                  <Radar
                    name="2025"
                    dataKey="year2025"
                    stroke="#f97316"
                    fill="#f97316"
                    fillOpacity={0.1}
                    strokeWidth={1.5}
                  />
                  <Radar
                    name="2026"
                    dataKey="year2026"
                    stroke={theme.palette.primary.main}
                    fill={theme.palette.primary.main}
                    fillOpacity={0.1}
                    strokeWidth={1.5}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Evaluations */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid #e8eaed",
              borderRadius: "12px",
              bgcolor: "#ffffff",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent
              sx={{
                p: "24px !important",
                flex: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Header */}
              <Box sx={{ mb: 2.5 }}>
                <Typography
                  sx={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "#111827",
                    letterSpacing: "-0.01em",
                    mb: 0.25,
                  }}
                >
                  Recent Evaluations
                </Typography>
                <Typography sx={{ fontSize: "0.78rem", color: "#9ca3af" }}>
                  Latest flight performance records
                </Typography>
              </Box>

              <Divider sx={{ borderColor: "#f3f4f6", mb: 1 }} />

              {/* List */}
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                {pastFlights.slice(0, 6).map((flight, idx) => {
                  const style = getScoreStyle(flight.overallScore);
                  return (
                    <Box key={flight.id}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          py: 1.5,
                          px: 1,
                          borderRadius: "8px",
                          cursor: "pointer",
                          "&:hover": { bgcolor: "#f9fafb" },
                          transition: "background-color 0.12s",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            minWidth: 0,
                          }}
                        >
                          {/* Score dot */}
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              bgcolor: style.dot,
                              flexShrink: 0,
                            }}
                          />
                          <Box sx={{ minWidth: 0 }}>
                            <Typography
                              sx={{
                                fontSize: "0.825rem",
                                fontWeight: 500,
                                color: "#111827",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {flight.crewMemberName}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "0.72rem",
                                color: "#9ca3af",
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                                mt: 0.2,
                              }}
                            >
                              <span
                                style={{ fontWeight: 500, color: "#6b7280" }}
                              >
                                {flight.flightNumber}
                              </span>
                              <span style={{ color: "#d1d5db" }}>·</span>
                              <span>{flight.route}</span>
                            </Typography>
                          </Box>
                        </Box>

                        {/* Score Badge */}
                        <Box
                          sx={{
                            px: 1.5,
                            py: 0.4,
                            borderRadius: "6px",
                            bgcolor: style.bg,
                            color: style.color,
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            flexShrink: 0,
                            letterSpacing: "0.01em",
                          }}
                        >
                          {flight.overallScore}%
                        </Box>
                      </Box>

                      {idx < Math.min(pastFlights.length, 6) - 1 && (
                        <Divider sx={{ borderColor: "#f9fafb" }} />
                      )}
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
