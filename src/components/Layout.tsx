import { useState, useMemo } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  alpha,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import LogoutIcon from "@mui/icons-material/Logout";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const DRAWER_WIDTH = 240;
const APPBAR_HEIGHT = 64;

const navItems = [
  { label: "Dashboard", path: "/", icon: <DashboardIcon fontSize="small" /> },
  {
    label: "Projects",
    path: "/projects",
    icon: <FolderOpenIcon fontSize="small" />,
  },
];

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function Layout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const user = useMemo<User | null>(() => {
    const userData = localStorage.getItem("user");
    if (!userData) return null;
    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  }, []);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    handleProfileMenuClose();
    navigate("/login", { replace: true });
  };

  const currentPage = (() => {
    if (location.pathname === "/") return navItems.find((i) => i.path === "/");
    return navItems.find(
      (item) => item.path !== "/" && location.pathname.startsWith(item.path)
    );
  })();

  const drawer = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#ffffff",
        borderRight: "1px solid #e8eaed",
      }}
    >
      {/* Brand */}
      <Box
        sx={{
          height: APPBAR_HEIGHT,
          px: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderBottom: "1px solid #e8eaed",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 0.3,
          }}
        >
          <Box
            component="img"
            src="/airCairo-logo.png"
            alt="AirCairo"
            sx={{
              height: 22,
              width: "auto",
              objectFit: "contain",
              display: "block",
            }}
          />

          {/* <Typography
            sx={{
              fontSize: "0.7rem",
              color: "#9CA3AF",
              fontWeight: 400,
              lineHeight: 1,
            }}
          >
            Crew Evaluation
          </Typography> */}
        </Box>
      </Box>

      {/* Nav Section Label */}
      <Box sx={{ px: 3, pt: 3, pb: 1 }}>
        <Typography
          sx={{
            fontSize: "0.65rem",
            fontWeight: 600,
            color: "#9ca3af",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Navigation
        </Typography>
      </Box>

      {/* Nav Items */}
      <List sx={{ px: 2, flexGrow: 1, py: 0 }}>
        {navItems.map((item) => {
          const isSelected =
            item.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.path);
          return (
            <ListItemButton
              key={item.path}
              selected={isSelected}
              onClick={() => {
                navigate(item.path);
                if (isMobile) setMobileOpen(false);
              }}
              sx={{
                mb: 0.5,
                borderRadius: "8px",
                px: 1.5,
                py: 1,
                minHeight: 40,
                bgcolor: isSelected
                  ? alpha(theme.palette.primary.main, 0.08)
                  : "transparent",
                "&:hover": {
                  bgcolor: isSelected
                    ? alpha(theme.palette.primary.main, 0.12)
                    : "#f9fafb",
                },
                "&.Mui-selected": {
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                },
                "&.Mui-selected:hover": {
                  bgcolor: alpha(theme.palette.primary.main, 0.12),
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 32,
                  color: isSelected ? theme.palette.primary.main : "#9ca3af",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: "0.85rem",
                  fontWeight: isSelected ? 500 : 400,
                  color: isSelected ? "#111827" : "#6b7280",
                  letterSpacing: "-0.01em",
                }}
              />
              {isSelected && (
                <Box
                  sx={{
                    width: 3,
                    height: 16,
                    borderRadius: "2px",
                    bgcolor: theme.palette.primary.main,
                    flexShrink: 0,
                  }}
                />
              )}
            </ListItemButton>
          );
        })}
      </List>

      {/* Bottom User Card */}
      <Box
        sx={{
          p: 2,
          borderTop: "1px solid #e8eaed",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 1.5,
            py: 1,
            borderRadius: "8px",
            bgcolor: "#f9fafb",
          }}
        >
          <Avatar
            sx={{
              width: 28,
              height: 28,
              bgcolor: theme.palette.primary.main,
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: "0.8rem",
                fontWeight: 500,
                color: "#374151",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.name || "User"}
            </Typography>
            <Typography
              sx={{
                fontSize: "0.68rem",
                color: "#9ca3af",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.role || "—"}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f7f8fa" }}>
      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        {/* Mobile */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
              boxShadow: "none",
              border: "none",
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
              boxShadow: "none",
              border: "none",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Area */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        }}
      >
        {/* Top Bar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: "#ffffff",
            borderBottom: "1px solid #e8eaed",
            zIndex: theme.zIndex.drawer - 1,
            width: "100%",
            left: "auto",
            right: 0,
          }}
        >
          <Toolbar
            sx={{
              height: APPBAR_HEIGHT,
              px: { xs: 2, sm: 3 },
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              minHeight: `${APPBAR_HEIGHT}px !important`,
            }}
          >
            {/* Left: hamburger + page title */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <IconButton
                size="small"
                onClick={() => setMobileOpen(!mobileOpen)}
                sx={{
                  display: { md: "none" },
                  color: "#6b7280",
                  p: 0.75,
                  borderRadius: "6px",
                  "&:hover": { bgcolor: "#f3f4f6" },
                }}
              >
                <MenuIcon fontSize="small" />
              </IconButton>

              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Typography
                  sx={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "#111827",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {currentPage?.label || "Overview"}
                </Typography>
              </Box>
            </Box>

            {/* Right: Profile */}
            <Box
              onClick={handleProfileMenuOpen}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                cursor: "pointer",
                px: 1.5,
                py: 0.75,
                borderRadius: "8px",
                border: "1px solid #e8eaed",
                bgcolor: "#fff",
                "&:hover": { bgcolor: "#f9fafb" },
                userSelect: "none",
              }}
            >
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  bgcolor: theme.palette.primary.main,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                }}
              >
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </Avatar>
              <Box sx={{ display: { xs: "none", sm: "block" }, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    color: "#111827",
                    lineHeight: 1.3,
                    whiteSpace: "nowrap",
                  }}
                >
                  {user?.name || "User"}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.7rem",
                    color: "#9ca3af",
                    lineHeight: 1.2,
                    whiteSpace: "nowrap",
                  }}
                >
                  {user?.role || "Member"}
                </Typography>
              </Box>
              <KeyboardArrowDownIcon
                sx={{ fontSize: 16, color: "#9ca3af", flexShrink: 0 }}
              />
            </Box>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            px: { xs: 2, sm: 3, lg: 4 },
            py: { xs: 3, sm: 3.5 },
            // maxWidth: "1440px",
            width: "100%",
          }}
        >
          <Outlet />
        </Box>
      </Box>

      {/* Profile Dropdown */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        elevation={0}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 220,
            borderRadius: "10px",
            border: "1px solid #e8eaed",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            overflow: "visible",
          },
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
          <Typography
            sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#111827" }}
          >
            {user?.name || "User"}
          </Typography>
          <Typography sx={{ fontSize: "0.75rem", color: "#9ca3af", mt: 0.25 }}>
            {user?.email || "—"}
          </Typography>
        </Box>

        <Divider sx={{ borderColor: "#f3f4f6" }} />

        <Box sx={{ p: 0.75 }}>
          <MenuItem
            onClick={handleProfileMenuClose}
            sx={{
              borderRadius: "6px",
              px: 1.5,
              py: 0.875,
              fontSize: "0.8rem",
              color: "#374151",
              fontWeight: 400,
              "&:hover": { bgcolor: "#f9fafb" },
            }}
          >
            Profile Settings
          </MenuItem>
        </Box>

        <Divider sx={{ borderColor: "#f3f4f6" }} />

        <Box sx={{ p: 0.75 }}>
          <MenuItem
            onClick={handleLogout}
            sx={{
              borderRadius: "6px",
              px: 1.5,
              py: 0.875,
              fontSize: "0.8rem",
              color: "#dc2626",
              fontWeight: 400,
              gap: 1,
              "&:hover": { bgcolor: "#fef2f2" },
            }}
          >
            <LogoutIcon sx={{ fontSize: 15 }} />
            Log out
          </MenuItem>
        </Box>
      </Menu>
    </Box>
  );
}
