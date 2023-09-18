import { createTheme } from "@mui/material/styles";


const lightText = '#CDD7F7';
const darkText = '#172A46';

const { palette } = createTheme();
const {augmentColor} = palette;
const createColor = (main) => augmentColor({ color: { main: main }});

export const theme = createTheme({
  // palette: {
  //   primary: {
  //     main: '#0D203A',
  //     light: '#172A46',
  //     dark: '#0A192F',
  //     contrastText: lightText
  //   },
  //   secondary: {
  //     main: '#B3A1FF'
  //   },
  //   error: {
  //     main: '#FB1C52',
  //     contrastText: darkText
  //   },
  //   warning: {
  //     main: '#FBBC1C'
  //   },
  //   success: {
  //     main: '#62FBD7',
  //     light: '#62FBD7',
  //     dark: '#62FBD7',
  //     contrastText: lightText
  //   }
  // },
  palette: {
    primary: createColor('#172A46'),
    neonGreen: createColor('#62FBD7')
  },
  typography: {
    "fontFamily": `"Open Sans", sans-serif`,
    "fontWeightRegular": 400
  }
});
