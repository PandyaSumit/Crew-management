import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4f6ef7', // Blue brand color
      light: '#eef1fe', // Very light blue for backgrounds
      dark: '#3b4fd8', // Darker blue for hover/focus
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FF6B35',
      light: '#FF8F62',
      dark: '#E55A25',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F8FAFC', // Slate 50 - cleaner than #F5F5F7
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E293B', // Slate 800
      secondary: '#64748B', // Slate 500
    },
    error: {
      main: '#EF4444',
    },
    warning: {
      main: '#F59E0B',
    },
    success: {
      main: '#10B981',
    },
    info: {
      main: '#3B82F6',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontWeight: 700, letterSpacing: '-0.02em' },
    h4: {
      fontWeight: 700,
      fontSize: '1.5rem',
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      letterSpacing: '-0.01em',
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1rem',
      letterSpacing: '-0.01em',
    },
    subtitle2: {
      fontWeight: 600,
      fontSize: '0.875rem',
      letterSpacing: '-0.01em',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#64748B',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 1px 2px rgba(0, 0, 0, 0.05)', // 1 - subtle
    '0px 4px 6px -1px rgba(0, 0, 0, 0.05), 0px 2px 4px -1px rgba(0, 0, 0, 0.03)', // 2 - nice elevation
    '0px 10px 15px -3px rgba(0, 0, 0, 0.05), 0px 4px 6px -2px rgba(0, 0, 0, 0.025)', // 3 - float
    '0px 20px 25px -5px rgba(0, 0, 0, 0.05), 0px 10px 10px -5px rgba(0, 0, 0, 0.02)', // 4 - high float
    // ... fill the rest with generic MUI shadows or repeat for safety
    ...Array(20).fill('0px 4px 6px -1px rgba(0, 0, 0, 0.05)'),
  ] as any,
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 16px',
          transition: 'all 0.2s ease-in-out',
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#33144E', // Darker purple
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(74, 29, 112, 0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05), 0px 10px 15px -5px rgba(0, 0, 0, 0.02)',
          border: '1px solid #F1F5F9', // Subtle Slate 100 border
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05), 0px 10px 15px -5px rgba(0, 0, 0, 0.02)',
          border: '1px solid #F1F5F9',
        }
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid #E2E8F0', // Slate 200
          backgroundColor: '#FFFFFF',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #E2E8F0',
          color: '#1E293B',
          boxShadow: 'none',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #F1F5F9',
          padding: '16px',
        },
        head: {
          fontWeight: 600,
          backgroundColor: '#F8FAFC',
          color: '#475569',
          textTransform: 'uppercase',
          fontSize: '0.75rem',
          letterSpacing: '0.05em',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#FFFFFF',
            '& fieldset': {
              borderColor: '#E2E8F0',
            },
            '&:hover fieldset': {
              borderColor: '#CBD5E1',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#4A1D70',
              borderWidth: '2px', // Make it clear
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 6,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          '&.Mui-selected': {
            backgroundColor: 'rgba(74, 29, 112, 0.08)', // 8% Primary
            color: '#4A1D70',
            '&:hover': {
              backgroundColor: 'rgba(74, 29, 112, 0.12)',
            },
            '& .MuiListItemIcon-root': {
              color: '#4A1D70',
            }
          },
          '&:hover': {
            backgroundColor: '#F1F5F9',
          }
        }
      }
    }
  },
});

export const ratingColors: Record<string, string> = {
  U: '#D32F2F',
  N: '#F57C00',
  M: '#66BB6A',
  E: '#1976D2',
  O: '#7B1FA2',
};

export const performanceBadgeColors: Record<string, string> = {
  excellent: '#388E3C',
  good: '#1976D2',
  average: '#F57C00',
  'needs-improvement': '#D32F2F',
};

export const purserRatingColors: Record<string, string> = {
  N: '#F57C00',
  R: '#1976D2',
  A: '#388E3C',
};

export default theme;
