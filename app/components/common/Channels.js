import React, { Component } from 'react';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { openSimpleFormExternal } from './SimpleForm';
import Avatar from '@material-ui/core/Avatar';
import EditIcon from '@material-ui/icons/Edit';
import { observer } from 'mobx-react';

const styles = (theme) => ({
  selectedChannel: {
    backgroundColor: theme.palette.blue.main,
  },
  listText: {
    overflow: 'hidden',
    whiteSpace: 'noWrap',
    textOverflow: 'ellipsis',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
    [theme.breakpoints.down('xs')]: {
      display: 'block',
    },
  },
  listItem: {
    borderRadius: 8,
  },
});

class Channels extends Component {
  state = {};
  render() {
    const { classes, rootStore } = this.props;
    return (
      <div style={{ width: '100%' }}>
        {rootStore.teams.length > 0 ? (
          <div
            style={{
              height: '80vh',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="h6" style={{ marginLeft: '1rem' }}>
                {rootStore.currentTeam.name}'s Channels
              </Typography>
              <IconButton
                onClick={() => {
                  openSimpleFormExternal({
                    onSubmit: this.props.handleAddChannel,
                    title: 'Your Channel',
                    description: 'Please enter your new channel name',
                  });
                }}
                style={{ marginRight: '1rem' }}
              >
                <LibraryAddIcon></LibraryAddIcon>
              </IconButton>
            </div>

            <div
              style={{
                paddingLeft: '1rem',
                paddingRight: '1rem',
                overflowY: 'auto',
                height: '75vh',
              }}
            >
              <List>
                {rootStore.channels.map((channel) => (
                  <ListItem
                    disableRipple
                    button
                    key={channel._id}
                    selected={rootStore.currentChannel._id === channel._id}
                    onClick={() => rootStore.selectChannel(channel._id)}
                    classes={{
                      root: classes.listItem,
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        className={
                          channel._id === rootStore.currentChannel._id
                            ? classes.selectedChannel
                            : null
                        }
                        variant="rounded"
                        style={{ color: 'white' }}
                      >
                        {channel.name[0].toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={channel.name}
                      secondary={
                        channel.messages
                          ? channel.messages.text
                          : 'No message yet'
                      }
                      className={classes.name}
                      classes={{
                        primary: classes.listText,
                        secondary: classes.listText,
                      }}
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
                          this.props.handleDeleteChannel(channel._id);
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
      </div>
    );
  }
}

export default withStyles(styles)(observer(Channels));
