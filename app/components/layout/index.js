import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import MenuLink from '../common/MenuWithLinks';
import IconButton from '@material-ui/core/IconButton';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Notifier from '../common/Notifier';
import Confirmer from '../common/Confirmer';
import { withStyles } from '@material-ui/core/styles';
import SimpleForm from '../common/SimpleForm';

import Sidebar from '../common/Sidebar';

const styles = (theme) => ({
  grid: {
    width: '100vw',
    minHeight: '100vh',
    maxWidth: '100%',
    padding: '0px 10px',
    [theme.breakpoints.down('xs')]: {
      width: '100vw',
      maxWidth: '100%',
      minHeight: 'auto',
      padding: '0px 0px 0px 10px',
    },
  },
});

class Layout extends Component {
  render() {
    // props passed from App.getInitialProps
    const { firstGridItem, children, isMobile, classes } = this.props;
    return (
      <Grid
        container
        justify="flex-start"
        alignItems="stretch"
        className={classes.grid}
      >
        {firstGridItem ? (
          <Grid
            item
            md={3}
            sm={4}
            xs={12}
            style={{
              height: '100vh',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: '10vh',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <IconButton
                  size="small"
                  style={{ marginRight: '10px' }}
                  onClick={this.props.user.rootStore.changeTheme}
                >
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
                    text: 'View Teams',
                    href: '/view-team',
                    highlighterSlug: '/view-team',
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

            <Sidebar {...this.props}></Sidebar>
          </Grid>
        ) : null}
        <Grid
          item
          md={firstGridItem ? 9 : 12}
          sm={firstGridItem ? 8 : 12}
          xs={12}
        >
          {children}
        </Grid>
        <Notifier></Notifier>
        <Confirmer></Confirmer>
        <SimpleForm></SimpleForm>
      </Grid>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Layout);
