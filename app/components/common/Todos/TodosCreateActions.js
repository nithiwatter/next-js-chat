import React, { Component } from 'react';
import PaletteIcon from '@material-ui/icons/Palette';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import LabelIcon from '@material-ui/icons/Label';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  actionsWrapper: {
    display: 'flex',
    alignItems: 'center',
    width: '30%',
    padding: theme.spacing(1, 0),
  },
  icon: { marginLeft: theme.spacing(2) },
});

class TodosCreateActions extends Component {
  state = {};
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.actionsWrapper}>
        <IconButton size="small" className={classes.icon}>
          <PaletteIcon></PaletteIcon>
        </IconButton>
        <IconButton size="small" className={classes.icon}>
          <CheckBoxIcon></CheckBoxIcon>
        </IconButton>
        <IconButton size="small" className={classes.icon}>
          <LabelIcon></LabelIcon>
        </IconButton>
      </div>
    );
  }
}

export default withStyles(styles)(TodosCreateActions);
