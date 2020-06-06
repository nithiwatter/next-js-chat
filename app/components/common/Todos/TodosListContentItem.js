import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import CheckBox from '@material-ui/core/Checkbox';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { observer } from 'mobx-react';

const styles = (theme) => ({
  wrapper: {
    display: 'flex',
    width: '75%',
    alignItems: 'center',
    cursor: 'text',
  },
  inputTextWrapper: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    borderRadius: 8,
    width: '80%',
    height: '100%',
    // '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' },
  },
});

class TodosListContentItem extends Component {
  constructor(props) {
    super(props);
    this.state = { active: false };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleOnKeyDown = this.handleOnKeyDown.bind(this);
    this.handleActive = this.handleActive.bind(this);
    this.handleDisactive = this.handleDisactive.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleInputChange(e) {
    let id = e.target.id.split('-')[0];
    let idx = e.target.id.split('-')[1];
    this.props.todosStore.editListItemContent(id, idx, e.target.value);
  }

  handleOnKeyDown(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.props.todosStore.addListItemContent(this.props.id, this.props.idx);
    }
  }

  handleActive() {
    this.setState({ active: true });
  }

  handleDisactive() {
    this.setState({ active: false });
  }

  handleDelete() {
    this.props.todosStore.deleteListItemContent(this.props.id, this.props.idx);
  }

  render() {
    const { classes, todosStore, content, id, idx } = this.props;
    const { active } = this.state;

    return (
      <div
        className={classes.wrapper}
        onMouseOver={this.handleActive}
        onMouseLeave={this.handleDisactive}
      >
        <CheckBox classes={{ root: classes.checkBox }}></CheckBox>
        <InputBase
          value={content}
          classes={{ root: classes.inputTextWrapper }}
          onChange={this.handleInputChange}
          onFocus={todosStore.edit}
          onKeyDown={this.handleOnKeyDown}
          id={id + '-' + idx}
          autoFocus={content === ''}
          multiline
          placeholder="Write your thoughts..."
        ></InputBase>

        {active ? (
          <div style={{ marginLeft: 'auto' }}>
            <IconButton size="small" onClick={this.handleDelete}>
              <CloseIcon></CloseIcon>
            </IconButton>
          </div>
        ) : null}
      </div>
    );
  }
}

export default withStyles(styles)(TodosListContentItem);
