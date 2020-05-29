import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { observer } from 'mobx-react';
import GroupIcon from '@material-ui/icons/Group';
import axios from 'axios';
import { openSimpleFormExternal } from './SimpleForm';

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.handleAddTeam = this.handleAddTeam.bind(this);
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
  }
  render() {
    const { rootStore } = this.props;
    return (
      <div style={{ width: '100%', height: '80%', border: '1px solid white' }}>
        <Button
          variant="contained"
          style={{ margin: '1rem 0', width: '100%' }}
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
        <Typography variant="h5" style={{ marginLeft: '1rem' }}>
          Teams
        </Typography>

        <div
          style={{
            maxHeight: '30%',
            overflow: 'auto',
            marginTop: '1rem',
            marginBottom: '1rem',
            border: '1px solid red',
          }}
        >
          <List>
            {rootStore.teams.map((team) => (
              <ListItem
                button
                key={team._id}
                onClick={() => rootStore.selectTeam(team._id)}
              >
                <ListItemIcon>
                  <GroupIcon></GroupIcon>
                </ListItemIcon>
                <ListItemText primary={team.name} />
              </ListItem>
            ))}
          </List>
        </div>

        {rootStore.teams.length > 0 ? (
          <React.Fragment>
            <Typography variant="h5" style={{ marginLeft: '1rem' }}>
              {rootStore.currentTeam.name}'s Channels
            </Typography>
            <Button variant="contained">Invite</Button>
            <Button variant="contained">Add Channel</Button>
            <div
              style={{
                maxHeight: '30%',
                overflow: 'auto',
                marginTop: '1rem',
                border: '1px solid red',
              }}
            >
              <List>
                <ListItem button>
                  <ListItemText primary="hello"></ListItemText>
                </ListItem>
                <ListItem button>
                  <ListItemText primary="hello"></ListItemText>
                </ListItem>
                <ListItem button>
                  <ListItemText primary="hello"></ListItemText>
                </ListItem>
                <ListItem button>
                  <ListItemText primary="hello"></ListItemText>
                </ListItem>
              </List>
            </div>
          </React.Fragment>
        ) : null}
      </div>
    );
  }
}

export default observer(Sidebar);
