import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { projects, plans } from "../data/mockData";
import type { PlanTask } from "../types";

const priorityConfig: Record<
  PlanTask["priority"],
  { label: string; bg: string; color: string }
> = {
  high: { label: "High", bg: "#fef2f2", color: "#b91c1c" },
  medium: { label: "Medium", bg: "#fff7ed", color: "#c2410c" },
  low: { label: "Low", bg: "#f0fdf4", color: "#15803d" },
};

const columns: {
  key: PlanTask["status"];
  label: string;
  dotColor: string;
  headerBg: string;
}[] = [
  { key: "todo", label: "To Do", dotColor: "#9ca3af", headerBg: "#f9fafb" },
  {
    key: "in-progress",
    label: "In Progress",
    dotColor: "#2563eb",
    headerBg: "#f9fafb",
  },
  { key: "done", label: "Done", dotColor: "#16a34a", headerBg: "#f9fafb" },
];

export default function PlanCanvas() {
  const navigate = useNavigate();
  const { projectId, planId } = useParams<{
    projectId: string;
    planId: string;
  }>();

  const project = projects.find((p) => p.id === projectId);
  const plan = plans.find((p) => p.id === planId);

  if (!project || !plan) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography sx={{ color: "#6b7280" }}>Plan not found.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", minHeight: 0, flexGrow: 1 }}
    >
      {/* Header */}
      <Box
        sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 4 }}
      >
        <IconButton
          size="small"
          onClick={() => navigate(`/projects/${projectId}/plans`)}
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
            {plan.name}
          </Typography>
          <Typography sx={{ fontSize: "0.875rem", color: "#6b7280" }}>
            {project.name}
          </Typography>
        </Box>
      </Box>

      {/* Kanban Board */}
      <Box
        sx={{
          display: "flex",
          gap: 2.5,
          overflowX: "auto",
          pb: 2,
          alignItems: "flex-start",
        }}
      >
        {columns.map((col) => {
          const colTasks = plan.tasks.filter((t) => t.status === col.key);

          return (
            <Box
              key={col.key}
              sx={{
                flex: "1 1 260px",
                minWidth: 240,
                maxWidth: 360,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Column Header */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 1.5,
                  px: 0.5,
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: col.dotColor,
                    flexShrink: 0,
                  }}
                />
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "#374151",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {col.label}
                </Typography>
                <Box
                  sx={{
                    ml: 0.25,
                    px: 0.875,
                    borderRadius: "10px",
                    bgcolor: "#f3f4f6",
                    fontSize: "0.68rem",
                    color: "#9ca3af",
                    fontWeight: 500,
                    lineHeight: "20px",
                  }}
                >
                  {colTasks.length}
                </Box>
              </Box>

              {/* Column Body */}
              <Box
                sx={{
                  bgcolor: "#f9fafb",
                  borderRadius: "12px",
                  border: "1px solid #f3f4f6",
                  p: 1.5,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                  minHeight: 180,
                }}
              >
                {colTasks.length === 0 ? (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: 60,
                    }}
                  >
                    <Typography sx={{ fontSize: "0.75rem", color: "#d1d5db" }}>
                      No tasks
                    </Typography>
                  </Box>
                ) : (
                  colTasks.map((task) => {
                    const pCfg = priorityConfig[task.priority];
                    return (
                      <Card
                        key={task.id}
                        elevation={0}
                        sx={{
                          border: "1px solid #e8eaed",
                          borderRadius: "8px",
                          bgcolor: "#ffffff",
                        }}
                      >
                        <CardContent sx={{ p: "12px 14px !important" }}>
                          <Typography
                            sx={{
                              fontSize: "0.825rem",
                              fontWeight: 500,
                              color: "#111827",
                              lineHeight: 1.45,
                              mb: 1.25,
                            }}
                          >
                            {task.title}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              flexWrap: "wrap",
                            }}
                          >
                            <Chip
                              label={pCfg.label}
                              size="small"
                              sx={{
                                bgcolor: pCfg.bg,
                                color: pCfg.color,
                                fontWeight: 500,
                                fontSize: "0.65rem",
                                height: 20,
                                "& .MuiChip-label": { px: 0.875 },
                              }}
                            />
                            {task.assignee && (
                              <Typography
                                sx={{ fontSize: "0.7rem", color: "#9ca3af" }}
                              >
                                {task.assignee}
                              </Typography>
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
