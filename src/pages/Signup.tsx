import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { SelectChangeEvent } from "@mui/material";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  CircularProgress,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  FormControlLabel,
  Checkbox,
  Divider,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface SignupErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
  terms?: string;
}

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    fontSize: "0.875rem",
    bgcolor: "#ffffff",
    "& fieldset": { borderColor: "#e8eaed" },
    "&:hover fieldset": { borderColor: "#d1d5db" },
    "&.Mui-focused fieldset": { borderColor: "primary.main", borderWidth: 1.5 },
  },
  "& .MuiFormHelperText-root": {
    fontSize: "0.72rem",
    margin: "4px 0 0",
  },
  "& .MuiInputLabel-root": {
    fontSize: "0.825rem",
  },
};

const PASSWORD_RULES = [
  { label: "Minimum 8 characters", test: (p: string) => p.length >= 8 },
  {
    label: "At least one uppercase letter",
    test: (p: string) => /[A-Z]/.test(p),
  },
  {
    label: "At least one lowercase letter",
    test: (p: string) => /[a-z]/.test(p),
  },
  { label: "At least one number", test: (p: string) => /\d/.test(p) },
];

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    terms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<SignupErrors>({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    const e: SignupErrors = {};
    if (!formData.fullName.trim()) e.fullName = "Full name is required";
    else if (formData.fullName.trim().length < 3)
      e.fullName = "Name must be at least 3 characters";
    if (!formData.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      e.email = "Enter a valid email";
    if (!formData.password) e.password = "Password is required";
    else if (formData.password.length < 8)
      e.password = "Password must be at least 8 characters";
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password))
      e.password = "Password must contain uppercase, lowercase, and numbers";
    if (!formData.confirmPassword)
      e.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    if (!formData.role) e.role = "Please select your role";
    if (!formData.terms) e.terms = "You must accept the terms and conditions";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");
    setSuccessMessage("");
    if (!validateForm()) return;
    setLoading(true);
    setTimeout(() => {
      try {
        const mockUser = {
          id: Date.now().toString(),
          email: formData.email,
          name: formData.fullName,
          role: formData.role,
        };
        localStorage.setItem("authToken", "mock-token-" + Date.now());
        localStorage.setItem("user", JSON.stringify(mockUser));
        setLoading(false);
        setSuccessMessage("Account created! Redirecting…");
        setTimeout(() => navigate("/", { replace: true }), 1500);
      } catch {
        setGeneralError("Signup failed. Please try again.");
        setLoading(false);
      }
    }, 1500);
  };

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name as keyof SignupErrors])
      setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleSelect = (e: SelectChangeEvent<string>) => {
    setFormData((p) => ({ ...p, role: e.target.value }));
    if (errors.role) setErrors((p) => ({ ...p, role: "" }));
  };

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((p) => ({ ...p, terms: e.target.checked }));
    if (errors.terms) setErrors((p) => ({ ...p, terms: "" }));
  };

  const showPasswordStrength = formData.password.length > 0;

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", bgcolor: "#f7f8fa" }}>
      {/* Left panel */}
      <Box
        sx={{
          display: { xs: "none", lg: "flex" },
          width: "42%",
          flexShrink: 0,
          bgcolor: "#eef2ff",
          flexDirection: "column",
          justifyContent: "space-between",
          p: 5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
            <Box
              component="img"
              src="/airCairo-logo.png"
              alt="AirCairo Logo"
              sx={{
                height: 28, // ✅ clean logo size
                width: "auto",
              }}
            />
          </Box>
        </Box>

        <Box>
          <Typography
            sx={{
              fontSize: "1.8rem",
              fontWeight: 700,
              color: "#000000",
              letterSpacing: "-0.03em",
              lineHeight: 1.2,
              mb: 1.5,
            }}
          >
            Join the Crew
            <br />
            Management Platform.
          </Typography>
          <Typography
            sx={{
              fontSize: "0.875rem",
              color: "#332e2eff",
              lineHeight: 1.7,
            }}
          >
            Start evaluating flight crew performance with a structured,
            efficient system built for aviation teams.
          </Typography>
        </Box>

        {/* Password requirements */}
        <Box
          sx={{
            p: 2.5,
            borderRadius: "10px",
            border: "1px solid rgba(32, 30, 30, 0.08)",
            bgcolor: "rgba(255,255,255,0.03)",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.65rem",
              fontWeight: 600,
              color: "rgba(0, 0, 0, 0.3)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              mb: 1.25,
            }}
          >
            Password Requirements
          </Typography>
          {PASSWORD_RULES.map((rule) => {
            const met = rule.test(formData.password);
            return (
              <Box
                key={rule.label}
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.75 }}
              >
                <Box
                  sx={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    bgcolor:
                      met && formData.password
                        ? "#22c55e"
                        : "rgba(0, 0, 0, 0.2)",
                    flexShrink: 0,
                    transition: "background-color 0.15s",
                  }}
                />
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    color:
                      met && formData.password
                        ? "rgba(56, 56, 56, 0.7)"
                        : "rgba(56, 56, 56, 0.7)",
                    transition: "color 0.15s",
                  }}
                >
                  {rule.label}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Right panel — form */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 2, sm: 4 },
          overflowY: "auto",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 420, py: { xs: 2, sm: 4 } }}>
          {/* Mobile brand */}
          <Box
            sx={{
              display: { xs: "flex", lg: "none" },
              alignItems: "center",
              gap: 1.5,
              mb: 4,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
              <Box
                component="img"
                src="/airCairo-logo.png"
                alt="AirCairo Logo"
                sx={{
                  height: 28, // ✅ clean logo size
                  width: "auto",
                }}
              />
            </Box>
          </Box>

          <Typography
            sx={{
              fontSize: "1.4rem",
              fontWeight: 700,
              color: "#111827",
              letterSpacing: "-0.025em",
              mb: 0.5,
            }}
          >
            Create an account
          </Typography>
          <Typography sx={{ fontSize: "0.825rem", color: "#6b7280", mb: 3.5 }}>
            Join the AirCairo Crew Management platform
          </Typography>

          {/* Banners */}
          {generalError && (
            <Box
              sx={{
                mb: 2.5,
                px: 2,
                py: 1.25,
                borderRadius: "8px",
                bgcolor: "#fef2f2",
                border: "1px solid #fca5a5",
              }}
            >
              <Typography sx={{ fontSize: "0.8rem", color: "#dc2626" }}>
                {generalError}
              </Typography>
            </Box>
          )}
          {successMessage && (
            <Box
              sx={{
                mb: 2.5,
                px: 2,
                py: 1.25,
                borderRadius: "8px",
                bgcolor: "#f0fdf4",
                border: "1px solid #86efac",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 15, color: "#22c55e" }} />
              <Typography sx={{ fontSize: "0.8rem", color: "#15803d" }}>
                {successMessage}
              </Typography>
            </Box>
          )}

          <Box
            component="form"
            onSubmit={handleSignup}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              fullWidth
              label="Full name"
              name="fullName"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleInput}
              error={!!errors.fullName}
              helperText={errors.fullName}
              disabled={loading}
              sx={inputSx}
            />

            <TextField
              fullWidth
              label="Email address"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleInput}
              error={!!errors.email}
              helperText={errors.email}
              disabled={loading}
              sx={inputSx}
            />

            {/* Role */}
            <Box>
              <Typography
                sx={{
                  fontSize: "0.775rem",
                  fontWeight: 500,
                  color: "#374151",
                  mb: 0.75,
                }}
              >
                Role
              </Typography>
              <FormControl fullWidth error={!!errors.role}>
                <Select
                  value={formData.role}
                  onChange={handleSelect}
                  displayEmpty
                  disabled={loading}
                  sx={{
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                    bgcolor: "#ffffff",
                    color: formData.role ? "#111827" : "#9ca3af",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: errors.role ? "#ef4444" : "#e8eaed",
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
                  <MenuItem
                    value=""
                    disabled
                    sx={{ color: "#9ca3af", fontSize: "0.875rem" }}
                  >
                    Select your role
                  </MenuItem>
                  {["Cabin Crew", "Purser", "Evaluator", "Manager"].map((r) => (
                    <MenuItem key={r} value={r} sx={{ fontSize: "0.875rem" }}>
                      {r}
                    </MenuItem>
                  ))}
                </Select>
                {errors.role && (
                  <Typography
                    sx={{ fontSize: "0.72rem", color: "#ef4444", mt: 0.5 }}
                  >
                    {errors.role}
                  </Typography>
                )}
              </FormControl>
            </Box>

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Min 8 characters"
              value={formData.password}
              onChange={handleInput}
              error={!!errors.password}
              helperText={errors.password}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      disabled={loading}
                      size="small"
                      sx={{ color: "#9ca3af" }}
                    >
                      {showPassword ? (
                        <VisibilityOff fontSize="small" />
                      ) : (
                        <Visibility fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={inputSx}
            />

            {/* Inline password strength (mobile only — desktop shows in sidebar) */}
            {showPasswordStrength && (
              <Box
                sx={{
                  display: { xs: "flex", lg: "none" },
                  flexWrap: "wrap",
                  gap: 0.75,
                  mt: -0.5,
                }}
              >
                {PASSWORD_RULES.map((rule) => {
                  const met = rule.test(formData.password);
                  return (
                    <Box
                      key={rule.label}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        px: 1,
                        py: 0.3,
                        borderRadius: "5px",
                        bgcolor: met ? "#f0fdf4" : "#f9fafb",
                      }}
                    >
                      <Box
                        sx={{
                          width: 4,
                          height: 4,
                          borderRadius: "50%",
                          bgcolor: met ? "#22c55e" : "#d1d5db",
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: "0.68rem",
                          color: met ? "#15803d" : "#9ca3af",
                        }}
                      >
                        {rule.label}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            )}

            <TextField
              fullWidth
              label="Confirm password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleInput}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                      disabled={loading}
                      size="small"
                      sx={{ color: "#9ca3af" }}
                    >
                      {showConfirmPassword ? (
                        <VisibilityOff fontSize="small" />
                      ) : (
                        <Visibility fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={inputSx}
            />

            {/* Terms */}
            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.terms}
                    onChange={handleCheck}
                    disabled={loading}
                    size="small"
                    sx={{
                      color: errors.terms ? "#ef4444" : "#d1d5db",
                      "&.Mui-checked": { color: "primary.main" },
                      p: 0.75,
                    }}
                  />
                }
                label={
                  <Typography
                    sx={{
                      fontSize: "0.775rem",
                      color: errors.terms ? "#ef4444" : "#6b7280",
                    }}
                  >
                    I agree to the{" "}
                    <Link
                      href="#"
                      underline="none"
                      sx={{ color: "primary.main", fontWeight: 500 }}
                    >
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="#"
                      underline="none"
                      sx={{ color: "primary.main", fontWeight: 500 }}
                    >
                      Privacy Policy
                    </Link>
                  </Typography>
                }
              />
              {errors.terms && (
                <Typography
                  sx={{
                    fontSize: "0.72rem",
                    color: "#ef4444",
                    ml: 4,
                    mt: 0.25,
                  }}
                >
                  {errors.terms}
                </Typography>
              )}
            </Box>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              disableElevation
              sx={{
                bgcolor: "#111827",
                color: "#fff",
                py: 1.25,
                fontSize: "0.875rem",
                fontWeight: 500,
                textTransform: "none",
                borderRadius: "8px",
                mt: 0.5,
                "&:hover": { bgcolor: "#1f2937" },
                "&.Mui-disabled": { bgcolor: "#f3f4f6", color: "#9ca3af" },
              }}
            >
              {loading ? (
                <CircularProgress size={18} sx={{ color: "#9ca3af" }} />
              ) : (
                "Create account"
              )}
            </Button>
          </Box>

          <Divider sx={{ my: 3, borderColor: "#f3f4f6" }} />

          <Typography
            sx={{ fontSize: "0.8rem", color: "#6b7280", textAlign: "center" }}
          >
            Already have an account?{" "}
            <Link
              component="button"
              type="button"
              onClick={() => navigate("/login")}
              underline="none"
              sx={{
                fontSize: "0.8rem",
                color: "primary.main",
                fontWeight: 500,
                cursor: "pointer",
                "&:hover": { color: "primary.dark" },
              }}
            >
              Sign in
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
