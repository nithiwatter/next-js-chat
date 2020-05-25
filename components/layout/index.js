import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import MenuLink from '../common/MenuWithLinks';
import IconButton from '@material-ui/core/IconButton';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Notifier from '../common/Notifier';

const styleGrid = {
  width: '100vw',
  minHeight: '100vh',
  maxWidth: '100%',
  padding: '0px 10px',
};

class Layout extends Component {
  state = {};
  render() {
    const { firstGridItem, children } = this.props;
    return (
      <Grid
        container
        justify="flex-start"
        alignItems="stretch"
        style={styleGrid}
      >
        {firstGridItem ? (
          <Grid
            item
            sm={2}
            xs={12}
            style={{
              borderRight: '1px #707070 solid',
              paddingTop: '10px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <IconButton size="small" style={{ marginRight: '10px' }}>
                  <Avatar>A</Avatar>
                </IconButton>

                <Typography variant="h6">Async</Typography>
              </div>
              <MenuLink
                options={[
                  {
                    text: 'Index page',
                    href: '/',
                    highlighterSlug: '/',
                  },
                  {
                    text: 'Your Settings',
                    href: '/your-settings',
                    highlighterSlug: '/your-settings',
                  },
                  {
                    separator: true,
                  },
                  {
                    text: 'Log out',
                    href: '/logout',
                  },
                ]}
              >
                <IconButton size="small">
                  <AccountCircleIcon
                    style={{ width: '40px', height: '40px' }}
                  ></AccountCircleIcon>
                </IconButton>
              </MenuLink>
            </div>
          </Grid>
        ) : null}
        <Grid item sm={10} xs={12}>
          {children}
        </Grid>
        <Notifier></Notifier>
      </Grid>
    );
  }
}

export default Layout;
