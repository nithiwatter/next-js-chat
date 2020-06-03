import React, { Component } from 'react';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { withStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react';
import IconButton from '@material-ui/core/IconButton';

const styles = (theme) => ({
  dots: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
  },
  dotsContainer: {
    width: '90%',
    backgroundColor: theme.palette.tbg.main,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    borderRadius: 15,
    marginBottom: theme.spacing(1),
  },
  selectedDot: {
    backgroundColor: theme.palette.blue.main,
    width: '8px',
    height: '8px',
    marginTop: '0.5rem',
    marginBottom: '0.5rem',
    marginLeft: '1rem',
    marginRight: '1rem',
    background: '#fff',
    borderRadius: '50%',
    display: 'block',
  },
  dot: {
    backgroundColor: theme.palette.sbg.main,
    width: '8px',
    height: '8px',
    marginTop: '0.5rem',
    marginBottom: '0.5rem',
    marginLeft: '1rem',
    marginRight: '1rem',
    background: '#fff',
    borderRadius: '50%',
    display: 'block',
  },
});

class Dots extends Component {
  state = {};
  render() {
    const { classes, rootStore } = this.props;
    return (
      <div className={classes.dots}>
        <div className={classes.dotsContainer}>
          <IconButton
            size="small"
            style={{ marginRight: '0.8rem' }}
            onClick={() => {
              if (rootStore.currentTab > 0) {
                this.props.handleTabSwitch(rootStore.currentTab - 1);
              }
            }}
          >
            <ArrowBackIcon></ArrowBackIcon>
          </IconButton>
          <div>
            <div
              className={
                rootStore.currentTab === 0 ? classes.selectedDot : classes.dot
              }
              onClick={() => this.props.handleTabSwitch(0)}
            ></div>
          </div>

          <div>
            <div
              className={
                rootStore.currentTab === 1 ? classes.selectedDot : classes.dot
              }
              onClick={() => this.props.handleTabSwitch(1)}
            ></div>
          </div>

          <div>
            <div
              className={
                rootStore.currentTab === 2 ? classes.selectedDot : classes.dot
              }
              onClick={() => this.props.handleTabSwitch(2)}
            ></div>
          </div>

          <IconButton
            size="small"
            style={{ marginLeft: '0.8rem' }}
            onClick={() => {
              if (rootStore.currentTab < 2) {
                this.props.handleTabSwitch(rootStore.currentTab + 1);
              }
            }}
          >
            <ArrowForwardIcon></ArrowForwardIcon>
          </IconButton>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(observer(Dots));
