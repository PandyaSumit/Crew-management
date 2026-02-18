import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  Grid,
  Typography,
  Divider,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { crewMembers, pastFlights } from "../data/mockData";

const categoryPerformance = [
  { category: "Professional Image", score: 85 },
  { category: "SOP Adherence", score: 88 },
  { category: "Passenger Service", score: 82 },
  { category: "Teamwork & CRM", score: 91 },
  { category: "Situational Competence", score: 79 },
];

const getScoreStyle = (score: number) => {
  if (score >= 90) return { bg: "#f0fdf4", color: "#15803d", dot: "#22c55e" };
  if (score >= 75) return { bg: "#eff6ff", color: "#1d4ed8", dot: "#3b82f6" };
  if (score >= 60) return { bg: "#fff7ed", color: "#c2410c", dot: "#f97316" };
  return { bg: "#fef2f2", color: "#b91c1c", dot: "#ef4444" };
};

const performanceStyle: Record<
  string,
  { bg: string; color: string; dot: string }
> = {
  excellent: { bg: "#f0fdf4", color: "#15803d", dot: "#22c55e" },
  good: { bg: "#eff6ff", color: "#1d4ed8", dot: "#3b82f6" },
  average: { bg: "#fff7ed", color: "#c2410c", dot: "#f97316" },
  poor: { bg: "#fef2f2", color: "#b91c1c", dot: "#ef4444" },
};

const getPerf = (perf: string) => {
  const key = perf.toLowerCase().replace("-", " ").trim();
  return (
    performanceStyle[key] ?? { bg: "#f3f4f6", color: "#6b7280", dot: "#d1d5db" }
  );
};

const roleStyle = (role: string) =>
  role === "Purser"
    ? { bg: "#f5f3ff", color: "#6d28d9" }
    : { bg: "#f0f9ff", color: "#0369a1" };

export default function CrewProfile() {
  const { crewId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const member = crewMembers.find((c) => c.id === crewId);
  const memberFlights = pastFlights.filter((f) => f.crewMemberId === crewId);

  const trendData = memberFlights
    .slice()
    .reverse()
    .map((f) => ({ date: f.date.slice(5), score: f.overallScore }));

  if (!member) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography sx={{ fontSize: "0.875rem", color: "#6b7280" }}>
          Crew member not found.
        </Typography>
        <Button
          onClick={() => navigate("/crew")}
          sx={{ mt: 2, textTransform: "none", fontSize: "0.825rem" }}
        >
          Back to Profiles
        </Button>
      </Box>
    );
  }

  const avgScore =
    memberFlights.length > 0
      ? Math.round(
          memberFlights.reduce((acc, f) => acc + f.overallScore, 0) /
            memberFlights.length,
        )
      : 0;

  const strengths = categoryPerformance
    .filter((c) => c.score >= 85)
    .map((c) => c.category);
  const developmentAreas = categoryPerformance
    .filter((c) => c.score < 80)
    .map((c) => c.category);
  const perf = getPerf(member.previousPerformance);
  const role = roleStyle(member.role);
  const avgStyle = getScoreStyle(avgScore);

  return (
    <Box>
      {/* Back */}
      <Button
        startIcon={<ArrowBackIcon sx={{ fontSize: "15px !important" }} />}
        onClick={() => navigate("/crew")}
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
        Back to Profiles
      </Button>

      {/* Profile Header Card */}
      <Card
        elevation={0}
        sx={{
          border: "1px solid #e8eaed",
          borderRadius: "12px",
          bgcolor: "#ffffff",
          mb: 2.5,
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 2.5,
              flexWrap: "wrap",
            }}
          >
            {/* Avatar */}
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "12px",
                bgcolor: "#eef1fe",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.4rem",
                fontWeight: 700,
                color: "primary.main",
                flexShrink: 0,
              }}
            >
              {member.name.charAt(0)}
            </Box>

            {/* Info */}
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  flexWrap: "wrap",
                  mb: 0.5,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    color: "#111827",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {member.name}
                </Typography>

                {/* Role */}
                <Box
                  sx={{
                    px: 1.25,
                    py: 0.3,
                    borderRadius: "6px",
                    bgcolor: role.bg,
                    color: role.color,
                    fontSize: "0.7rem",
                    fontWeight: 600,
                  }}
                >
                  {member.role}
                </Box>

                {/* Performance */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.6,
                    px: 1.25,
                    py: 0.3,
                    borderRadius: "6px",
                    bgcolor: perf.bg,
                  }}
                >
                  <Box
                    sx={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      bgcolor: perf.dot,
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      color: perf.color,
                      textTransform: "capitalize",
                    }}
                  >
                    {member.previousPerformance.replace("-", " ")}
                  </Typography>
                </Box>
              </Box>

              {/* Meta row */}
              <Box sx={{ display: "flex", gap: 2.5, flexWrap: "wrap" }}>
                {[
                  {
                    icon: <BadgeIcon sx={{ fontSize: 13 }} />,
                    text: member.id,
                  },
                  {
                    icon: <CalendarTodayIcon sx={{ fontSize: 13 }} />,
                    text: `Joined ${member.joinDate}`,
                  },
                  {
                    icon: <EmailIcon sx={{ fontSize: 13 }} />,
                    text: member.contact,
                  },
                ].map((item, i) => (
                  <Box
                    key={i}
                    sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                  >
                    <Box sx={{ color: "#9ca3af" }}>{item.icon}</Box>
                    <Typography sx={{ fontSize: "0.775rem", color: "#6b7280" }}>
                      {item.text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Avg Score */}
            <Box
              sx={{
                flexShrink: 0,
                px: 2.5,
                py: 1.5,
                border: "1px solid #e8eaed",
                borderRadius: "10px",
                textAlign: "center",
                minWidth: 100,
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.68rem",
                  color: "#9ca3af",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  mb: 0.5,
                }}
              >
                Avg Score
              </Typography>
              <Typography
                sx={{
                  fontSize: "1.75rem",
                  fontWeight: 700,
                  color: avgStyle.color,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                }}
              >
                {avgScore}%
              </Typography>
              <Typography
                sx={{ fontSize: "0.7rem", color: "#9ca3af", mt: 0.5 }}
              >
                {memberFlights.length} flight
                {memberFlights.length !== 1 ? "s" : ""}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Card>

      {/* Charts */}
      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        {/* Radar */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid #e8eaed",
              borderRadius: "12px",
              bgcolor: "#ffffff",
              height: "100%",
            }}
          >
            <Box sx={{ p: 3, pb: 0 }}>
              <Typography
                sx={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#111827",
                  letterSpacing: "-0.01em",
                  mb: 0.25,
                }}
              >
                Category Performance
              </Typography>
              <Typography sx={{ fontSize: "0.775rem", color: "#9ca3af" }}>
                Scores by evaluation category
              </Typography>
            </Box>
            <Box sx={{ p: 1 }}>
              <ResponsiveContainer width="100%" height={270}>
                <RadarChart
                  data={categoryPerformance}
                  cx="50%"
                  cy="50%"
                  outerRadius="70%"
                >
                  <PolarGrid stroke="#f3f4f6" strokeWidth={1} />
                  <PolarAngleAxis
                    dataKey="category"
                    tick={{ fontSize: 10, fill: "#9ca3af", fontWeight: 500 }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fontSize: 9, fill: "#d1d5db" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Radar
                    dataKey="score"
                    stroke={theme.palette.primary.main}
                    fill={theme.palette.primary.main}
                    fillOpacity={0.1}
                    strokeWidth={1.5}
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
                </RadarChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        {/* Line Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid #e8eaed",
              borderRadius: "12px",
              bgcolor: "#ffffff",
              height: "100%",
            }}
          >
            <Box sx={{ p: 3, pb: 0 }}>
              <Typography
                sx={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#111827",
                  letterSpacing: "-0.01em",
                  mb: 0.25,
                }}
              >
                Performance Trend
              </Typography>
              <Typography sx={{ fontSize: "0.775rem", color: "#9ca3af" }}>
                Score history over recent flights
              </Typography>
            </Box>
            <Box sx={{ p: 2, pt: 1.5 }}>
              {trendData.length > 0 ? (
                <ResponsiveContainer width="100%" height={270}>
                  <LineChart
                    data={trendData}
                    margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="0"
                      stroke="#f3f4f6"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10, fill: "#9ca3af" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[50, 100]}
                      tick={{ fontSize: 10, fill: "#9ca3af" }}
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
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke={theme.palette.primary.main}
                      strokeWidth={2}
                      dot={{
                        fill: theme.palette.primary.main,
                        r: 3,
                        strokeWidth: 0,
                      }}
                      activeDot={{
                        r: 5,
                        fill: theme.palette.primary.main,
                        strokeWidth: 0,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Box
                  sx={{
                    height: 270,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography sx={{ fontSize: "0.825rem", color: "#9ca3af" }}>
                    No evaluation data available
                  </Typography>
                </Box>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Strengths & Development */}
      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid #e8eaed",
              borderRadius: "12px",
              bgcolor: "#ffffff",
              height: "100%",
            }}
          >
            <Box sx={{ p: 3, pb: 2 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <CheckCircleOutlineIcon
                  sx={{ fontSize: 17, color: "#16a34a" }}
                />
                <Typography
                  sx={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "#111827",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Strengths
                </Typography>
              </Box>
              {strengths.length > 0 ? (
                strengths.map((s, i) => (
                  <Box key={s}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.25,
                        py: 1.25,
                      }}
                    >
                      <Box
                        sx={{
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          bgcolor: "#22c55e",
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: "0.825rem",
                          color: "#374151",
                          fontWeight: 400,
                        }}
                      >
                        {s}
                      </Typography>
                    </Box>
                    {i < strengths.length - 1 && (
                      <Divider sx={{ borderColor: "#f3f4f6" }} />
                    )}
                  </Box>
                ))
              ) : (
                <Typography sx={{ fontSize: "0.825rem", color: "#9ca3af" }}>
                  No identified strengths yet
                </Typography>
              )}
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid #e8eaed",
              borderRadius: "12px",
              bgcolor: "#ffffff",
              height: "100%",
            }}
          >
            <Box sx={{ p: 3, pb: 2 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <FlagOutlinedIcon sx={{ fontSize: 17, color: "#d97706" }} />
                <Typography
                  sx={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "#111827",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Development Areas
                </Typography>
              </Box>
              {developmentAreas.length > 0 ? (
                developmentAreas.map((d, i) => (
                  <Box key={d}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.25,
                        py: 1.25,
                      }}
                    >
                      <Box
                        sx={{
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          bgcolor: "#f97316",
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        sx={{ fontSize: "0.825rem", color: "#374151" }}
                      >
                        {d}
                      </Typography>
                    </Box>
                    {i < developmentAreas.length - 1 && (
                      <Divider sx={{ borderColor: "#f3f4f6" }} />
                    )}
                  </Box>
                ))
              ) : (
                <Typography sx={{ fontSize: "0.825rem", color: "#9ca3af" }}>
                  No development areas identified
                </Typography>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Evaluations */}
      <Card
        elevation={0}
        sx={{
          border: "1px solid #e8eaed",
          borderRadius: "12px",
          bgcolor: "#ffffff",
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
            Recent Evaluations
          </Typography>
          <Typography sx={{ fontSize: "0.775rem", color: "#9ca3af" }}>
            All recorded flights for this crew member
          </Typography>
        </Box>

        <Divider sx={{ borderColor: "#f3f4f6" }} />

        {memberFlights.length === 0 ? (
          <Box sx={{ px: 3, py: 4, textAlign: "center" }}>
            <Typography sx={{ fontSize: "0.825rem", color: "#9ca3af" }}>
              No evaluations found for this crew member.
            </Typography>
          </Box>
        ) : (
          memberFlights.map((flight, idx) => {
            const s = getScoreStyle(flight.overallScore);
            const isLast = idx === memberFlights.length - 1;
            return (
              <Box key={flight.id}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: 3,
                    py: 1.75,
                    "&:hover": { bgcolor: "#fafafa" },
                    transition: "background-color 0.1s",
                    cursor: "pointer",
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "0.825rem",
                        fontWeight: 500,
                        color: "#111827",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {flight.flightNumber}
                      <span style={{ color: "#d1d5db", margin: "0 8px" }}>
                        ·
                      </span>
                      {flight.route}
                    </Typography>
                    <Typography
                      sx={{ fontSize: "0.75rem", color: "#9ca3af", mt: 0.2 }}
                    >
                      {flight.date}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.6,
                      px: 1.5,
                      py: 0.4,
                      borderRadius: "6px",
                      bgcolor: s.bg,
                    }}
                  >
                    <Box
                      sx={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        bgcolor: s.dot,
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: s.color,
                      }}
                    >
                      {flight.overallScore}%
                    </Typography>
                  </Box>
                </Box>
                {!isLast && <Divider sx={{ borderColor: "#f3f4f6" }} />}
              </Box>
            );
          })
        )}
      </Card>
    </Box>
  );
}
