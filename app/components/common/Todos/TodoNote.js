import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import TodosPopup from './TodosPopup';
import TodosCreateActions from './TodosCreateActions';
import IconButton from '@material-ui/core/IconButton';
import { observer } from 'mobx-react';
import Fade from '@material-ui/core/Fade';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import { Checkbox } from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';

const styles = (theme) => ({
  root: {
    border: '1px solid',
    borderColor: theme.palette.border.main,
    width: '100%',
    borderRadius: 8,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1),
  },
  rootPop: {
    position: 'fixed',
    top: '25%',
    left: '30%',
    borderRadius: 8,
    width: '50vw',
    zIndex: 100,
  },
  inputTitleWrapper: {
    padding: theme.spacing(0.5, 2),
    width: '100%',
  },
  inputTitle: {
    fontWeight: 500,
    fontSize: '1rem',
  },
  optionsWrapper: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 700,
    wordWrap: 'break-word',
  },
  mainContainer: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  contentContainer: {
    marginTop: theme.spacing(1),
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  checkbox: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  text: {
    wordWrap: 'break-word',
  },
  textContainer: {
    minWidth: '0',
  },
  show: {
    opacity: 100,
  },
  hide: {
    opacity: 0,
  },
});

class TodoNote extends Component {
  constructor(props) {
    super(props);
    this.state = { editing: false, focused: false, hovered: false };
    this.handleHoverIn = this.handleHoverIn.bind(this);
    this.handleHoverOut = this.handleHoverOut.bind(this);
    this.handleEditing = this.handleEditing.bind(this);
    this.handleNotEditing = this.handleNotEditing.bind(this);
  }

  handleEditing() {
    if (!this.state.editing) {
      this.setState({ editing: true });
    }
  }

  handleNotEditing() {
    if (this.state.editing) {
      this.setState({ editing: false });
    }
  }

  handleHoverIn() {
    if (!this.state.hovered) {
      this.setState({ hovered: true });
    }
  }

  handleHoverOut() {
    if (this.state.hovered) {
      this.setState({ hovered: false });
    }
  }

  render() {
    const { classes, note, mainIdx, todosStore } = this.props;
    const { editing, hovered } = this.state;
    let content;

    if (note.contentId.checkbox) {
      content = note.contentId.listContent.map((el) => (
        <div key={el._id} className={classes.checkboxContainer}>
          <Checkbox
            size="small"
            onClick={(e) => e.stopPropagation()}
          ></Checkbox>
          <div className={classes.textContainer}>
            <Typography variant="body2" className={classes.text}>
              {el.text}
            </Typography>
          </div>
        </div>
      ));
    } else {
      content = (
        <Typography variant="body2" className={classes.text}>
          {note.contentId.textContent}
        </Typography>
      );
    }

    return (
      <React.Fragment>
        <Paper
          classes={{ root: classes.root }}
          onMouseEnter={this.handleHoverIn}
          onMouseLeave={this.handleHoverOut}
          onClick={this.handleEditing}
          elevation={hovered ? 4 : 0}
          style={editing ? { opacity: 0 } : null}
        >
          <div className={classes.mainContainer}>
            <div className={classes.titleContainer}>
              <div style={{ minWidth: 0 }}>
                <Typography className={classes.title} variant="body1">
                  {note.title}
                </Typography>
              </div>

              <Fade in={hovered}>
                <div style={{ marginLeft: 'auto', alignSelf: 'flex-start' }}>
                  <IconButton size="small">
                    <FavoriteIcon></FavoriteIcon>
                  </IconButton>
                </div>
              </Fade>
            </div>

            <div className={classes.contentContainer}>{content}</div>
          </div>

          <Fade in={hovered}>
            <div className={classes.optionsWrapper}>
              <TodosCreateActions
                todosStore={todosStore}
                creating={false}
                note={note.contentId}
                handleHoverOut={this.handleHoverOut}
              ></TodosCreateActions>
            </div>
          </Fade>
        </Paper>

        <Modal
          open={editing}
          onClose={this.handleNotEditing}
          className={classes.modal}
          closeAfterTransition
        >
          <Fade in={editing}>
            <div style={{ outline: 'none' }}>
              <TodosPopup
                note={note}
                todosStore={todosStore}
                handleHoverOut={this.handleHoverOut}
              ></TodosPopup>
            </div>
          </Fade>
        </Modal>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(observer(TodoNote));
