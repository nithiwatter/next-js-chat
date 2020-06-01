import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { observer } from 'mobx-react';
import dateFormat from 'dateformat';

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column-reverse',
    height: '100%',
    overflowY: 'auto',
    gridRow: '2',
    gridColumn: '1',
    padding: theme.spacing(2),
  },
  bubbleContainer: {
    display: 'flex',
    maxWidth: '20rem',
    alignItems: 'center',
  },
  bubbleContainerSelf: {
    display: 'flex',
    maxWidth: '20rem',
    alignItems: 'center',
    flexDirection: 'row-reverse',
  },
  bubbleSelf: {
    color: 'white',
    borderRadius: '1rem',
    backgroundColor: '#36c5f0',
    fontSize: '1rem',
    padding: '0.8rem',
    width: 'auto',
    margin: 0,
  },
  bubble: {
    color: 'white',
    borderRadius: '1rem',
    backgroundColor: '#2eb67d',
    fontSize: '1rem',
    padding: '0.8rem',
    width: 'auto',
    margin: 0,
  },
  date: {
    margin: 0,
    marginLeft: '1rem',
    marginRight: '1rem',
  },
  overallContainer: {
    display: 'flex',
    marginTop: '0.3rem',
  },
  overallContainerSelf: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '0.3rem',
  },
});

class Messages extends Component {
  state = {};
  render() {
    const { rootStore, classes, user } = this.props;
    return (
      <div className={classes.container}>
        <div>
          {rootStore.messages.map((message) => (
            <div
              key={message._id}
              className={
                user._id === message.userId
                  ? classes.overallContainerSelf
                  : classes.overallContainer
              }
            >
              <div
                className={
                  user._id === message.userId
                    ? classes.bubbleContainerSelf
                    : classes.bubbleContainer
                }
              >
                <Avatar
                  src={message.userAvatarUrl}
                  style={{ marginRight: '1rem', marginLeft: '1rem' }}
                ></Avatar>

                <div
                  className={
                    user._id === message.userId
                      ? classes.bubbleSelf
                      : classes.bubble
                  }
                >
                  {message.text}
                </div>
                <div className={classes.date}>
                  {dateFormat(new Date(message.createdAt), 'HH:MM')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(observer(Messages));
