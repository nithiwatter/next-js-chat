import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import MenuLink from '../common/MenuWithLinks';
import IconButton from '@material-ui/core/IconButton';
import Notifier from '../common/Notifier';
import Confirmer from '../common/Confirmer';
import { withStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react';
import SimpleForm from '../common/SimpleForm';
import Sidebar from '../common/Sidebar';
import Notifications from '../common/Notifications';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import Badge from '@material-ui/core/Badge';
import NotificationsIcon from '@material-ui/icons/Notifications';

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
      marginRight: '1rem',
    },
  },
  firstGrid: {
    position: 'relative',
    backgroundColor: theme.palette.sbg.main,
    zIndex: 1,
    height: '100vh',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    [theme.breakpoints.down('xs')]: {
      height: '10vh',
      paddingRight: 0,
    },
  },
  secondGrid: {
    position: 'relative',
    zIndex: 0,
    backgroundColor: theme.palette.bg.main,
    [theme.breakpoints.down('xs')]: {
      height: '90vh',
    },
  },
  drawer: {
    width: '90vw',
  },
  sidebarContainer: {
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  badge: {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  icon: {
    backgroundColor: theme.palette.blue.main,
    color: 'white',
  },
  noti: {
    backgroundColor: theme.palette.bg.main,
  },
  sidebarHolder: {
    paddingTop: theme.spacing(4),
  },
});

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = { open: false, openN: false };
    this.handleOpenDrawer = this.handleOpenDrawer.bind(this);
    this.handleCloseDrawer = this.handleCloseDrawer.bind(this);
    this.handleOpenNotifications = this.handleOpenNotifications.bind(this);
    this.handleCloseNotifications = this.handleCloseNotifications.bind(this);
  }

  handleOpenDrawer() {
    this.setState({ open: true });
  }

  handleCloseDrawer() {
    this.setState({ open: false });
  }

  handleOpenNotifications() {
    this.setState({ openN: true });
  }

  handleCloseNotifications() {
    this.setState({ openN: false });
  }

  render() {
    // props passed from App.getInitialProps
    const { firstGridItem, children, classes, rootStore, user } = this.props;
    const { open, openN } = this.state;

    return (
      <React.Fragment>
        <Drawer
          open={open}
          onClose={this.handleCloseDrawer}
          classes={{ paper: classes.drawer }}
        >
          <div className={classes.sidebarHolder}>
            <Sidebar rootStore={rootStore} user={user}></Sidebar>
          </div>
        </Drawer>
        <Drawer
          anchor="top"
          open={openN}
          onClose={this.handleCloseNotifications}
          classes={{ paper: classes.noti }}
        >
          <Notifications rootStore={rootStore} user={user}></Notifications>
        </Drawer>
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
                    onClick={() => rootStore.changeTheme()}
                  >
                    {rootStore.currentTeam ? (
                      <Avatar variant="rounded" className={classes.icon}>
                        {rootStore.currentTeam.name[0].toUpperCase()}
                      </Avatar>
                    ) : (
                      <Avatar>T</Avatar>
                    )}
                  </IconButton>

                  <Typography variant="h6">
                    {rootStore.darkTheme ? 'Dark' : 'Light'}
                  </Typography>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton onClick={this.handleOpenNotifications}>
                    <Badge
                      badgeContent={
                        rootStore.pendingInvitations.length +
                        rootStore.pendingAcceptances.length
                      }
                      color="error"
                    >
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>

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
                    <IconButton
                      size="small"
                      style={{ marginRight: '1rem', marginLeft: '1rem' }}
                    >
                      <Badge
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right',
                        }}
                        overlap="circle"
                        variant="dot"
                        classes={{ badge: classes.badge }}
                      >
                        <Avatar src={user.avatarUrl}>A</Avatar>
                      </Badge>
                    </IconButton>
                  </MenuLink>
                </div>
              </div>
              <div className={classes.sidebarContainer}>
                <Sidebar rootStore={rootStore} user={user}></Sidebar>
              </div>
            </Grid>
          ) : null}
          <Grid
            item
            md={firstGridItem ? 9 : 12}
            sm={firstGridItem ? 8 : 12}
            xs={12}
            className={classes.secondGrid}
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

export default withStyles(styles, { withTheme: true })(observer(Layout));
