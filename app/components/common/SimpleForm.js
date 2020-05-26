import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export let openSimpleFormExternal;

class SimpleForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      onSubmit: null,
      title: "",
      description: "",
      value: "",
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    openSimpleFormExternal = this.openForm.bind(this);
  }

  handleClose() {
    this.setState({ open: false, value: "" });
    this.state.onSubmit(false);
  }

  handleSubmit() {
    this.state.onSubmit(true, this.state.value);
    this.setState({ open: false, value: "" });
  }

  handleInputChange(e) {
    this.setState({ value: e.target.value });
  }

  openForm({ onSubmit, title, description }) {
    this.setState({ open: true, onSubmit, title, description });
  }

  render() {
    return (
      <div>
        <Dialog open={this.state.open} onClose={this.handleClose}>
          <DialogTitle id="form-dialog-title">
            Customize Your Profile
          </DialogTitle>
          <DialogContent>
            <DialogContentText>{this.state.description}</DialogContentText>
            <TextField
              autoComplete="off"
              autoFocus
              margin="dense"
              id="name"
              label={this.state.title}
              fullWidth
              onChange={this.handleInputChange}
              value={this.state.value}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleSubmit} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default SimpleForm;
