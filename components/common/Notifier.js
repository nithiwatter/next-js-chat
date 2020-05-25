import Snackbar from '@material-ui/core/Snackbar';
import React, { Component } from 'react';

export let openSnackbarExternal;

class Notifier extends Component {
  constructor(props) {
    super(props);
    this.state = { open: false, message: '' };
    this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
    openSnackbarExternal = this.handleSnackbarOpen.bind(this);
  }

  handleSnackbarClose() {
    this.setState({ open: false, message: '' });
  }

  handleSnackbarOpen({ message }) {
    this.setState({ open: true, message });
  }

  render() {
    const { open, message } = this.state;
    return (
      <React.Fragment>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          message={message}
          autoHideDuration={5000}
          onClose={this.handleSnackbarClose}
          open={open}
        />
      </React.Fragment>
    );
  }
}

export default Notifier;
