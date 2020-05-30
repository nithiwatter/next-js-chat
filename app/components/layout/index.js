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
  firstGrid: {
    height: '100vh',
    [theme.breakpoints.down('xs')]: {
      height: 'auto',
    },
  },
});

class Layout extends Component {
  render() {
    // props passed from App.getInitialProps
    const {
      firstGridItem,
      children,
      isMobile,
      classes,
      rootStore,
      user,
    } = this.props;
    return (
      <Grid
        container
        justify="flex-start"
        alignItems="stretch"
        className={classes.grid}
      >
        {firstGridItem ? (
          <Grid item md={3} sm={4} xs={12} className={classes.firstGrid}>
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
                    highlighterSlugs: ['/', '/#'],
                  },
                  {
                    text: 'Your Settings',
                    href: '/your-settings',
                    highlighterSlugs: ['/your-settings'],
                  },
                  {
                    text: 'View Teams',
                    href: '/view-team',
                    highlighterSlugs: ['/view-team'],
                  },
                  {
                    separator: true,
                  },
                  {
                    text: 'Log out',
                    href: '/logout',
                    highlighterSlugs: [],
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

            <Sidebar rootStore={rootStore} user={user}></Sidebar>
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
