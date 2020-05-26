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
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import { withStyles } from "@material-ui/core/styles";
import Head from "next/head";
import EmailIcon from "@material-ui/icons/Email";

import SimpleForm, {
  openSimpleFormExternal,
} from "../components/common/SimpleForm";
import notify from "../lib/notify";
import { updateProfileApiMethod } from "../lib/api/public";

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
  input: {
    display: "none",
  },
});

async function onSubmit(status, value) {
  if (!status) return;

  if (value === "") return notify("A name is required");

  try {
    const user = await updateProfileApiMethod({ name: value });
    console.log(user);
  } catch (err) {
    console.log(err);
  }
}

class YourSettings extends Component {
  constructor(props) {
    super(props);
    this.state = { disabled: true, selectedFile: null };
    this.handleSelectFile = this.handleSelectFile.bind(this);
  }

  handleSelectFile(e) {
    this.setState({ selectedFile: e.target.files[0] });
  }

  render() {
    const { isMobile, firstGridItem, classes, theme } = this.props;
    const { disabled } = this.state;
    return (
      <Layout isMobile={isMobile} firstGridItem={firstGridItem}>
        <Head>
          <title>Your Settings at Async</title>
          <meta name="description" content="description" />
        </Head>
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
              <ListItemAvatar className={classes.icons}>
                <label htmlFor="icon-button-file">
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                  >
                    <PhotoCamera />
                  </IconButton>
                </label>
                <Button disabled={disabled}>Upload</Button>
              </ListItemAvatar>
            </ListItem>
            <ListItem>
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
            <ListItem>
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
                  <EmailIcon></EmailIcon>
                </IconButton>
              </ListItemAvatar>
            </ListItem>
            <Divider variant="middle" />
            <ListItem
              button
              onClick={() =>
                openSimpleFormExternal({
                  onSubmit,
                  title: "Your Name",
                  description: "Please enter your new name",
                })
              }
            >
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
          <SimpleForm></SimpleForm>
          <input
            accept="image/*"
            className={classes.input}
            id="icon-button-file"
            type="file"
            onChange={this.handleSelectFile}
          />
        </div>
      </Layout>
    );
  }
}

export default withStyles(styles, { withTheme: true })(YourSettings);
