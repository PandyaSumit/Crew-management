import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  LinearProgress,
} from "@mui/material";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { projects } from "../data/mockData";

const statusConfig = {
  active: { label: "Active", bg: "#eff6ff", color: "#1d4ed8" },
  completed: { label: "Completed", bg: "#f0fdf4", color: "#15803d" },
  draft: { label: "Draft", bg: "#f9fafb", color: "#6b7280" },
};

export default function Projects() {
  const navigate = useNavigate();

  const activeCount = projects.filter((p) => p.status === "active").length;
  const completedCount = projects.filter((p) => p.status === "completed").length;

  return (
    <Box>
      {/* Header */}
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
          Projects
        </Typography>
        <Typography sx={{ fontSize: "0.875rem", color: "#6b7280" }}>
          {projects.length} projects · {activeCount} active · {completedCount} completed
        </Typography>
      </Box>

      {/* Project Grid */}
      <Grid container spacing={2.5}>
        {projects.map((project) => {
          const statusCfg = statusConfig[project.status];
          const progress =
            project.plansCount > 0
              ? Math.round((project.completedPlans / project.plansCount) * 100)
              : 0;

          return (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={project.id}>
              <Card
                elevation={0}
                onClick={() => navigate(`/projects/${project.id}/plans`)}
                sx={{
                  border: "1px solid #e8eaed",
                  borderRadius: "12px",
                  bgcolor: "#ffffff",
                  cursor: "pointer",
                  transition: "border-color 0.15s, box-shadow 0.15s",
                  height: "100%",
                  "&:hover": {
                    borderColor: "#d1d5db",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    p: "20px !important",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  {/* Icon + Status */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "8px",
                        bgcolor: `${project.color}18`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: project.color,
                        flexShrink: 0,
                      }}
                    >
                      <FolderOpenIcon sx={{ fontSize: 18 }} />
                    </Box>
                    <Chip
                      label={statusCfg.label}
                      size="small"
                      sx={{
                        bgcolor: statusCfg.bg,
                        color: statusCfg.color,
                        fontWeight: 500,
                        fontSize: "0.7rem",
                        height: 22,
                        border: "none",
                        "& .MuiChip-label": { px: 1 },
                      }}
                    />
                  </Box>

                  {/* Name & Description */}
                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "#111827",
                      letterSpacing: "-0.01em",
                      mb: 0.5,
                      lineHeight: 1.4,
                    }}
                  >
                    {project.name}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.78rem",
                      color: "#6b7280",
                      mb: 2.5,
                      lineHeight: 1.5,
                      flexGrow: 1,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {project.description}
                  </Typography>

                  {/* Progress */}
                  <Box sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 0.75,
                      }}
                    >
                      <Typography sx={{ fontSize: "0.72rem", color: "#9ca3af" }}>
                        {project.completedPlans}/{project.plansCount} plans
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.72rem",
                          color: "#9ca3af",
                          fontWeight: 500,
                        }}
                      >
                        {progress}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{
                        height: 4,
                        borderRadius: 2,
                        bgcolor: "#f3f4f6",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 2,
                          bgcolor: project.color,
                        },
                      }}
                    />
                  </Box>

                  {/* Footer */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      pt: 1.5,
                      borderTop: "1px solid #f3f4f6",
                    }}
                  >
                    <Typography sx={{ fontSize: "0.7rem", color: "#9ca3af" }}>
                      Updated{" "}
                      {new Date(project.updatedAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                    </Typography>
                    <ChevronRightIcon sx={{ fontSize: 16, color: "#d1d5db" }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
