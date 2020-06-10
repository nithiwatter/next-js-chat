import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { withStyles } from '@material-ui/core/styles';
import TodosContentWrapper from './TodosContentWrapper';
import TodosCreateActions from './TodosCreateActions';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { observer } from 'mobx-react';

const styles = (theme) => ({
  root: {
    backgroundColor: theme.palette.blue.main,
    width: '80%',
    margin: '0 auto',
    marginBottom: theme.spacing(4),
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputTitleWrapper: {
    color: 'white',
    padding: theme.spacing(0.5, 2),
    width: '100%',
  },
  inputTitle: {
    fontWeight: 500,
    fontSize: '1rem',
  },
  optionsWrapper: {
    width: '100%',
    display: 'flex',
  },
  visible: {
    display: 'block',
  },
  hidden: {
    display: 'hidden',
  },
});

class TodosCreate extends Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(e) {
    this.props.todosStore.editTitle(e.target.value);
  }

  render() {
    const { classes, todosStore } = this.props;

    return (
      <ClickAwayListener onClickAway={todosStore.notEdit}>
        <Paper classes={{ root: classes.root }}>
          <Collapse
            collapsedHeight="3rem"
            in={todosStore.editMode}
            className={classes.wrapper}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                height: '3rem',
                marginBottom: '0.1rem',
              }}
            >
              <InputBase
                placeholder={todosStore.editMode ? 'Title' : 'Take a note...'}
                value={todosStore.title}
                classes={{
                  root: classes.inputTitleWrapper,
                  input: classes.inputTitle,
                }}
                onChange={this.handleInputChange}
                onFocus={todosStore.edit}
              ></InputBase>
              {todosStore.editMode ? null : (
                <IconButton
                  onClick={todosStore.editWithList}
                  disabled={todosStore.createdNote.checkbox}
                >
                  <CheckBoxIcon></CheckBoxIcon>
                </IconButton>
              )}
              {!todosStore.editMode ? null : (
                <IconButton>
                  <FavoriteIcon></FavoriteIcon>
                </IconButton>
              )}
            </div>

            <div>
              <TodosContentWrapper
                todosStore={todosStore}
                note={todosStore.createdNote}
                creating={true}
              ></TodosContentWrapper>
            </div>

            <div className={classes.optionsWrapper}>
              <TodosCreateActions
                todosStore={todosStore}
                note={todosStore.createdNote}
                creating={true}
              ></TodosCreateActions>
              <Button
                style={{ marginLeft: 'auto', color: 'white' }}
                onClick={todosStore.submit}
              >
                Done
              </Button>
            </div>
          </Collapse>
        </Paper>
      </ClickAwayListener>
    );
  }
}

export default withStyles(styles)(observer(TodosCreate));
