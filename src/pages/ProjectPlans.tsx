import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { projects, plans } from "../data/mockData";

const statusConfig = {
  "in-progress": { label: "In Progress", bg: "#eff6ff", color: "#1d4ed8" },
  completed: { label: "Completed", bg: "#f0fdf4", color: "#15803d" },
  draft: { label: "Draft", bg: "#f9fafb", color: "#6b7280" },
};

export default function ProjectPlans() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  const project = projects.find((p) => p.id === projectId);
  const projectPlans = plans.filter((p) => p.projectId === projectId);

  if (!project) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography sx={{ color: "#6b7280" }}>Project not found.</Typography>
      </Box>
    );
  }

  const completedCount = projectPlans.filter((p) => p.status === "completed").length;

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 4 }}
      >
        <IconButton
          size="small"
          onClick={() => navigate("/projects")}
          sx={{
            color: "#6b7280",
            bgcolor: "#f9fafb",
            border: "1px solid #e8eaed",
            borderRadius: "8px",
            p: 0.75,
            mt: 0.25,
            flexShrink: 0,
            "&:hover": { bgcolor: "#f3f4f6" },
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 16 }} />
        </IconButton>
        <Box>
          <Typography
            sx={{
              fontSize: "1.3rem",
              fontWeight: 600,
              color: "#111827",
              letterSpacing: "-0.02em",
              lineHeight: 1.3,
              mb: 0.4,
            }}
          >
            {project.name}
          </Typography>
          <Typography sx={{ fontSize: "0.875rem", color: "#6b7280" }}>
            {projectPlans.length} plans · {completedCount} completed
          </Typography>
        </Box>
      </Box>

      {/* Plans Grid */}
      <Grid container spacing={2.5}>
        {projectPlans.map((plan) => {
          const statusCfg = statusConfig[plan.status];
          const doneTasks = plan.tasks.filter((t) => t.status === "done").length;

          return (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={plan.id}>
              <Card
                elevation={0}
                onClick={() =>
                  navigate(`/projects/${projectId}/plans/${plan.id}`)
                }
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
                  {/* Status Badge */}
                  <Box sx={{ mb: 1.5 }}>
                    <Chip
                      label={statusCfg.label}
                      size="small"
                      sx={{
                        bgcolor: statusCfg.bg,
                        color: statusCfg.color,
                        fontWeight: 500,
                        fontSize: "0.7rem",
                        height: 22,
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
                    {plan.name}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.78rem",
                      color: "#6b7280",
                      mb: 2,
                      lineHeight: 1.5,
                      flexGrow: 1,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {plan.description}
                  </Typography>

                  {/* Footer: task count */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.75,
                      pt: 1.25,
                      borderTop: "1px solid #f3f4f6",
                    }}
                  >
                    <CheckCircleOutlineIcon
                      sx={{ fontSize: 14, color: "#9ca3af" }}
                    />
                    <Typography
                      sx={{
                        fontSize: "0.72rem",
                        color: "#6b7280",
                        flexGrow: 1,
                      }}
                    >
                      {doneTasks}/{plan.tasks.length} tasks done
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
