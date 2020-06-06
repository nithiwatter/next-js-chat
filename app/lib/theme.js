import grey from '@material-ui/core/colors/grey';
import { createMuiTheme } from '@material-ui/core/styles';

const themeDark = createMuiTheme({
  palette: {
    primary: { main: grey[200] },
    secondary: { main: grey[400] },
    bg: { main: '#36393e' },
    sbg: { main: '#1e2124' },
    tbg: { main: '#282b30' },
    blue: { main: '	#7289da' },
    lightgrey: { main: '#99aab5' },
    border: { main: grey[600] },
    text: { main: '#ffffff' },
    background: { paper: '#36393e' },
    type: 'dark',
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '::-webkit-scrollbar': {
          width: '8px',
          height: '10px',
        },
        '::-webkit-scrollbar-thumb': {
          borderRadius: '8px',
          background: grey[800],
        },
      },
    },
  },
});

const themeLight = createMuiTheme({
  palette: {
    primary: { main: grey[800] },
    secondary: { main: grey[900] },
    bg: { main: '#f5f5f5' },
    tbg: { main: '#ececec' },
    sbg: { main: '#e1e1e1' },
    blue: { main: '	#7289da' },
    lightgrey: { main: '#99aab5' },
    border: { main: grey[200] },
    text: { primary: grey[900] },
    type: 'light',
    background: { paper: '#f5f5f5' },
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '::-webkit-scrollbar': {
          width: '8px',
          height: '10px',
        },
        '::-webkit-scrollbar-thumb': {
          borderRadius: '8px',
          background: '#e1e1e1',
        },
      },
    },
  },
});

export { themeDark, themeLight };
