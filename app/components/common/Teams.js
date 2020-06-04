import React, { Component } from 'react';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import PageviewIcon from '@material-ui/icons/Pageview';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { openSimpleFormExternal } from './SimpleForm';
import { openSimpleSearchExternal } from './SimpleSearch';
import Avatar from '@material-ui/core/Avatar';
import Fade from '@material-ui/core/Fade';
import GroupIcon from '@material-ui/icons/Group';
import { observer } from 'mobx-react';

const styles = (theme) => ({
  selectedTeam: {
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

class Teams extends Component {
  state = {};
  render() {
    const { classes, rootStore } = this.props;
    return (
      <Fade in={true} timeout={1500}>
        <div style={{ height: '80vh', width: '100%' }}>
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
            <div>
              <IconButton
                onClick={() => {
                  openSimpleFormExternal({
                    onSubmit: this.props.handleAddTeam,
                    title: 'Your Team',
                    description: 'Please enter your new team name',
                  });
                }}
                style={{ marginRight: '1rem' }}
              >
                <LibraryAddIcon></LibraryAddIcon>
              </IconButton>
              <IconButton
                style={{ marginRight: '1rem' }}
                onClick={(e) => {
                  e.stopPropagation();
                  openSimpleSearchExternal({
                    onSubmit: this.props.handleSearchUser,
                    title: 'Your DM',
                    description: 'Please enter your new DM user',
                  });
                }}
              >
                <PageviewIcon></PageviewIcon>
              </IconButton>
            </div>
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
              {rootStore.teams.map((team) => (
                <ListItem
                  button
                  disableRipple
                  key={team._id}
                  onClick={() => rootStore.selectTeam(team._id)}
                  selected={rootStore.currentTeam._id === team._id}
                  classes={{
                    root: classes.listItem,
                  }}
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
                  <ListItemText
                    primary={team.name}
                    classes={{
                      primary: classes.listText,
                      secondary: classes.listText,
                    }}
                  ></ListItemText>
                  <ListItemIcon style={{ marginLeft: 'auto' }}>
                    <IconButton
                      size="small"
                      style={{
                        marginLeft: '0.5rem',
                        marginRight: '0.5rem',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        this.props.handleInvite(team._id, team.name);
                      }}
                    >
                      <GroupIcon></GroupIcon>
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        this.props.handleDeleteTeam(team._id);
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
      </Fade>
    );
  }
}

export default withStyles(styles)(observer(Teams));
