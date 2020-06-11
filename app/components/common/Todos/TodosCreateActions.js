import React, { Component } from 'react';
import PaletteIcon from '@material-ui/icons/Palette';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import LabelIcon from '@material-ui/icons/Label';
import IconButton from '@material-ui/core/IconButton';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { observer } from 'mobx-react';

const styles = (theme) => ({
  actionsWrapper: {
    display: 'flex',
    alignItems: 'center',
    width: '30%',
    padding: theme.spacing(1, 0),
  },
  actionsNarrowWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  icon: { marginLeft: theme.spacing(2), color: 'white' },
  narrowIcon: {
    color: 'white',
  },
  narrowIconDone: {
    color: 'white',
  },
});

class TodosCreateActions extends Component {
  constructor(props) {
    super(props);
    this.state = { anchorEl: null };
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClick(e) {
    e.stopPropagation();
    this.setState({ anchorEl: e.currentTarget });
  }

  handleClose(e) {
    e.stopPropagation();
    this.setState({ anchorEl: null });
    this.props.handleHoverOut();
  }

  render() {
    const { classes, todosStore, note, creating } = this.props;
    const { anchorEl } = this.state;

    return (
      <div
        className={
          creating ? classes.actionsWrapper : classes.actionsNarrowWrapper
        }
      >
        <IconButton
          size="small"
          className={creating ? classes.icon : classes.narrowIcon}
        >
          <PaletteIcon fontSize={creating ? 'default' : 'small'}></PaletteIcon>
        </IconButton>
        <IconButton
          size="small"
          className={creating ? classes.icon : classes.narrowIcon}
          onClick={() => todosStore.switchContent(note)}
          disabled={!note.checkbox}
        >
          <TextFieldsIcon
            fontSize={creating ? 'default' : 'small'}
          ></TextFieldsIcon>
        </IconButton>
        <IconButton
          size="small"
          className={creating ? classes.icon : classes.narrowIcon}
          onClick={() => todosStore.switchContent(note)}
          disabled={note.checkbox}
        >
          <CheckBoxIcon fontSize={creating ? 'default' : 'small'}>
            {' '}
          </CheckBoxIcon>
        </IconButton>
        <IconButton
          size="small"
          className={creating ? classes.icon : classes.narrowIcon}
        >
          <LabelIcon fontSize={creating ? 'default' : 'small'}></LabelIcon>
        </IconButton>
        {creating ? null : (
          <React.Fragment>
            <IconButton
              size="small"
              className={classes.narrowIconDone}
              onClick={this.handleClick}
            >
              <MoreHorizIcon fontSize="small"></MoreHorizIcon>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={this.handleClose}
            >
              <MenuItem onClick={this.handleClose}>Done</MenuItem>
              <MenuItem onClick={this.handleClose}>Pin</MenuItem>
              <MenuItem onClick={this.handleClose}>Delete</MenuItem>
            </Menu>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(observer(TodosCreateActions));
