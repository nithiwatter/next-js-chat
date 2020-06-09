import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import { observer } from 'mobx-react';

const styles = (theme) => ({
  root: {
    display: 'flex',
    width: '100%',
    padding: theme.spacing(1, 0),
    alignItems: 'center',
  },
  // rootBorders: {
  //   display: 'flex',
  //   width: '100%',
  //   padding: theme.spacing(1, 0),
  //   alignItems: 'center',
  //   borderColor: theme.palette.grey[400],
  //   borderTop: '1px solid',
  //   borderBottom: '1px solid',
  // },
  inputTextWrapper: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    width: '95%',
  },
  icon: {
    opacity: 0,
  },
  iconOnFocus: {
    opacity: 100,
  },
  visible: {
    opacity: 100,
  },
  invisible: {
    opacity: 0,
  },
});

class TodosTextContent extends Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(e) {
    const newValue = e.target.value;

    this.props.todosStore.changeTextContent(newValue, this.props.creating);
  }

  render() {
    const { classes, note } = this.props;

    return (
      <div className={classes.root}>
        <InputBase
          placeholder="Take a note..."
          classes={{ root: classes.inputTextWrapper }}
          value={note.textContent}
          onChange={this.handleInputChange}
          multiline
        ></InputBase>
      </div>
    );
  }
}

export default withStyles(styles)(observer(TodosTextContent));
