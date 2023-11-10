import {
  createTheme, darken, getContrastRatio, lighten,
} from '@mui/material/styles';

const createColor = (color) => ({
  main: color,
  light: lighten(color, 0.05),
  dark: darken(color, 0.3),
  contrastText: getContrastRatio(color, '#fff') > 4.5 ? '#fff' : '#111',
});

export const theme = createTheme({
  palette: {
    primary: createColor('#0D203A'),
    secondary: createColor('#79155B'),
    success: createColor('#62FBD7'),
    warning: createColor('#FBBC1C'),
    error: createColor('#FB1C52'),
    grey: createColor('#E0E0E0'),
  },
  typography: {
    fontFamily: '"Open Sans", sans-serif',
    fontWeightRegular: 400,
  },
});
