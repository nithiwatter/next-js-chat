import React, { Component } from "react";
import Layout from "../components/layout/index";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  title: {
    [theme.breakpoints.down("sm")]: {
      fontSize: "2.75rem",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "2rem",
    },
  },
  root: {
    width: "90%",
    margin: "4rem auto",
    borderRadius: "5px",
    border: "2px solid",
    borderColor: theme.palette.grey[700],
    backgroundColor: theme.palette.background.paper,
  },
  icons: {
    width: "80px",
    textAlign: "center",
  },
  listItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    padding: theme.spacing(2, 2),
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      alignItems: "flex-start",
    },
  },
});

class YourSettings extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { isMobile, firstGridItem, classes, theme } = this.props;
    return (
      <Layout isMobile={isMobile} firstGridItem={firstGridItem}>
        <div
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <List className={classes.root}>
            <ListItem>
              <ListItemText>
                <Typography
                  variant="h2"
                  className={classes.title}
                  style={{ marginLeft: theme.spacing(2) }}
                >
                  Your Settings
                </Typography>
              </ListItemText>

              <Button>Upload Photo</Button>
            </ListItem>
            <ListItem button>
              <ListItemText>
                <div className={classes.listItem}>
                  <Typography variant="h5">Profile Photo</Typography>
                  <Typography
                    variant="subtitle1"
                    className={classes.description}
                  >
                    A photo helps personalize your profile
                  </Typography>
                </div>
              </ListItemText>
              <ListItemAvatar className={classes.icons}>
                <Avatar
                  style={{
                    height: "70px",
                    width: "70px",
                    fontSize: "2rem",
                    margin: "0 auto",
                  }}
                >
                  A
                </Avatar>
              </ListItemAvatar>
            </ListItem>
            <Divider variant="middle"></Divider>
            <ListItem button>
              <ListItemText>
                <div className={classes.listItem}>
                  <Typography variant="h5">Your Email</Typography>
                  <Typography
                    variant="subtitle1"
                    className={classes.description}
                  >
                    nithiwatter@gmail.com
                  </Typography>
                </div>
              </ListItemText>
              <ListItemAvatar className={classes.icons}>
                <IconButton>
                  <EditIcon></EditIcon>
                </IconButton>
              </ListItemAvatar>
            </ListItem>
            <Divider variant="middle" />
            <ListItem button>
              <ListItemText>
                <div className={classes.listItem}>
                  <Typography variant="h5">Your Name</Typography>
                  <Typography
                    variant="subtitle1"
                    className={classes.description}
                  >
                    Nithiwat Seesillapachai
                  </Typography>
                </div>
              </ListItemText>
              <ListItemAvatar className={classes.icons}>
                <IconButton>
                  <EditIcon></EditIcon>
                </IconButton>
              </ListItemAvatar>
            </ListItem>
          </List>
        </div>
      </Layout>
    );
  }
}

export default withStyles(styles, { withTheme: true })(YourSettings);
