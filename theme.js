import grey from "@material-ui/core/colors/grey";
import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: { main: grey[800] },
    secondary: { main: grey[900] },
    type: "light",
  },
});

export { theme };
