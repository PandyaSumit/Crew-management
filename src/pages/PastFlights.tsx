import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  FormControl,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { pastFlights } from "../data/mockData";

const performanceOptions = [
  { value: "all", label: "All Performance" },
  { value: "excellent", label: "Excellent (90+)" },
  { value: "good", label: "Good (75–89)" },
  { value: "average", label: "Average (60–74)" },
  { value: "below", label: "Below 60" },
];

const roleOptions = [
  { value: "all", label: "All Roles" },
  { value: "Cabin Crew", label: "Cabin Crew" },
  { value: "Purser", label: "Purser" },
];

const getScoreStyle = (score: number) => {
  if (score >= 90) return { bg: "#f0fdf4", color: "#15803d", dot: "#22c55e" };
  if (score >= 75) return { bg: "#eff6ff", color: "#1d4ed8", dot: "#3b82f6" };
  if (score >= 60) return { bg: "#fff7ed", color: "#c2410c", dot: "#f97316" };
  return { bg: "#fef2f2", color: "#b91c1c", dot: "#ef4444" };
};

const getRoleStyle = (role: string) =>
  role === "Purser"
    ? { bg: "#f5f3ff", color: "#6d28d9" }
    : { bg: "#f0f9ff", color: "#0369a1" };

export default function PastFlights() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [performanceFilter, setPerformanceFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  const filtered = useMemo(() => {
    return pastFlights.filter((f) => {
      const matchSearch =
        search === "" ||
        f.crewMemberName.toLowerCase().includes(search.toLowerCase()) ||
        f.flightNumber.toLowerCase().includes(search.toLowerCase()) ||
        f.route.toLowerCase().includes(search.toLowerCase());

      const matchPerformance =
        performanceFilter === "all" ||
        (performanceFilter === "excellent" && f.overallScore >= 90) ||
        (performanceFilter === "good" &&
          f.overallScore >= 75 &&
          f.overallScore < 90) ||
        (performanceFilter === "average" &&
          f.overallScore >= 60 &&
          f.overallScore < 75) ||
        (performanceFilter === "below" && f.overallScore < 60);

      const matchRole = roleFilter === "all" || f.role === roleFilter;

      return matchSearch && matchPerformance && matchRole;
    });
  }, [search, performanceFilter, roleFilter]);

  return (
    <Box>
      {/* Page Header */}
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
          Past Flights
        </Typography>
        <Typography sx={{ fontSize: "0.875rem", color: "#6b7280" }}>
          Browse and filter all completed crew evaluations.
        </Typography>
      </Box>

      {/* Filters Bar */}
      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          flexWrap: "wrap",
          alignItems: "center",
          mb: 2,
        }}
      >
        <TextField
          size="small"
          placeholder="Search name, flight, or route…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 16, color: "#9ca3af" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            flex: 1,
            minWidth: 220,
            maxWidth: 340,
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              bgcolor: "#ffffff",
              fontSize: "0.825rem",
              "& fieldset": { borderColor: "#e8eaed" },
              "&:hover fieldset": { borderColor: "#d1d5db" },
              "&.Mui-focused fieldset": {
                borderColor: "primary.main",
                borderWidth: 1.5,
              },
            },
          }}
        />

        {[
          {
            value: performanceFilter,
            setter: setPerformanceFilter,
            options: performanceOptions,
            width: 175,
          },
          {
            value: roleFilter,
            setter: setRoleFilter,
            options: roleOptions,
            width: 140,
          },
        ].map((filter, i) => (
          <FormControl key={i} size="small" sx={{ minWidth: filter.width }}>
            <Select
              value={filter.value}
              onChange={(e) => filter.setter(e.target.value)}
              displayEmpty
              sx={{
                borderRadius: "8px",
                bgcolor: "#ffffff",
                fontSize: "0.825rem",
                color: "#374151",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#e8eaed",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#d1d5db",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "primary.main",
                  borderWidth: 1.5,
                },
              }}
            >
              {filter.options.map((opt) => (
                <MenuItem
                  key={opt.value}
                  value={opt.value}
                  sx={{ fontSize: "0.825rem", color: "#374151" }}
                >
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ))}

        {/* Result count */}
        <Typography
          sx={{
            fontSize: "0.775rem",
            color: "#9ca3af",
            ml: "auto",
            whiteSpace: "nowrap",
          }}
        >
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </Typography>
      </Box>

      {/* Table */}
      <Card
        elevation={0}
        sx={{
          border: "1px solid #e8eaed",
          borderRadius: "12px",
          bgcolor: "#ffffff",
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  bgcolor: "#f9fafb",
                  "& th": {
                    borderBottom: "1px solid #e8eaed",
                    py: 1.5,
                    px: 2.5,
                  },
                }}
              >
                {[
                  "Date",
                  "Flight",
                  "Route",
                  "Crew Member",
                  "Role",
                  "Score",
                  "",
                ].map((col) => (
                  <TableCell
                    key={col}
                    align={col === "Score" || col === "" ? "center" : "left"}
                    sx={{
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {col}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 0.75,
                      }}
                    >
                      <SearchIcon sx={{ fontSize: 28, color: "#e5e7eb" }} />
                      <Typography
                        sx={{
                          fontSize: "0.875rem",
                          color: "#9ca3af",
                          fontWeight: 500,
                        }}
                      >
                        No flights match your filters
                      </Typography>
                      <Typography
                        sx={{ fontSize: "0.775rem", color: "#d1d5db" }}
                      >
                        Try adjusting your search or filter criteria
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((flight, idx) => {
                  const score = getScoreStyle(flight.overallScore);
                  const role = getRoleStyle(flight.role);
                  const isLast = idx === filtered.length - 1;

                  return (
                    <TableRow
                      key={flight.id}
                      sx={{
                        "&:hover": { bgcolor: "#fafafa" },
                        "& td": {
                          borderBottom: isLast ? "none" : "1px solid #f3f4f6",
                          py: 1.75,
                          px: 2.5,
                        },
                        transition: "background-color 0.1s",
                      }}
                    >
                      {/* Date */}
                      <TableCell>
                        <Typography
                          sx={{ fontSize: "0.8rem", color: "#6b7280" }}
                        >
                          {flight.date}
                        </Typography>
                      </TableCell>

                      {/* Flight */}
                      <TableCell>
                        <Typography
                          sx={{
                            fontSize: "0.825rem",
                            fontWeight: 600,
                            color: "#111827",
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {flight.flightNumber}
                        </Typography>
                      </TableCell>

                      {/* Route */}
                      <TableCell>
                        <Typography
                          sx={{ fontSize: "0.825rem", color: "#374151" }}
                        >
                          {flight.route}
                        </Typography>
                      </TableCell>

                      {/* Crew Member */}
                      <TableCell>
                        <Typography
                          sx={{
                            fontSize: "0.825rem",
                            fontWeight: 500,
                            color: "primary.main",
                            cursor: "pointer",
                            "&:hover": { textDecoration: "underline" },
                          }}
                          onClick={() =>
                            navigate(`/crew/${flight.crewMemberId}`)
                          }
                        >
                          {flight.crewMemberName}
                        </Typography>
                      </TableCell>

                      {/* Role */}
                      <TableCell>
                        <Box
                          sx={{
                            display: "inline-flex",
                            px: 1.5,
                            py: 0.35,
                            borderRadius: "6px",
                            bgcolor: role.bg,
                            color: role.color,
                            fontSize: "0.72rem",
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {flight.role}
                        </Box>
                      </TableCell>

                      {/* Score */}
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.6,
                            px: 1.5,
                            py: 0.35,
                            borderRadius: "6px",
                            bgcolor: score.bg,
                          }}
                        >
                          <Box
                            sx={{
                              width: 5,
                              height: 5,
                              borderRadius: "50%",
                              bgcolor: score.dot,
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            sx={{
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              color: score.color,
                              letterSpacing: "0.01em",
                            }}
                          >
                            {flight.overallScore}%
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Action */}
                      <TableCell align="center">
                        <Button
                          size="small"
                          endIcon={
                            <ArrowForwardIcon
                              sx={{ fontSize: "12px !important" }}
                            />
                          }
                          disableElevation
                          sx={{
                            fontSize: "0.75rem",
                            fontWeight: 500,
                            color: "#374151",
                            textTransform: "none",
                            borderRadius: "7px",
                            px: 1.5,
                            py: 0.5,
                            border: "1px solid #e8eaed",
                            bgcolor: "#ffffff",
                            "&:hover": {
                              bgcolor: "#f9fafb",
                              borderColor: "#d1d5db",
                            },
                            whiteSpace: "nowrap",
                          }}
                        >
                          View Report
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
