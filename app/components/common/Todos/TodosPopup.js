import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import TodosContentWrapper from './TodosContentWrapper';
import FavoriteIcon from '@material-ui/icons/Favorite';
import IconButton from '@material-ui/core/IconButton';
import TodosCreateActions from './TodosCreateActions';

const styles = (theme) => ({
  root: {
    minWidth: '50vw',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1),
  },
  titleContainer: {
    display: 'flex',
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  inputTitleWrapper: {
    padding: theme.spacing(0.5, 2),
    width: '100%',
  },
  inputTitle: {
    fontWeight: 500,
    fontSize: '2rem',
    lineHeight: 1,
  },
  optionsWrapper: {
    width: '60%',
  },
  bottomWrapper: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
  },
});

class TodosPopup extends Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  componentDidMount() {
    // handling focus for multiline list element
    const textLength = this.inputRef.current.textLength;
    this.inputRef.current.focus();
    this.inputRef.current.setSelectionRange(textLength, textLength);
  }

  render() {
    const { classes, note, todosStore, handleHoverOut } = this.props;

    return (
      <Paper className={classes.root} elevation={4}>
        <div className={classes.titleContainer}>
          <InputBase
            placeholder="Title"
            value={note.title}
            multiline
            classes={{
              root: classes.inputTitleWrapper,
              input: classes.inputTitle,
            }}
            inputRef={this.inputRef}
          ></InputBase>
          <div>
            <IconButton size="small">
              <FavoriteIcon></FavoriteIcon>
            </IconButton>
          </div>
        </div>

        <TodosContentWrapper
          todosStore={todosStore}
          note={note.contentId}
          creating={false}
        ></TodosContentWrapper>

        <div className={classes.bottomWrapper}>
          <div className={classes.optionsWrapper}>
            <TodosCreateActions
              todosStore={todosStore}
              creating={false}
              popup={true}
              note={note.contentId}
              handleHoverOut={handleHoverOut}
            ></TodosCreateActions>
          </div>
          <Button style={{ marginLeft: 'auto' }}>Close</Button>
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(observer(TodosPopup));
