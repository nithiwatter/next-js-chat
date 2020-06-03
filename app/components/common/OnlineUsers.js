import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import IconButton from '@material-ui/core/IconButton';
import GifIcon from '@material-ui/icons/Gif';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import ChatIcon from '@material-ui/icons/Chat';
import { observer } from 'mobx-react';

const styles = (theme) => ({
  badge: {
    backgroundColor: 'grey',
    color: 'grey',
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
  selfBadge: {
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
  listItem: {
    borderRadius: 8,
  },
});

class OnlineUsers extends Component {
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
                Currently in {rootStore.currentTeam.name}
              </Typography>
              <IconButton style={{ marginRight: '1rem' }}>
                <VerifiedUserIcon></VerifiedUserIcon>
              </IconButton>
            </div>

            <div
              style={{
                paddingLeft: '1rem',
                paddingRight: '1rem',
                overflowY: 'auto',
                height: '70vh',
              }}
            >
              <List>
                {rootStore.currentUsers.map((user) => (
                  <ListItem
                    disableRipple
                    button
                    key={user._id}
                    classes={{
                      root: classes.listItem,
                    }}
                  >
                    <ListItemAvatar>
                      <Badge
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right',
                        }}
                        overlap="circle"
                        variant="dot"
                        classes={
                          user._id === rootStore.userStore._id || user.online
                            ? { badge: classes.selfBadge }
                            : { badge: classes.badge }
                        }
                      >
                        <Avatar src={user.avatarUrl} style={{ color: 'white' }}>
                          {user.displayName[0].toUpperCase()}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={user.displayName}
                      classes={{ primary: classes.listText }}
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

export default withStyles(styles)(observer(OnlineUsers));
