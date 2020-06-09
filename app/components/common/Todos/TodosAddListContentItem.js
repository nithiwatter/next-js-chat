import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import { Icon } from '@material-ui/core';

const styles = (theme) => ({
  wrapper: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    cursor: 'text',
    paddingLeft: theme.spacing(2),
    borderTop: '1px solid transparent',
    borderBottom: '1px solid transparent',
  },
  wrapperBorders: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    cursor: 'text',
    paddingLeft: theme.spacing(2),
    borderTop: '1px solid rgba(255, 255, 255, 0.15)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
  },
  inputTextWrapper: {
    paddingLeft: theme.spacing(2),
    width: '85%',
  },
  visible: {
    opacity: 100,
  },
  invisible: {
    opacity: 0,
  },
  icon: {
    margin: '5px 7px',
  },
});

class TodosAddListContentItem extends Component {
  constructor(props) {
    super(props);
    this.state = { active: false, hovered: false };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleActive = this.handleActive.bind(this);
    this.handleDisactive = this.handleDisactive.bind(this);
  }

  handleInputChange(e) {
    const newValue = e.target.value;
    this.props.todosStore.addListItemContentViaIcon(this.props.note, newValue);
  }

  handleActive() {
    this.setState({ active: true });
  }

  handleDisactive() {
    this.setState({ active: false });
  }

  render() {
    const { classes, inputRef } = this.props;
    const { active } = this.state;
    return (
      <div className={active ? classes.wrapperBorders : classes.wrapper}>
        <IconButton size="small" className={classes.icon}>
          <AddIcon></AddIcon>
        </IconButton>

        <InputBase
          classes={{ root: classes.inputTextWrapper }}
          value=""
          onChange={this.handleInputChange}
          onFocus={this.handleActive}
          onBlur={this.handleDisactive}
          placeholder="List Item"
          inputRef={inputRef}
          autoFocus
        ></InputBase>
      </div>
    );
  }
}

export default withStyles(styles)(TodosAddListContentItem);
