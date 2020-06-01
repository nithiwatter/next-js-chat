import React, { Component } from 'react';
import List from '@material-ui/core/List';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import ChatIcon from '@material-ui/icons/Chat';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Typography from '@material-ui/core/Typography';
import { observer } from 'mobx-react';
import GroupIcon from '@material-ui/icons/Group';
import axios from 'axios';
import GifIcon from '@material-ui/icons/Gif';
import notify from '../../lib/notify';
import confirm from '../../lib/confirm';
import { withRouter } from 'next/router';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import { withStyles } from '@material-ui/core/styles';
import { openSimpleFormExternal } from './SimpleForm';
import Badge from '@material-ui/core/Badge';

const styles = (theme) => ({
  container: {
    width: '100%',
    height: '90vh',
  },
  appbar: {
    width: '100%',
    backgroundColor: '#36c5f0',
    color: 'white',
  },
  selectedTeam: {
    backgroundColor: '#ecb22e',
  },
  selectedChannel: {
    backgroundColor: '#e01e5a',
  },
  indicator: {
    backgroundColor: 'white',
  },
  badge: {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      border: '1px solid currentColor',
      content: '""',
    },
  },
});

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.handleAddTeam = this.handleAddTeam.bind(this);
    this.handleAddChannel = this.handleAddChannel.bind(this);
    this.handleDeleteTeam = this.handleDeleteTeam.bind(this);
    this.handleDeleteChannel = this.handleDeleteChannel.bind(this);
    this.handleTabSwitch = this.handleTabSwitch.bind(this);
  }

  handleTabSwitch(e, newValue) {
    this.props.rootStore.changeTab(newValue);
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
      console.log(data);
      this.props.rootStore.addTeam(data.team);
      notify('You successfully created a new team');
    } catch (err) {
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
          console.log(data);
          notify('You successfully invited this person.');
          this.props.rootStore.invite(data.invitation);
          // set up a ws to track if another person has accepted
          this.props.rootStore.socket.emit('invite', data.invitation);
        } catch (err) {
          const { data } = err.response;
          notify(data.err);
        }
      },
      title: 'Your New Invitee Email',
      description: 'Please enter your new invitee email.',
    });
  }

  handleDeleteTeam(teamId) {
    console.log(teamId);
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
    console.log(channelId);
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
        <AppBar position="relative" elevation={0} className={classes.appbar}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Tabs
              value={rootStore.currentTab}
              onChange={this.handleTabSwitch}
              variant="scrollable"
              classes={{ indicator: classes.indicator }}
            >
              <Tab label="Teams" style={{ width: '10px' }} />
              <Tab label="Channels" />
              <Tab label="Direct Messages" />
            </Tabs>
          </div>
        </AppBar>

        <div
          hidden={rootStore.currentTab !== 0}
          style={{ height: '85%', overflow: 'auto' }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '1rem',
            }}
          >
            <Typography variant="h6" style={{ marginLeft: '1rem' }}>
              Teams
            </Typography>
            <IconButton
              onClick={() => {
                openSimpleFormExternal({
                  onSubmit: this.handleAddTeam,
                  title: 'Your Team',
                  description: 'Please enter your new team name',
                });
              }}
              style={{ marginRight: '1rem' }}
            >
              <LibraryAddIcon></LibraryAddIcon>
            </IconButton>
          </div>

          <div>
            <List>
              {rootStore.teams.map((team) => (
                <ListItem
                  button
                  disableRipple
                  key={team._id}
                  onClick={() => rootStore.selectTeam(team._id)}
                  selected={rootStore.currentTeam._id === team._id}
                >
                  <ListItemAvatar>
                    <Avatar
                      variant="rounded"
                      className={
                        team._id === rootStore.currentTeam._id
                          ? classes.selectedTeam
                          : null
                      }
                      style={{ color: 'white' }}
                    >
                      {team.name[0].toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={team.name} className={classes.name} />
                  <ListItemIcon style={{ marginLeft: 'auto' }}>
                    <IconButton
                      size="small"
                      style={{ marginRight: '0.5rem' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        this.handleInvite(team._id, team.name);
                      }}
                    >
                      <GroupIcon></GroupIcon>
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        this.handleDeleteTeam(team._id);
                      }}
                    >
                      <DeleteIcon></DeleteIcon>
                    </IconButton>
                  </ListItemIcon>
                </ListItem>
              ))}
            </List>
          </div>
        </div>

        {rootStore.teams.length > 0 ? (
          <div
            hidden={rootStore.currentTab !== 1}
            style={{ height: '85%', overflow: 'auto' }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '1rem',
              }}
            >
              <Typography variant="h6" style={{ marginLeft: '1rem' }}>
                {rootStore.currentTeam.name}'s Channels
              </Typography>
              <IconButton
                onClick={() => {
                  openSimpleFormExternal({
                    onSubmit: this.handleAddChannel,
                    title: 'Your Channel',
                    description: 'Please enter your new channel name',
                  });
                }}
                style={{ marginRight: '1rem' }}
              >
                <LibraryAddIcon></LibraryAddIcon>
              </IconButton>
            </div>

            <div>
              <List>
                {rootStore.channels.map((channel) => (
                  <ListItem
                    disableRipple
                    button
                    key={channel._id}
                    selected={rootStore.currentChannel._id === channel._id}
                    onClick={() => rootStore.selectChannel(channel._id)}
                  >
                    <ListItemAvatar>
                      <Avatar
                        className={
                          channel._id === rootStore.currentChannel._id
                            ? classes.selectedChannel
                            : null
                        }
                        style={{ color: 'white' }}
                      >
                        {channel.name[0].toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={channel.name}
                      className={classes.name}
                    ></ListItemText>
                    <ListItemIcon style={{ marginLeft: 'auto' }}>
                      <IconButton
                        size="small"
                        style={{ marginRight: '0.5rem' }}
                        // onClick={(e) => {
                        //   e.stopPropagation();
                        //   router.push('/view-team?team=a');
                        // }}
                      >
                        <EditIcon></EditIcon>
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          this.handleDeleteChannel(channel._id);
                        }}
                      >
                        <DeleteIcon></DeleteIcon>
                      </IconButton>
                    </ListItemIcon>
                  </ListItem>
                ))}
              </List>
            </div>
          </div>
        ) : null}

        {rootStore.teams.length > 0 ? (
          <div
            hidden={rootStore.currentTab !== 2}
            style={{ height: '85%', overflow: 'auto' }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '1rem',
              }}
            >
              <Typography variant="h6" style={{ marginLeft: '1rem' }}>
                Currently in {rootStore.currentTeam.name}
              </Typography>
              <IconButton style={{ marginRight: '1rem' }}>
                <VerifiedUserIcon></VerifiedUserIcon>
              </IconButton>
            </div>

            <div>
              <List>
                {rootStore.currentUsers.map((user) => (
                  <ListItem disableRipple button key={user._id}>
                    <ListItemAvatar>
                      <Badge
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right',
                        }}
                        overlap="circle"
                        variant="dot"
                        classes={{ badge: classes.badge }}
                      >
                        <Avatar src={user.avatarUrl} style={{ color: 'white' }}>
                          {user.displayName[0].toUpperCase()}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText primary={user.displayName}></ListItemText>
                    <ListItemIcon style={{ marginLeft: 'auto' }}>
                      <IconButton
                        size="small"
                        style={{ marginRight: '0.5rem' }}
                        // onClick={(e) => {
                        //   e.stopPropagation();
                        //   router.push('/view-team?team=a');
                        // }}
                      >
                        <ChatIcon></ChatIcon>
                      </IconButton>
                      <IconButton size="small">
                        <GifIcon></GifIcon>
                      </IconButton>
                    </ListItemIcon>
                  </ListItem>
                ))}
              </List>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default withStyles(styles)(observer(Sidebar));
