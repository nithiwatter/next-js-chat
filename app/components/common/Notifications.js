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

const styles = (theme) => ({});

class Notifications extends Component {
  state = {};
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
              secondary={`A new pending invitation waiting for you to respond`}
            />
            <ListItemIcon>
              <ThumbUpIcon></ThumbUpIcon>
            </ListItemIcon>
            <ListItemIcon>
              <ThumbDownIcon></ThumbDownIcon>
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
            </ListItem>
          ))}
        </List>
        <List></List>
      </div>
    );
  }
}

export default withStyles(styles)(observer(Notifications));
