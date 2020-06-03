import { sortBy } from 'lodash';
import axios from 'axios';
import { runInAction } from 'mobx';
import notify from '../notify';

// the person doing the inviting gets a pending acceptance
export function invite(invitation) {
  this.pendingAcceptances.push(invitation);
}

// the person getting invited gets a pending invitation
export function newInvitation(invitation) {
  this.pendingInvitations.push(invitation);
}

export function clearPendingInvitation(invitationId) {
  this.pendingInvitations = this.pendingInvitations.filter(
    (invitation) => invitation._id !== invitationId
  );
}

export function clearPendingAcceptance(invitationId) {
  this.pendingAcceptances = this.pendingAcceptances.filter(
    (invitation) => invitation._id !== invitationId
  );
}

export async function acceptedInvitation(invitationId, teamId, userId) {
  // clear the pending acceptance since someone just accepted it
  this.clearPendingAcceptance(invitationId);
  notify('Someone accepted your invitation. Please check.');

  // if you are already on the team, needs to update online users view
  // need to consider security issue for this part
  if (this.currentTeam._id === teamId) {
    const { data } = await axios.post(
      `${process.env.URL_API}/api/v1/team-member/get-accepted-user`,
      {
        userId,
      },
      { withCredentials: true }
    );
    runInAction(() => {
      data.user.online = true;
      this.currentUsers.push(data.user);
    });
  }
}

export function rejectedInvitation(invitationId) {
  this.clearPendingAcceptance(invitationId);
  notify('Someone just rejected your invitation. :(');
}

export async function getAcceptedTeam(teamId) {
  // accepting immediately changes view to the accepted team - offline to the previous team
  if (this.currentTeam) {
    this.socket.emit('offline', [this.currentTeam._id, this.userStore._id]);
  }

  const { data } = await axios.post(
    `${process.env.URL_API}/api/v1/team-member/get-team`,
    {
      teamId,
    },
    { withCredentials: true }
  );

  // return promise - need to wait before this user finishes loading everything - before notifying other users by socket
  return new Promise((resolve) => {
    runInAction(() => {
      const teams = [...this.teams];
      teams.push(data.team);
      this.teams = sortBy(teams, [
        function (team) {
          return team.name;
        },
      ]);
      this.currentTeam = data.team;
      this.channels = data.channels;
      if (data.channels.length > 0) {
        this.currentChannel = data.channels[0];
      } else {
        this.currentChannel = null;
      }
      this.messages = data.messages;
      this.currentUsers = data.currentUsers;
      this.socket.emit('subscribe', teamId);
      this.socket.emit('online', [data.team._id, this.userStore._id]);
      resolve('done fetching');
    });
  });
}
