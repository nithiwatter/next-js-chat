import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import MenuLink from '../common/MenuWithLinks';
import IconButton from '@material-ui/core/IconButton';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Notifier from '../common/Notifier';
import Confirmer from '../common/Confirmer';

const styleGrid = {
  width: '100vw',
  minHeight: '100vh',
  maxWidth: '100%',
  padding: '0px 10px',
};

const styleGridIsMobile = {
  width: '100vw',
  minHeight: '100vh',
  maxWidth: '100%',
  padding: '0px 0px 0px 10px',
};

class Layout extends Component {
  state = {};
  render() {
    // props passed from App.getInitialProps
    const { firstGridItem, children, isMobile } = this.props;
    return (
      <Grid
        container
        justify="flex-start"
        alignItems="stretch"
        style={isMobile ? styleGridIsMobile : styleGrid}
      >
        {firstGridItem ? (
          <Grid
            item
            md={2}
            sm={4}
            xs={12}
            style={{
              borderRight: isMobile ? 'none' : '1px #707070 solid',
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
                <IconButton size="small" style={{ marginRight: '10px' }}>
                  <AccountCircleIcon
                    style={{ width: '40px', height: '40px' }}
                  ></AccountCircleIcon>
                </IconButton>
              </MenuLink>
            </div>
          </Grid>
        ) : null}
        <Grid item md={10} sm={8} xs={12}>
          {children}
        </Grid>
        <Notifier></Notifier>
        <Confirmer></Confirmer>
      </Grid>
    );
  }
}

export default Layout;
