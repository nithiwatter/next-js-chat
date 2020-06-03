import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import { observer } from 'mobx-react';
import Typography from '@material-ui/core/Typography';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import { IconButton } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import axios from 'axios';
import notify from '../../lib/notify';

const styles = (theme) => ({});

class Notifications extends Component {
  constructor(props) {
    super(props);
    this.handleAccept = this.handleAccept.bind(this);
    this.handleReject = this.handleReject.bind(this);
  }

  async handleAccept(userId, teamId, invitationId) {
    try {
      const { data } = await axios.post(
        `${process.env.URL_API}/api/v1/team-member/accept-invitation`,
        {
          invitationId,
          teamId,
          userId,
        },
        { withCredentials: true }
      );
      this.props.rootStore.clearPendingInvitation(invitationId);
      // fetch all the data about this new team/then subscribing done
      await this.props.rootStore.getAcceptedTeam(teamId);
      this.props.rootStore.socket.emit('acceptInvitation', [
        invitationId,
        teamId,
        userId,
      ]);
    } catch (err) {
      const { data } = err.response;
      notify(data.err);
      this.props.rootStore.clearPendingInvitation(invitationId);
    }
  }

  async handleReject(userId, invitationId) {
    try {
      const { data } = await axios.post(
        `${process.env.URL_API}/api/v1/team-member/reject-invitation`,
        {
          invitationId,
          userId,
        },
        { withCredentials: true }
      );
      this.props.rootStore.clearInvitation(invitationId);
      this.props.rootStore.socket.emit('rejectInvitation', [
        invitationId,
        userId,
      ]);
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const { classes, rootStore, user } = this.props;
    return (
      <div style={{ marginTop: '1rem', marginLeft: '2rem' }}>
        <Typography variant="h4">Notifications</Typography>

        {rootStore.pendingInvitations.map((invitation) => (
          <ListItem key={invitation._id}>
            <ListItemIcon>
              <AnnouncementIcon></AnnouncementIcon>
            </ListItemIcon>
            <ListItemText
              primary={invitation.teamName}
              secondary={`A new pending invitation from ${invitation.inviterEmail} waiting for you to respond`}
            />
            <ListItemIcon>
              <IconButton
                onClick={() =>
                  this.handleAccept(
                    invitation.userId,
                    invitation.teamId,
                    invitation._id
                  )
                }
              >
                <ThumbUpIcon></ThumbUpIcon>
              </IconButton>
            </ListItemIcon>
            <ListItemIcon>
              <IconButton
                onClick={() =>
                  this.handleReject(invitation.userId, invitation._id)
                }
              >
                <ThumbDownIcon></ThumbDownIcon>
              </IconButton>
            </ListItemIcon>
          </ListItem>
        ))}
        <List>
          {rootStore.pendingAcceptances.map((invitation) => (
            <ListItem key={invitation._id}>
              <ListItemIcon>
                <HourglassEmptyIcon></HourglassEmptyIcon>
              </ListItemIcon>
              <ListItemText
                primary={invitation.teamName}
                secondary={`An invitation waiting for ${invitation.userEmail} to respond`}
              />
              {invitation.accepted ? (
                <ListItemIcon>
                  <IconButton
                    onClick={() => {
                      rootStore.clearInvitation(invitation._id, true);
                    }}
                  >
                    <CheckCircleIcon></CheckCircleIcon>
                  </IconButton>
                </ListItemIcon>
              ) : null}
              {invitation.rejected ? (
                <ListItemIcon>
                  <IconButton
                    onClick={() => {
                      rootStore.clearInvitation(invitation._id, true);
                    }}
                  >
                    <ErrorIcon></ErrorIcon>
                  </IconButton>
                </ListItemIcon>
              ) : null}
            </ListItem>
          ))}
        </List>
        <List></List>
      </div>
    );
  }
}

export default withStyles(styles)(observer(Notifications));
