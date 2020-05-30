import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Button from '@material-ui/core/Button';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Typography from '@material-ui/core/Typography';
import { observer } from 'mobx-react';
import GroupIcon from '@material-ui/icons/Group';
import axios from 'axios';
import notify from '../../lib/notify';
import confirm from '../../lib/confirm';
import { withRouter } from 'next/router';
import { withStyles } from '@material-ui/core/styles';
import { openSimpleFormExternal } from './SimpleForm';

const styles = (theme) => ({
  container: {
    width: '100%',
    height: '90vh',
  },
  name: {
    [theme.breakpoints.down('xs')]: {
      display: 'block',
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
        }
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
    if (!status) return;

    if (value === '') return notify('A channel name is required');
    const { data } = await axios.post(
      `${process.env.URL_API}/api/v1/team-member/add-channel`,
      {
        teamId: this.props.rootStore.currentTeam._id,
        name: value,
      }
    );
    console.log(data);
    this.props.rootStore.addChannel(data.channel);
    notify('You successfully created a new channel');
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
            }
          );
          console.log(data);
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
            }
          );
          this.props.rootStore.deleteTeam(teamId);
        } catch (err) {
          console.log(err);
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
            }
          );
          this.props.rootStore.deleteChannel(channelId);
        } catch (err) {
          console.log(err);
        }
      },
    });
  }

  render() {
    const { rootStore, classes } = this.props;
    return (
      <div className={classes.container}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6" style={{ marginLeft: '1rem' }}>
            Teams
          </Typography>
          <Button
            onClick={() => {
              openSimpleFormExternal({
                onSubmit: this.handleAddTeam,
                title: 'Your Team',
                description: 'Please enter your new team name',
              });
            }}
          >
            Add Team
          </Button>
        </div>

        <div
          style={{
            maxHeight: '35%',
            overflow: 'auto',
            marginTop: '1rem',
            marginBottom: '1rem',
          }}
        >
          <List>
            {rootStore.teams.map((team) => (
              <ListItem
                button
                key={team._id}
                onClick={() => rootStore.selectTeam(team._id)}
                selected={rootStore.currentTeam._id === team._id}
              >
                <ListItemAvatar>
                  <Avatar>{team.name[0].toUpperCase()}</Avatar>
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

        {rootStore.teams.length > 0 ? (
          <React.Fragment>
            <Divider></Divider>
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
              >
                <LibraryAddIcon></LibraryAddIcon>
              </IconButton>
            </div>

            <div
              style={{
                maxHeight: '35%',
                overflow: 'auto',
                marginTop: '1rem',
              }}
            >
              <List>
                {rootStore.channels.map((channel) => (
                  <ListItem
                    button
                    key={channel._id}
                    selected={rootStore.currentChannel._id === channel._id}
                    onClick={() => rootStore.selectChannel(channel._id)}
                  >
                    <ListItemAvatar>
                      <Avatar>{channel.name[0].toUpperCase()}</Avatar>
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
          </React.Fragment>
        ) : null}
      </div>
    );
  }
}

export default withStyles(styles)(observer(Sidebar));
