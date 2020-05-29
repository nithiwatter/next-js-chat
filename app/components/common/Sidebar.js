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
import Typography from '@material-ui/core/Typography';
import { observer } from 'mobx-react';
import GroupIcon from '@material-ui/icons/Group';
import axios from 'axios';
import notify from '../../lib/notify';
import { withRouter } from 'next/router';
import { openSimpleFormExternal } from './SimpleForm';

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.handleAddTeam = this.handleAddTeam.bind(this);
    this.handleAddChannel = this.handleAddChannel.bind(this);
  }

  async handleAddTeam(status, value) {
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

  render() {
    console.log('render');
    const { rootStore, router } = this.props;
    return (
      <div style={{ width: '100%', height: '90vh' }}>
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
            variant="outlined"
            onClick={() => {
              openSimpleFormExternal({
                onSubmit: this.handleAddTeam,
                title: 'Your Team',
                description: 'Please enter your new team',
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
                <ListItemText primary={team.name} />
                <ListItemIcon>
                  <IconButton
                    size="small"
                    style={{ marginRight: '0.5rem' }}
                    // onClick={(e) => {
                    //   e.stopPropagation();
                    //   router.push('/view-team?team=a');
                    // }}
                  >
                    <GroupIcon></GroupIcon>
                  </IconButton>
                  <IconButton size="small" onClick={(e) => e.stopPropagation()}>
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
                    <ListItemText primary={channel.name}></ListItemText>
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

export default withRouter(observer(Sidebar));
