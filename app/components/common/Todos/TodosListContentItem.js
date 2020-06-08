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
    width: '100%',
    alignItems: 'center',
    cursor: 'text',
    borderTop: '1px solid transparent',
    borderBottom: '1px solid transparent',
  },
  wrapperBorders: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    cursor: 'text',
    borderTop: '1px solid rgba(255, 255, 255, 0.15)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
  },
  inputTextWrapper: {
    paddingLeft: theme.spacing(2),
    width: '85%',
    height: '100%',
    // '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' },
  },
  visible: {
    opacity: 100,
  },
  invisible: {
    opacity: 0,
  },
});

class TodosListContentItem extends Component {
  constructor(props) {
    super(props);
    this.state = { active: false, hovered: false };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleOnKeyDown = this.handleOnKeyDown.bind(this);
    this.handleActive = this.handleActive.bind(this);
    this.handleDisactive = this.handleDisactive.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleHoverIn = this.handleHoverIn.bind(this);
    this.handleHoverOut = this.handleHoverOut.bind(this);
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
    const { classes, todosStore, item, id, idx } = this.props;
    const { active, hovered } = this.state;
    const content = Object.values(item)[0];

    return (
      <div
        className={active ? classes.wrapperBorders : classes.wrapper}
        onMouseOver={this.handleHoverIn}
        onMouseLeave={this.handleHoverOut}
      >
        <CheckBox classes={{ root: classes.checkBox }}></CheckBox>
        <InputBase
          value={content}
          classes={{ root: classes.inputTextWrapper }}
          onChange={this.handleInputChange}
          onFocus={this.handleActive}
          onBlur={this.handleDisactive}
          onKeyDown={this.handleOnKeyDown}
          id={id + '-' + idx}
          autoFocus={content === ''}
          multiline
          placeholder="Write your thoughts..."
        ></InputBase>

        <div style={{ marginLeft: 'auto', marginRight: '1rem' }}>
          <IconButton
            size="small"
            onClick={this.handleDelete}
            className={hovered ? classes.visible : classes.invisible}
          >
            <CloseIcon></CloseIcon>
          </IconButton>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(observer(TodosListContentItem));
