import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import React, { Component } from 'react';

export let openConfirmDialogExternal;

class Confirmer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      title: 'Are you sure?',
      message: '',
      onAnswer: null,
    };
    openConfirmDialogExternal = this.openConfirmDialog.bind(this);
    this.handleYes = this.handleYes.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  // will pass in async CRUD function from outside/so this component is reusable
  openConfirmDialog({ title, message, onAnswer }) {
    this.setState({ open: true, title, message, onAnswer });
  }

  handleYes() {
    this.setState({ open: false });
    this.state.onAnswer(true);
  }

  handleClose() {
    this.setState({ open: false });
    this.state.onAnswer(false);
  }

  render() {
    const { open, title, message } = this.state;
    return (
      <Dialog open={open} onClose={this.handleClose}>
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ padding: '10px' }}>
          <Button onClick={this.handleClose} variant="outlined" color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleYes} variant="contained" color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default Confirmer;
