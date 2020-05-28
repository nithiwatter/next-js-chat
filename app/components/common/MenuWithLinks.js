import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Router from 'next/router';
import React, { Component } from 'react';
import Divider from '@material-ui/core/Divider';
import { withRouter } from 'next/router';
import axios from 'axios';
import { StoreContext } from '../../lib/context';

class MenuWithLinks extends Component {
  static contextType = StoreContext;

  constructor(props) {
    super(props);
    this.state = { anchorEl: null };
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClick(e) {
    this.setState({ anchorEl: e.currentTarget });
  }

  handleClose() {
    this.setState({ anchorEl: null });
  }

  async handleLogOut() {
    await axios.get(`${process.env.URL_API}/api/v1/auth/log-out`, {
      withCredentials: true,
    });
    this.context.userStore.logOut();
    Router.push('/login');
  }

  render() {
    const { options, children, router } = this.props;
    const { anchorEl } = this.state;

    return (
      <div>
        <div onClick={this.handleClick}>{children}</div>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          {options.map((option, i) => {
            return option.separator ? (
              <Divider key={`separated-${i}`} variant="middle"></Divider>
            ) : (
              <MenuItem
                onClick={
                  option.text === 'Log out'
                    ? () => {
                        this.handleLogOut();
                        this.handleClose();
                      }
                    : () => {
                        Router.push(option.href, option.as || option.href);
                        this.handleClose();
                      }
                }
                key={option.href}
                style={{
                  fontWeight:
                    router.asPath === option.highlighterSlug ? 600 : 300,
                  fontSize: '14px',
                }}
              >
                {option.text}
              </MenuItem>
            );
          })}
        </Menu>
      </div>
    );
  }
}

export default withRouter(MenuWithLinks);
