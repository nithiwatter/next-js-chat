import React, { Component } from 'react';
import Layout from '../components/layout/index';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import { withStyles } from '@material-ui/core/styles';
import Head from 'next/head';
import EmailIcon from '@material-ui/icons/Email';
import {
  getSignedRequestApiMethod,
  uploadUsingSignedRequestApiMethod,
} from '../lib/api/team-member';
import SimpleForm, {
  openSimpleFormExternal,
} from '../components/common/SimpleForm';
import notify from '../lib/notify';
import { updateProfileApiMethod } from '../lib/api/public';
import withAuth from '../lib/withAuth';
import { observer } from 'mobx-react';

const styles = (theme) => ({
  title: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '2.75rem',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '2rem',
    },
  },
  root: {
    width: '90%',
    margin: '4rem auto',
    borderRadius: '5px',
    border: '2px solid',
    borderColor: theme.palette.secondary.main,
    backgroundColor: theme.palette.background.paper,
  },
  icons: {
    width: '80px',
    textAlign: 'center',
  },
  listItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    padding: theme.spacing(2, 2),
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
  input: {
    display: 'none',
  },
});

class YourSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: true,
      selectedFile: null,
    };
    this.handleSelectFile = this.handleSelectFile.bind(this);
    this.handleSubmitFile = this.handleSubmitFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  handleSelectFile(e) {
    this.setState({ selectedFile: e.target.files[0] });
  }

  async handleSubmitFile() {
    const { selectedFile } = this.state;
    if (selectedFile === null) return notify('A photo is required');

    const data = {
      fileType: selectedFile.type,
      prefix: this.props.user._id,
    };

    const response = await getSignedRequestApiMethod(data);
    console.log(response);

    await uploadUsingSignedRequestApiMethod(
      response.signedRequest,
      selectedFile,
      selectedFile.type
    );

    // need to uncache image when serving
    const { user } = this.props;
    user.updateProfile({
      avatarUrl: response.url,
      userId: this.props.user._id,
    });

    notify('You successfully uploaded your new profile photo. Please refresh.');
  }

  async onSubmit(status, value) {
    if (!status) return;

    if (value === '') return notify('A name is required');

    try {
      const { user } = this.props;
      user.updateProfile({
        name: value,
        userId: this.props.user._id,
      });

      notify('You successfully updated your new name.');
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const { isMobile, firstGridItem, classes, theme, user } = this.props;
    return (
      <Layout isMobile={isMobile} firstGridItem={firstGridItem} user={user}>
        <Head>
          <title>Your Settings at Async</title>
          <meta name="description" content="description" />
        </Head>
        <div
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
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
                <div>
                  <label htmlFor="icon-button-file">
                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="span"
                    >
                      <PhotoCamera />
                    </IconButton>
                  </label>
                  <Button
                    style={{ marginTop: '0.5rem' }}
                    onClick={this.handleSubmitFile}
                  >
                    Upload
                  </Button>
                </div>
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
                    height: '70px',
                    width: '70px',
                    fontSize: '2rem',
                    margin: '0 auto',
                  }}
                  src={user.avatarUrl}
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
                    {user.email}
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
                  onSubmit: this.onSubmit,
                  title: 'Your Name',
                  description: 'Please enter your new name',
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
                    {user.displayName}
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

export default withAuth(
  withStyles(styles, { withTheme: true })(observer(YourSettings)),
  {
    loginRequired: true,
    logoutRequired: false,
  }
);
