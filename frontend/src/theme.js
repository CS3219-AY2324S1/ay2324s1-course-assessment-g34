import { alpha, createTheme, darken, getContrastRatio } from "@mui/material/styles";

const createColor = (color) => {
  return {
    main: color,
    light: alpha(color, 0.5),
    dark: darken(color, 0.1),
    contrastText: getContrastRatio(color, '#fff') > 4.5 ? '#fff' : '#111'
  };
}

export const theme = createTheme({
  palette: {
    primary: createColor('#0D203A'),
    secondary: createColor('#79155B'),
    success: createColor('#62FBD7'),
    warning: createColor('#FBBC1C'),
    error: createColor('#FB1C52'),
  },
  typography: {
    "fontFamily": `"Open Sans", sans-serif`,
    "fontWeightRegular": 400
  }
});
