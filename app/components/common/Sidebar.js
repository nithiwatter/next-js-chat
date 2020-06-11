import React, { Component } from 'react';
import Teams from './Teams';
import Channels from './Channels';
import OnlineUsers from './OnlineUsers';
import Dots from './Dots';
import axios from 'axios';
import notify from '../../lib/notify';
import confirm from '../../lib/confirm';
import { withStyles } from '@material-ui/core/styles';
import { openSimpleFormExternal } from './SimpleForm';
import Carousel from '@brainhubeu/react-carousel';
import { observer } from 'mobx-react';
import GroupIcon from '@material-ui/icons/Group';
import ChatIcon from '@material-ui/icons/Chat';
import PersonIcon from '@material-ui/icons/Person';
import IconButton from '@material-ui/core/IconButton';
import NoteIcon from '@material-ui/icons/Note';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = (theme) => ({
  container: {
    width: '100%',
    height: '90vh',
    display: 'flex',
    overflow: 'hidden',
  },
  icons: {
    width: '80px',
    height: '90vh',
    display: 'flex',
    flexDirection: 'column',
  },
  icon: {
    margin: '0 auto',
  },
  display: {
    flexGrow: 1,
    height: '90vh',
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  paper: {
    width: '100%',
    height: '100vh',
    paddingTop: theme.spacing(1),
  },
  on: {
    display: 'block',
  },
  off: {
    display: 'none',
  },
  selected: {
    color: theme.palette.blue.main,
  },
});

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.handleSearchUser = this.handleSearchUser.bind(this);
    this.handleAddTeam = this.handleAddTeam.bind(this);
    this.handleAddChannel = this.handleAddChannel.bind(this);
    this.handleDeleteTeam = this.handleDeleteTeam.bind(this);
    this.handleDeleteChannel = this.handleDeleteChannel.bind(this);
    this.handleInvite = this.handleInvite.bind(this);
    this.handleTabSwitch = this.handleTabSwitch.bind(this);
  }

  handleTabSwitch(newValue) {
    this.props.rootStore.changeTab(newValue);
  }

  handleSearchUser(status, value) {
    if (!status) return;

    if (value === '') return notify('A user is required');

    this.props.rootStore.switchToDM(false, false, value);
  }

  async handleAddTeam(status, value) {
    try {
      if (!status) return;

      if (value === '') return notify('A team name is required');
      const { data } = await axios.post(
        `${process.env.URL_API}/api/v1/team-member/add-team`,
        {
          userId: this.props.user._id,
          name: value,
        },
        { withCredentials: true }
      );
      this.props.rootStore.addTeam(data.team);
      notify('You successfully created a new team');
    } catch (err) {
      console.log(err);
      const { data } = err.response;
      notify(data.err);
    }
  }

  async handleAddChannel(status, value) {
    try {
      if (!status) return;

      if (value === '') return notify('A channel name is required');
      const { data } = await axios.post(
        `${process.env.URL_API}/api/v1/team-member/add-channel`,
        {
          teamId: this.props.rootStore.currentTeam._id,
          name: value,
        },
        { withCredentials: true }
      );
      console.log(data);
      this.props.rootStore.addChannel(data.channel);
      notify('You successfully created a new channel');
      this.props.rootStore.socket.emit('add-channel', data.channel);
    } catch (err) {
      const { data } = err.response;
      notify(data.err);
    }
  }

  async handleInvite(teamId, teamName) {
    openSimpleFormExternal({
      onSubmit: async (status, value) => {
        try {
          if (!status) return;

          if (value === '') return notify('An email is required');

          const { data } = await axios.post(
            `${process.env.URL_API}/api/v1/team-member/invite-to-team`,
            {
              userEmail: value,
              teamId,
              teamName,
              inviterId: this.props.user._id,
              inviterEmail: this.props.user.email,
            },
            { withCredentials: true }
          );
          notify('You successfully invited this person.');
          this.props.rootStore.invite(data.invitation);
          // set up a ws to track if another person has accepted
          this.props.rootStore.socket.emit('invite', data.invitation);
        } catch (err) {
          console.log(err);
          const { data } = err.response;
          notify(data.err);
        }
      },
      title: 'Your New Invitee Email',
      description: 'Please enter your new invitee email.',
    });
  }

  handleDeleteTeam(teamId) {
    confirm({
      title: 'Are you sure to delete this team?',
      message:
        'This is a permanent action. All associated channels and messages will be deleted.',
      onAnswer: async (answer) => {
        if (!answer) return;

        try {
          await axios.post(
            `${process.env.URL_API}/api/v1/team-member/delete-team`,
            {
              teamId,
            },
            { withCredentials: true }
          );
          this.props.rootStore.deleteTeam(teamId);
          this.props.rootStore.socket.emit('delete-team', teamId);
        } catch (err) {
          const { data } = err.response;
          notify(data.err);
        }
      },
    });
  }

  handleDeleteChannel(channelId) {
    confirm({
      title: 'Are you sure to delete this channel?',
      message: 'This is a permanent action.',
      onAnswer: async (answer) => {
        if (!answer) return;

        try {
          await axios.post(
            `${process.env.URL_API}/api/v1/team-member/delete-channel`,
            {
              channelId,
            },
            { withCredentials: true }
          );
          this.props.rootStore.deleteChannel(channelId);
          this.props.rootStore.socket.emit('delete-channel', [
            channelId,
            this.props.rootStore.currentTeam._id,
          ]);
        } catch (err) {
          const { data } = err.response;
          notify(data.err);
        }
      },
    });
  }

  render() {
    const { rootStore, classes } = this.props;
    return (
      <div className={classes.container}>
        <div className={classes.icons}>
          <div className={classes.icon}>
            <IconButton onClick={() => this.handleTabSwitch(3)}>
              <NoteIcon
                className={rootStore.currentTab === 3 ? classes.selected : null}
              ></NoteIcon>
            </IconButton>
          </div>
          <div className={classes.icon}>
            <IconButton onClick={() => this.handleTabSwitch(0)}>
              <GroupIcon
                className={rootStore.currentTab === 0 ? classes.selected : null}
              ></GroupIcon>
            </IconButton>
          </div>
          <div className={classes.icon}>
            <IconButton onClick={() => this.handleTabSwitch(1)}>
              <ChatIcon
                className={rootStore.currentTab === 1 ? classes.selected : null}
              ></ChatIcon>
            </IconButton>
          </div>
          <div className={classes.icon}>
            <IconButton onClick={() => this.handleTabSwitch(2)}>
              <PersonIcon
                className={rootStore.currentTab === 2 ? classes.selected : null}
              ></PersonIcon>
            </IconButton>
          </div>
        </div>
        <div className={classes.display}>
          <Paper className={classes.paper}>
            <div
              className={rootStore.currentTab === 0 ? classes.on : classes.off}
            >
              <Teams
                rootStore={rootStore}
                handleAddTeam={this.handleAddTeam}
                handleSearchUser={this.handleSearchUser}
                handleDeleteTeam={this.handleDeleteTeam}
                handleInvite={this.handleInvite}
              ></Teams>
            </div>
            <div
              className={rootStore.currentTab === 1 ? classes.on : classes.off}
            >
              <Channels
                rootStore={rootStore}
                handleAddChannel={this.handleAddChannel}
                handleDeleteChannel={this.handleDeleteChannel}
              ></Channels>
            </div>
            <div
              className={rootStore.currentTab === 2 ? classes.on : classes.off}
            >
              <OnlineUsers
                rootStore={rootStore}
                handleSearchUser={this.handleSearchUser}
              ></OnlineUsers>
            </div>
          </Paper>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(observer(Sidebar));
