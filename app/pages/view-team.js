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
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import AttachmentIcon from '@material-ui/icons/Attachment';
import Paper from '@material-ui/core/Paper';
import Messages from '../components/common/Messages';
import axios from 'axios';

const styles = (theme) => ({
  root: {
    backgroundColor: theme.palette.tbg.main,
    color: theme.palette.text.primary,
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
    color: theme.palette.text.primary,
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
    color: theme.palette.text.primary,
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
    backgroundColor: theme.palette.tbg.main,
    gridRow: '3',
    gridColumn: '1',
  },
  chatPane: {
    height: '100%',
    width: '100%',
    backgroundColor: theme.palette.bg.main,
  },
  paddingTop: {
    ...theme.mixins.toolbar,
    gridRow: '1',
    gridColumn: '1',
  },
  messageContainer: {
    height: '100vh',
    display: 'grid',
    gridTemplateColumns: '1',
    gridTemplateRows: 'auto 1fr auto',
    [theme.breakpoints.down('xs')]: {
      height: '90vh',
    },
  },
});

class ViewTeam extends Component {
  constructor(props) {
    super(props);
    this.state = { input: '' };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(e) {
    e.preventDefault();
    this.setState({ input: e.target.value });
  }

  async handleSubmit(e) {
    try {
      if (e.key === 'Enter') {
        const { data } = await axios.post(
          `${process.env.URL_API}/api/v1/team-member/add-message`,
          {
            userId: this.props.user._id,
            text: this.state.input,
            userEmail: this.props.user.email,
            userDisplayName: this.props.user.displayName,
            userAvatarUrl: this.props.user.avatarUrl,
            channelId: this.props.rootStore.currentChannel._id,
          },
          { withCredentials: true }
        );
        this.setState({ input: '' });
        this.props.rootStore.socket.emit('message', [
          this.props.rootStore.currentTeam._id,
          data.message,
        ]);
      }
    } catch (err) {
      console.log(err);
    }
  }
  render() {
    const { router, rootStore, user, classes, firstGridItem } = this.props;
    const { input } = this.state;

    if (rootStore.teams.length === 0)
      return (
        <Layout user={user} rootStore={rootStore} firstGridItem={firstGridItem}>
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

    if (!rootStore.currentChannel) {
      return (
        <Layout user={user} rootStore={rootStore} firstGridItem={firstGridItem}>
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
              You have no channel for this team yet. Create one.
            </Typography>
          </div>
        </Layout>
      );
    }
    return (
      <Layout user={user} rootStore={rootStore} firstGridItem={firstGridItem}>
        <AppBar position="absolute" elevation={0} className={classes.root}>
          <Toolbar>
            <Typography variant="h6">
              #{rootStore.currentChannel.name}
            </Typography>
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
          </Toolbar>
        </AppBar>

        <Paper className={classes.chatPane} elevation={0}>
          <div className={classes.messageContainer}>
            <div className={classes.paddingTop}></div>

            <Messages rootStore={rootStore} user={user}></Messages>

            <AppBar
              position="relative"
              elevation={0}
              className={classes.footer}
            >
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
                    value={input}
                    onChange={this.handleInputChange}
                    onKeyPress={this.handleSubmit}
                  />
                </div>
              </Toolbar>
            </AppBar>
          </div>
        </Paper>
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
