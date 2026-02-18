import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    fontSize: "0.875rem",
    bgcolor: "#ffffff",
    "& fieldset": { borderColor: "#e8eaed" },
    "&:hover fieldset": { borderColor: "#d1d5db" },
    "&.Mui-focused fieldset": { borderColor: "#4f6ef7", borderWidth: 1.5 },
  },
  "& .MuiFormHelperText-root": {
    fontSize: "0.72rem",
    margin: "4px 0 0",
  },
  "& .MuiInputLabel-root": {
    fontSize: "0.825rem",
  },
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Enter a valid email address";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");
    if (!validateForm()) return;
    setLoading(true);
    setTimeout(() => {
      try {
        const mockUser = {
          id: "1",
          email,
          name: email.split("@")[0],
          role: "Purser",
        };
        localStorage.setItem("authToken", "mock-token-" + Date.now());
        localStorage.setItem("user", JSON.stringify(mockUser));
        setLoading(false);
        navigate("/", { replace: true });
      } catch {
        setGeneralError("Login failed. Please try again.");
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        bgcolor: "#f7f8fa",
      }}
    >
      {/* Left panel — branding (hidden on mobile) */}
      <Box
        sx={{
          display: { xs: "none", lg: "flex" },
          width: "44%",
          flexShrink: 0,
          bgcolor: "#eef2ff",
          flexDirection: "column",
          justifyContent: "space-between",
          p: 6,
        }}
      >
        {/* 🔥 Brand */}
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

        {/* 🔥 Center content */}
        <Box>
          <Typography
            sx={{
              fontSize: "2.2rem",
              fontWeight: 700,
              color: "#000000",
              letterSpacing: "-0.03em",
              lineHeight: 1.2,
              mb: 2,
            }}
          >
            Crew Evaluation
            <br />
            Made Simple.
          </Typography>

          <Typography
            sx={{
              fontSize: "0.95rem",
              color: "#332e2eff",
              lineHeight: 1.7,
            }}
          >
            Manage purser and cabin crew assessments, track performance trends,
            and maintain flight records — all in one place.
          </Typography>
        </Box>

        {/* 🔥 Bottom card */}
        <Box
          sx={{
            p: 2.5,
            borderRadius: "12px",
            border: "1px solid rgba(32, 30, 30, 0.08)",
            bgcolor: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.7rem",
              fontWeight: 600,
              color: "rgba(0, 0, 0, 0.35)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              mb: 1.2,
            }}
          >
            Demo Credentials
          </Typography>

          <Typography
            sx={{
              fontSize: "0.85rem",
              color: "rgba(56, 56, 56, 0.7)",
              mb: 0.5,
            }}
          >
            demo@example.com
          </Typography>

          <Typography
            sx={{
              fontSize: "0.85rem",
              color: "rgba(56, 56, 56, 0.7)",
            }}
          >
            password123
          </Typography>
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
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 400 }}>
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

          {/* Heading */}
          <Typography
            sx={{
              fontSize: "1.4rem",
              fontWeight: 700,
              color: "#111827",
              letterSpacing: "-0.025em",
              mb: 0.5,
            }}
          >
            Sign in
          </Typography>
          <Typography sx={{ fontSize: "0.825rem", color: "#6b7280", mb: 3.5 }}>
            Welcome back to AirCairo Crew Manager
          </Typography>

          {/* Error */}
          {generalError && (
            <Box
              sx={{
                mb: 2.5,
                px: 2,
                py: 1.25,
                borderRadius: "8px",
                bgcolor: "#fef2f2",
                border: "1px solid #fca5a5",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography sx={{ fontSize: "0.8rem", color: "#dc2626" }}>
                {generalError}
              </Typography>
            </Box>
          )}

          {/* Form */}
          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              fullWidth
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
              error={!!errors.email}
              helperText={errors.email}
              disabled={loading}
              sx={inputSx}
            />

            <Box>
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: "" });
                }}
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
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                <Link
                  href="#"
                  underline="none"
                  sx={{
                    fontSize: "0.775rem",
                    color: "#4f6ef7",
                    fontWeight: 500,
                    "&:hover": { color: "#3b4fd8" },
                  }}
                >
                  Forgot password?
                </Link>
              </Box>
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
                "Sign in"
              )}
            </Button>
          </Box>

          <Divider sx={{ my: 3, borderColor: "#f3f4f6" }} />

          <Typography
            sx={{ fontSize: "0.8rem", color: "#6b7280", textAlign: "center" }}
          >
            Don't have an account?{" "}
            <Link
              component="button"
              type="button"
              onClick={() => navigate("/signup")}
              underline="none"
              sx={{
                fontSize: "0.8rem",
                color: "#4f6ef7",
                fontWeight: 500,
                cursor: "pointer",
                "&:hover": { color: "#3b4fd8" },
              }}
            >
              Create account
            </Link>
          </Typography>

          {/* Mobile demo credentials */}
          <Box
            sx={{
              display: { xs: "block", lg: "none" },
              mt: 3,
              p: 2,
              borderRadius: "8px",
              bgcolor: "#f9fafb",
              border: "1px solid #e8eaed",
            }}
          >
            <Typography
              sx={{
                fontSize: "0.65rem",
                fontWeight: 600,
                color: "#9ca3af",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                mb: 0.75,
              }}
            >
              Demo Credentials
            </Typography>
            <Typography
              sx={{ fontSize: "0.775rem", color: "#6b7280", mb: 0.25 }}
            >
              demo@example.com
            </Typography>
            <Typography sx={{ fontSize: "0.775rem", color: "#6b7280" }}>
              password123
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
