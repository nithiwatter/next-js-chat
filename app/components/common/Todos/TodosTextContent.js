import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

const styles = (theme) => ({
  root: {
    display: 'flex',
    width: '100%',
    padding: theme.spacing(1, 0),
  },
  inputTextWrapper: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    width: '95%',
  },
});

class TodosTextContent extends Component {
  constructor(props) {
    super(props);
    this.state = { active: false };
    this.handleActive = this.handleActive.bind(this);
    this.handleDisactive = this.handleDisactive.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleInputChange(e) {
    const newValue = e.target.value;
    const id = e.target.id;
    this.props.todosStore.changeTextContent(id, newValue);
  }

  handleActive() {
    this.setState({ active: true });
  }

  handleDisactive() {
    this.setState({ active: false });
  }

  handleDelete(id) {
    this.props.todosStore.deleteContent(id);
  }

  render() {
    const { classes, content, id } = this.props;
    const { active } = this.state;
    return (
      <div
        className={classes.root}
        onMouseOver={this.handleActive}
        onMouseLeave={this.handleDisactive}
      >
        <InputBase
          id={id}
          placeholder="Take a note"
          classes={{ root: classes.inputTextWrapper }}
          value={content}
          onChange={this.handleInputChange}
          multiline
        ></InputBase>
        {active ? (
          <div style={{ marginLeft: 'auto', marginRight: '1rem' }}>
            <IconButton size="small" onClick={() => this.handleDelete(id)}>
              <DeleteIcon></DeleteIcon>
            </IconButton>
          </div>
        ) : null}
      </div>
    );
  }
}

export default withStyles(styles)(TodosTextContent);
