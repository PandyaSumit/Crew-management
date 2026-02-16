import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4A1D70',
      light: '#6B3F8E',
      dark: '#33144E',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FF6B35',
      light: '#FF8F62',
      dark: '#E55A25',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F5F5F7',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1A2E',
      secondary: '#5A5A7A',
    },
    error: {
      main: '#D32F2F',
    },
    warning: {
      main: '#F57C00',
    },
    success: {
      main: '#388E3C',
    },
    info: {
      main: '#1976D2',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    subtitle1: {
      fontWeight: 500,
    },
    body2: {
      color: '#5A5A7A',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          border: '1px solid #E8E8EE',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            fontWeight: 600,
            backgroundColor: '#F5F5F7',
            color: '#1A1A2E',
          },
        },
      },
    },
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
