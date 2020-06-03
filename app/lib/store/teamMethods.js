import { sortBy, findIndex } from 'lodash';
import axios from 'axios';
import { runInAction } from 'mobx';

function sortByAlphabet(array) {
  return sortBy(array, [
    function (object) {
      return object.name;
    },
  ]);
}

export function addTeam(newTeam) {
  this.switchToGroup();
  // offline for previous team
  if (this.currentTeam) {
    this.socket.emit('offline', [this.currentTeam._id, this.userStore._id]);
  }
  const teams = [...this.teams, newTeam];
  this.teams = sortByAlphabet(teams);
  this.currentTeam = newTeam;
  this.channels = [];
  this.currentChannel = null;
  const currentUser = this.userStore;
  this.currentUsers = [
    {
      _id: currentUser._id,
      displayName: currentUser.displayName,
      email: currentUser.email,
      avatarUrl: currentUser.avatarUrl,
    },
  ];
  this.messages = [];
  this.socket.emit('subscribe', newTeam._id); // subscribe to this new team for notifications
  this.socket.emit('online', [newTeam._id, this.userStore._id]); // should now be online for this new team
}

export async function selectTeam(teamId) {
  this.switchToGroup();
  // cannot click twice
  if (teamId === this.currentTeam._id) return;

  // emit offline for the previous team
  this.socket.emit('offline', [this.currentTeam._id, this.userStore._id]);

  const idx = findIndex(this.teams, (team) => team._id === teamId);
  this.currentTeam = this.teams[idx];

  const result = await Promise.all([
    axios.post(
      `${process.env.URL_API}/api/v1/team-member/get-channels`,
      {
        teamId: this.teams[idx]._id,
      },
      { withCredentials: true }
    ),
    axios.post(
      `${process.env.URL_API}/api/v1/team-member/get-team-members`,
      {
        teamId: this.teams[idx]._id,
      },
      { withCredentials: true }
    ),
  ]);

  let channels = result[0].data.channels;
  let messages = result[0].data.messages;
  channels = sortByAlphabet(channels);
  const currentUsers = result[1].data.currentUsers;

  runInAction(() => {
    this.channels = channels;
    this.currentUsers = currentUsers;
    this.messages = messages;
    if (channels.length > 0) {
      this.currentChannel = channels[0];
    } else {
      this.currentChannel = null;
    }
    // emit online for the new team
    this.socket.emit('online', [this.currentTeam._id, this.userStore._id]);
  });
}

export async function deleteTeam(teamId) {
  const newTeams = this.teams.filter((team) => team._id !== teamId);

  // deleting pending acceptances if the team is no longer there
  const pendingAcceptances = this.pendingAcceptances.filter(
    (invitation) => invitation.teamId !== teamId
  );
  this.pendingAcceptances = pendingAcceptances;

  if (teamId !== this.currentTeam._id) {
    this.teams = newTeams;
    return;
  }

  if (newTeams.length > 0) {
    // get channels information from the first team available
    const { data } = await axios.post(
      `${process.env.URL_API}/api/v1/team-member/get-channels`,
      {
        teamId: newTeams[0]._id,
      },
      { withCredentials: true }
    );
    const channels = data.channels;

    runInAction(() => {
      this.teams = newTeams;
      this.currentTeam = newTeams[0];
      this.channels = channels;
      if (channels.length > 0) {
        this.currentChannel = channels[0];
        this.messages = data.messages;
      } else {
        this.currentChannel = null;
        this.messages = [];
      }
    });
    this.socket.emit('online', [newTeams[0]._id, this.userStore._id]);
  } else {
    this.teams = [];
    this.currentTeam = null;
    this.channels = [];
    this.currentChannel = null;
    this.messages = [];
  }
  this.socket.emit('leave-team', teamId);
}
