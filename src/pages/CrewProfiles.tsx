import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  Grid,
  Typography,
  Divider,
  useTheme,
  alpha,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import BadgeIcon from "@mui/icons-material/Badge";
import { crewMembers } from "../data/mockData";

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

export default function CrewProfiles() {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box sx={{ maxWidth: 1200 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
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
          Crew Profiles
        </Typography>
        <Typography sx={{ fontSize: "0.875rem", color: "#6b7280" }}>
          {crewMembers.length} crew members on record.
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {crewMembers.map((member) => {
          const perf = getPerf(member.previousPerformance);
          const role = roleStyle(member.role);

          return (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={member.id}>
              <Card
                elevation={0}
                onClick={() => navigate(`/crew/${member.id}`)}
                sx={{
                  border: "1px solid #e8eaed",
                  borderRadius: "12px",
                  bgcolor: "#ffffff",
                  cursor: "pointer",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  "&:hover": {
                    borderColor: "#c7d2fe",
                    boxShadow: `0 2px 12px ${alpha(theme.palette.primary.main, 0.08)}`,
                  },
                  transition: "border-color 0.15s, box-shadow 0.15s",
                }}
              >
                {/* Card Body */}
                <Box sx={{ p: 3, flex: 1 }}>
                  {/* Top row: Avatar + role badge + arrow */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    {/* Avatar with initial */}
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: "10px",
                        bgcolor: "#eef1fe",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.1rem",
                        fontWeight: 700,
                        color: "primary.main",
                        letterSpacing: "-0.02em",
                        flexShrink: 0,
                      }}
                    >
                      {member.name.charAt(0)}
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {/* Role badge */}
                      <Box
                        sx={{
                          px: 1.25,
                          py: 0.35,
                          borderRadius: "6px",
                          bgcolor: role.bg,
                          color: role.color,
                          fontSize: "0.7rem",
                          fontWeight: 600,
                        }}
                      >
                        {member.role}
                      </Box>
                      <ArrowForwardIcon
                        sx={{ fontSize: 14, color: "#d1d5db" }}
                      />
                    </Box>
                  </Box>

                  {/* Name */}
                  <Typography
                    sx={{
                      fontSize: "0.925rem",
                      fontWeight: 600,
                      color: "#111827",
                      letterSpacing: "-0.01em",
                      mb: 0.4,
                    }}
                  >
                    {member.name}
                  </Typography>

                  {/* Meta */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      flexWrap: "wrap",
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <BadgeIcon sx={{ fontSize: 12, color: "#9ca3af" }} />
                      <Typography
                        sx={{ fontSize: "0.75rem", color: "#9ca3af" }}
                      >
                        {member.id}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <CalendarTodayIcon
                        sx={{ fontSize: 12, color: "#9ca3af" }}
                      />
                      <Typography
                        sx={{ fontSize: "0.75rem", color: "#9ca3af" }}
                      >
                        {member.joinDate}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ borderColor: "#f3f4f6" }} />

                {/* Footer: performance */}
                <Box
                  sx={{
                    px: 3,
                    py: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.72rem",
                      color: "#9ca3af",
                      fontWeight: 500,
                    }}
                  >
                    Last Performance
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.6,
                      px: 1.25,
                      py: 0.35,
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
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        color: perf.color,
                        textTransform: "capitalize",
                      }}
                    >
                      {member.previousPerformance.replace("-", " ")}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
