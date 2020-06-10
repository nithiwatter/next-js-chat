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
});

class TodosListContentItem extends Component {
  constructor(props) {
    super(props);
    this.state = { active: false, hovered: false };
    this.inputRef = React.createRef();
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleOnKeyDown = this.handleOnKeyDown.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleActive = this.handleActive.bind(this);
    this.handleDisactive = this.handleDisactive.bind(this);
    this.handleHoverIn = this.handleHoverIn.bind(this);
    this.handleHoverOut = this.handleHoverOut.bind(this);
  }

  componentDidMount() {
    // handling focus for multiline list element
    const textLength = this.inputRef.current.textLength;
    this.inputRef.current.focus();
    this.inputRef.current.setSelectionRange(textLength, textLength);
  }

  handleInputChange(e) {
    const newValue = e.target.value;
    this.props.todosStore.editListItemContent(
      this.props.note,
      this.props.idx,
      newValue
    );
  }

  handleOnKeyDown(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.props.todosStore.addListItemContent(
        this.props.note,
        this.props.idx,
        this.props.focus
      );
    }
  }

  handleDelete() {
    this.props.todosStore.deleteListItemContent(
      this.props.note,
      this.props.idx
    );
  }

  handleActive() {
    this.setState({ active: true });
  }

  handleDisactive() {
    this.setState({ active: false });
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
    const { classes, item } = this.props;
    const { active, hovered } = this.state;

    return (
      <div
        className={active ? classes.wrapperBorders : classes.wrapper}
        onMouseOver={this.handleHoverIn}
        onMouseLeave={this.handleHoverOut}
      >
        <CheckBox></CheckBox>
        <InputBase
          value={item.text}
          multiline
          classes={{ root: classes.inputTextWrapper }}
          onKeyDown={this.handleOnKeyDown}
          onChange={this.handleInputChange}
          onFocus={this.handleActive}
          onBlur={this.handleDisactive}
          inputRef={this.inputRef}
          autoFocus
        ></InputBase>

        <div style={{ marginLeft: 'auto', marginRight: '1rem' }}>
          <IconButton
            size="small"
            onClick={this.handleDelete}
            className={hovered || active ? classes.visible : classes.invisible}
          >
            <CloseIcon></CloseIcon>
          </IconButton>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(observer(TodosListContentItem));
