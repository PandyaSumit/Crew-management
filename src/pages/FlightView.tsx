import { useNavigate, useParams } from "react-router-dom";

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  MenuItem,
  FormControl,
  Select,
  useTheme,
  alpha,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import AssessmentIcon from "@mui/icons-material/Assessment";
import { flights } from "../data/mockData";

const statusConfig: Record<
  string,
  { bg: string; color: string; label: string }
> = {
  "Not Started": { bg: "#f3f4f6", color: "#6b7280", label: "Not Started" },
  "In Progress": { bg: "#fffbeb", color: "#d97706", label: "In Progress" },
  Completed: { bg: "#f0fdf4", color: "#166534", label: "Completed" },
};

export default function FlightView() {
  const navigate = useNavigate();
  const { flightId } = useParams();
  const theme = useTheme();

  const flight = flights.find((f) => f.id === flightId) || flights[0];

  const completedCount = flight.crew.filter(
    (c) => c.evaluationStatus === "Completed",
  ).length;
  const progress = Math.round((completedCount / flight.crew.length) * 100);

  return (
    <Box>
      {/* 1. Header with Back Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/flights")}
          sx={{
            color: "#6b7280",
            textTransform: "none",
            mb: 2,
            "&:hover": { bgcolor: "transparent", color: "#111827" },
          }}
        >
          Back to Flights
        </Button>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "1.75rem",
                fontWeight: 700,
                color: "#111827",
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              {flight.flightNumber}
              <Chip
                label={flight.route}
                sx={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: "primary.main",
                }}
              />
            </Typography>
            <Typography sx={{ color: "#6b7280", mt: 0.5 }}>
              {flight.aircraft} • {flight.date}
            </Typography>
          </Box>
          <Box
            sx={{ textAlign: "right", display: { xs: "none", md: "block" } }}
          >
            <Typography
              sx={{ fontSize: "0.875rem", color: "#6b7280", mb: 0.5 }}
            >
              Evaluation Progress
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 120,
                  height: 8,
                  bgcolor: "#f3f4f6",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    width: `${progress}%`,
                    height: "100%",
                    bgcolor: theme.palette.primary.main,
                  }}
                />
              </Box>
              <Typography sx={{ fontWeight: 600 }}>{progress}%</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* 2. Metadata Card */}
      <Card
        elevation={0}
        sx={{ border: "1px solid #e8eaed", borderRadius: "12px", mb: 4 }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            <Box>
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                }}
              >
                Purser
              </Typography>
              <Typography sx={{ fontWeight: 600, color: "#111827", mt: 0.5 }}>
                {flight.crew.find((c) => c.role === "Purser")?.name ||
                  "Unassigned"}
              </Typography>
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                }}
              >
                Crew Count
              </Typography>
              <Typography sx={{ fontWeight: 600, color: "#111827", mt: 0.5 }}>
                {flight.crew.length} Members
              </Typography>
            </Box>
            <Box sx={{ ml: "auto", display: "flex", gap: 2 }}>
              <Button variant="outlined" sx={{ textTransform: "none" }}>
                Export Report
              </Button>
              <Button
                variant="contained"
                disableElevation
                sx={{ textTransform: "none", bgcolor: "#111827" }}
              >
                Mark Flight Complete
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* 3. Crew Roster Table */}
      <Card
        elevation={0}
        sx={{
          border: "1px solid #e8eaed",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #e8eaed",
          }}
        >
          <Typography sx={{ fontWeight: 600, color: "#111827" }}>
            Crew Roster & Evaluations
          </Typography>
          <Button
            startIcon={<AssessmentIcon />}
            size="small"
            sx={{ textTransform: "none" }}
          >
            Start All Assessments
          </Button>
        </Box>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: "#f9fafb" }}>
              <TableRow>
                <TableCell
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#6b7280",
                    textTransform: "uppercase",
                  }}
                >
                  Crew Member
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#6b7280",
                    textTransform: "uppercase",
                  }}
                >
                  Role / Position
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#6b7280",
                    textTransform: "uppercase",
                  }}
                >
                  Assessment Type
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#6b7280",
                    textTransform: "uppercase",
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#6b7280",
                    textTransform: "uppercase",
                  }}
                  align="right"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {flight.crew.map((member) => {
                const status =
                  statusConfig[member.evaluationStatus] ||
                  statusConfig["Not Started"];
                return (
                  <TableRow key={member.id} hover>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: "primary.main",
                            fontSize: "0.875rem",
                          }}
                        >
                          {member.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography
                            sx={{
                              fontSize: "0.875rem",
                              fontWeight: 500,
                              color: "#111827",
                            }}
                          >
                            {member.name}
                          </Typography>
                          <Typography
                            sx={{ fontSize: "0.75rem", color: "#9ca3af" }}
                          >
                            {member.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{ fontSize: "0.875rem", color: "#374151" }}
                      >
                        {member.role}
                      </Typography>
                      <Typography
                        sx={{ fontSize: "0.75rem", color: "#9ca3af" }}
                      >
                        POS: {member.role === "Purser" ? "L1" : "R1"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <FormControl
                        variant="standard"
                        size="small"
                        sx={{ minWidth: 120 }}
                      >
                        <Select
                          value="standard"
                          disableUnderline
                          sx={{ fontSize: "0.875rem" }}
                        >
                          <MenuItem value="standard">Standard Flight</MenuItem>
                          <MenuItem value="line-check">Line Check</MenuItem>
                          <MenuItem value="development">Development</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={status.label}
                        size="small"
                        sx={{
                          height: 24,
                          bgcolor: status.bg,
                          color: status.color,
                          fontWeight: 500,
                          fontSize: "0.75rem",
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant={
                          member.evaluationStatus === "Completed"
                            ? "outlined"
                            : "contained"
                        }
                        size="small"
                        disableElevation
                        onClick={() => {
                          const type =
                            member.role === "Purser" ? "purser" : "cabin-crew";
                          navigate(
                            `/evaluate/${type}/${flight.id}/${member.id}`,
                          );
                        }}
                        sx={{
                          textTransform: "none",
                          fontSize: "0.8125rem",
                          ...(member.evaluationStatus !== "Completed" && {
                            bgcolor: "#111827",
                            color: "white",
                            "&:hover": { bgcolor: "#374151" },
                          }),
                        }}
                      >
                        {member.evaluationStatus === "Not Started"
                          ? "Evaluate"
                          : member.evaluationStatus === "Completed"
                            ? "Review"
                            : "Continue"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
