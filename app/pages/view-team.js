import React, { Component } from 'react';
import Layout from '../components/layout';
import withAuth from '../lib/withAuth';
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'next/router';
import { observer } from 'mobx-react';
import { withStyles, fade } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import SearchIcon from '@material-ui/icons/Search';
import ChatIcon from '@material-ui/icons/Chat';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Badge from '@material-ui/core/Badge';
import AttachmentIcon from '@material-ui/icons/Attachment';
import Paper from '@material-ui/core/Paper';

const styles = (theme) => ({
  root: {
    backgroundColor: '#1976d2',
    color: 'white',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  type: {
    width: '100%',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeInput: {
    width: '100%',
  },
  typeInputInput: {
    paddingLeft: theme.spacing(4),
    color: 'white',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  footer: {
    width: '100%',
    top: 'auto',
    bottom: 0,
    backgroundColor: '#1565c0',
  },
  chatPane: {
    height: '100%',
    width: '100%',
  },
});

class ViewTeam extends Component {
  state = {};
  render() {
    const { router, rootStore, user, classes, firstGridItem } = this.props;

    if (rootStore.teams.length === 0)
      return (
        <Layout {...this.props}>
          <div
            style={{
              height: '100%',
              padding: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="h2"
              align="center"
              style={{ marginTop: '1rem' }}
            >
              You have no team yet. Create one.
            </Typography>
          </div>
        </Layout>
      );
    return (
      <Layout user={user} rootStore={rootStore} firstGridItem={firstGridItem}>
        <AppBar position="absolute" elevation={0} className={classes.root}>
          <Toolbar>
            <Typography variant="h6">Chat</Typography>
            <div className={classes.grow}></div>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
              />
            </div>
            <IconButton>
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>

        <Paper className={classes.chatPane} elevation={0}></Paper>
        <AppBar position="absolute" elevation={0} className={classes.footer}>
          <Toolbar>
            <IconButton style={{ marginRight: '1rem' }}>
              <AttachmentIcon></AttachmentIcon>
            </IconButton>
            <div className={classes.type}>
              <InputBase
                placeholder="Start typing…"
                classes={{
                  root: classes.typeInput,
                  input: classes.typeInputInput,
                }}
              />
            </div>
          </Toolbar>
        </AppBar>
      </Layout>
    );
  }
}

export default withStyles(styles)(
  withAuth(withRouter(observer(ViewTeam)), {
    loginRequired: true,
    logoutRequired: false,
  })
);
