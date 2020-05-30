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
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';

const styles = (theme) => ({
  grid: {
    width: '100vw',
    minHeight: '100vh',
    maxWidth: '100%',
    padding: 0,
    [theme.breakpoints.down('xs')]: {
      width: '100vw',
      maxWidth: '100%',
      minHeight: 'auto',
      padding: 0,
    },
  },
  menuIcon: {
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'block',
    },
  },
  firstGrid: {
    height: '100vh',
    [theme.breakpoints.down('xs')]: {
      height: 'auto',
    },
  },
  drawer: {
    width: '90vw',
    padding: theme.spacing(3),
  },
  sidebarContainer: {
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
});

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
    this.handleOpenDrawer = this.handleOpenDrawer.bind(this);
    this.handleCloseDrawer = this.handleCloseDrawer.bind(this);
  }

  handleOpenDrawer() {
    this.setState({ open: true });
  }

  handleCloseDrawer() {
    this.setState({ open: false });
  }

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
    const { open } = this.state;
    return (
      <React.Fragment>
        <Drawer
          open={open}
          onClose={this.handleCloseDrawer}
          classes={{ paper: classes.drawer }}
          width="90%"
        >
          {/* <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
            }}
          >
            <Typography variant="h4">Awesome Drawer</Typography>
            <ChatIcon></ChatIcon>
          </div> */}

          <Sidebar rootStore={rootStore} user={user}></Sidebar>
        </Drawer>
        <Grid
          container
          justify="flex-start"
          alignItems="stretch"
          className={classes.grid}
        >
          {firstGridItem ? (
            <Grid item md={4} sm={5} xs={12} className={classes.firstGrid}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginLeft: '1rem',
                  height: '10vh',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton
                    className={classes.menuIcon}
                    onClick={this.handleOpenDrawer}
                  >
                    <MenuIcon></MenuIcon>
                  </IconButton>
                  <IconButton
                    size="small"
                    style={{ marginRight: '0.5rem' }}
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
                  <IconButton size="small" style={{ marginRight: '1rem' }}>
                    <AccountCircleIcon
                      style={{ width: '40px', height: '40px' }}
                    ></AccountCircleIcon>
                  </IconButton>
                </MenuLink>
              </div>
              <div className={classes.sidebarContainer}>
                <Sidebar rootStore={rootStore} user={user}></Sidebar>
              </div>
            </Grid>
          ) : null}
          <Grid
            item
            md={firstGridItem ? 8 : 12}
            sm={firstGridItem ? 7 : 12}
            xs={12}
            style={{ position: 'relative' }}
          >
            {children}
          </Grid>
          <Notifier></Notifier>
          <Confirmer></Confirmer>
          <SimpleForm></SimpleForm>
        </Grid>
      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Layout);
