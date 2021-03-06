import React from 'react';
import "@fontsource/roboto";
import clsx from 'clsx';
import Container from '@material-ui/core/Container';
import { makeStyles, useTheme, ThemeProvider } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AssignmentIcon from '@material-ui/icons/Assignment';
import SettingsIcon from '@material-ui/icons/Settings';
import CloseIcon from '@material-ui/icons/Close';
import InfoIcon from '@material-ui/icons/Info';
import {
  HashRouter as Router,
  // BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { Provider } from 'react-redux'
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { orange, grey, blueGrey, teal, green, pink } from '@material-ui/core/colors';
import { createTheme } from '@material-ui/core/styles';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import 'moment/locale/zh-cn';
import store from './data/store';
import { setConfig, setDaemon, setErrorInfo, setMessage, setReserveTableData, setRoomStockData, setShopInfo } from "./data/action";

import { isIterator, isMobileDevice, sleep } from "./utils/utils";
import api from "./api/api";

import ListItemLink from "./components/ListItemLink";
import './App.css';
import './css/main.css';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, ListItem, Snackbar } from '@material-ui/core';
import ErrorBoundary from './ErrorBondary';
import Problems from "./pages/Problems";
import Results from "./pages/Results";
import Myself from "./pages/Myself";
import About from "./pages/About";
import Submit from "./pages/Submit";
import { getHistory } from "./utils/utils";
import { Alert, AlertTitle } from '@material-ui/lab';
import Login from './pages/Login';

const drawerWidth = 240;
moment.locale('zh-cn');

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    width: '100%',
    // overflowX: 'auto',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  title: {
    flexGrow: 1
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    width: '100%',
    overflowX: 'auto',
  },
}));

let subscribers = {};

let last_data = {
  config: null,
  user: null,
  daemon: null
};

store.subscribe(async () => {
  let state = store.getState();
  // console.log('redux update to', state);
  // ?????? config
  if (state.config.data) {
    if (JSON.stringify(state.config.data) !== JSON.stringify(last_data.config)) {
      // console.log('Config will change:', state.config.data);
      state.config.save();
      // if (store.getState().user && store.getState().config.data.settings_async) {
      //   await api.request('sync', 'POST', { config: state.config.data });
      // }
    } else {
      // console.log('Not change:', state.config.data);
    }
    last_data.config = state.config.data;
  }
  for (let subFunc in subscribers) {
    subscribers[subFunc](state);
  }
});

export default function App() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [errorDialogInfo, setErrorDialogInfo] = React.useState(null);
  const [myMessage, setMyMessage] = React.useState(null);
  const [hasLogin, setHasLogin] = React.useState(false);
  const titleDefault = "Verilog OJ";
  const [title, setTitle] = React.useState(titleDefault);
  const [ignored, forceUpdate] = React.useReducer(x => x + 1, 0);
  const [requestingRemote, setRequesingRemote] = React.useState(false);
  const [openUser, setOpenUser] = React.useState(false);

  // // ?????????800?????????????????????600??????
  // const triggerWidthOpen = 800;
  // const triggerWidthClose = 600;

  const hashNow = window.location.hash.slice(2);
  const defaultPage = 'problems';
  if (hashNow === '') {
    getHistory().push(defaultPage);
  }
  const pageNow = hashNow === '' ? defaultPage : hashNow;

  // ??????????????????????????????????????????????????????????????????????????????
  subscribers['Error'] = function (state) {
    if (state.errorInfo) {
      console.log('Error Hook: ', state.errorInfo);
      setErrorDialogInfo(state.errorInfo);
      // ??????????????????
      store.dispatch(setErrorInfo(null));
    }
  };
  // ????????????????????????
  subscribers['Message'] = function (state) {
    if (state.message) {
      console.log('message: ', state.message);
      setMyMessage(state.message);
      store.dispatch(setMessage(null));
    }
  };
  subscribers['User'] = async function (state) {
    if (state.user) {
      if (JSON.stringify(state.user) != JSON.stringify(last_data.user)) {
        forceUpdate();
        // ?????????????????????????????????daemon
        // if (!last_data.user) 
        if (!last_data.user) {
          // store.dispatch(setDaemon(false));
          // console.log('trigger');
        }
      }
      last_data.user = state.user;
    }
  };
  // // onMount & onUpdate
  // React.useEffect(() => {
  //   const onWindowResize = () => {
  //     let width = window.innerWidth;
  //     // console.log(width);
  //     if (!open && width >= triggerWidthOpen) setOpen(true);
  //     if (open && width <= triggerWidthClose) setOpen(false);
  //   };
  //   window.addEventListener("load", onWindowResize);
  //   window.addEventListener('resize', onWindowResize);

  //   return () => {
  //     window.removeEventListener("load", onWindowResize);
  //     window.removeEventListener("resize", onWindowResize);
  //   };
  // });


  const handleClickAction = () => {
    // ?????????????????????
    // if (window.innerWidth < 600 || window.location.pathname === '/') {
    //   setOpen(false);
    // }
  };

  const mainContent = <Router>
    <MuiPickersUtilsProvider utils={MomentUtils} locale="zh-cn">
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => { setOpen(true); }}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap className={classes.title}>
            {title}
          </Typography>
          <IconButton
            color="inherit"
            onClick={() => { setOpenUser(true); }}
          >
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={() => { setOpen(false); }}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <List onClick={handleClickAction}>
          <ListItemLink to="/problems/:tid" primary="??????" icon={<DashboardIcon />} />
          {/* <ListItemLink to="/submit" primary="??????(??????)" icon={<AssignmentIcon />} /> */}
          <ListItemLink to="/results" primary="????????????" icon={<EqualizerIcon />} />
          <ListItemLink to="/myself" primary="??????" icon={<SettingsIcon />} />
          <ListItemLink to="/about" primary="??????" icon={<InfoIcon />} />
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Switch>
          <Route path="/problems" component={Problems} />
          {/* <Route path="/submit" component={Submit} /> */}
          <Route path="/results" component={Results} />
          <Route path="/myself" component={Myself} />
          <Route path="/about" component={About} />
        </Switch>
      </main>
    </MuiPickersUtilsProvider>
  </Router>;

  // const user = store.getState().user;
  // const isNowLogining = !user && store.getState().config.data.api_token.access_token;
  // let content = isNowLogining ? <Box>????????????...</Box> : (user ? mainContent : <Login></Login>);
  // if ((!isNowLogining && user) && !store.getState().daemon) {
  //   content = <Typography variant="body1">??????????????????...</Typography>;
  //   if (!requestingRemote) {
  //     setRequesingRemote(true);
  //     const daemon = api.request('remote_login', 'GET').then(daemon => {
  //       if (daemon.code === 200 && daemon.data.uid) {
  //         store.dispatch(setDaemon(daemon.data));
  //       } else if (daemon.code === 200 && !daemon.data.uid) {
  //         store.dispatch(setDaemon({}));
  //       }
  //     });
  //   }
  // } else if ((!isNowLogining && user) && store.getState().daemon && !store.getState().daemon.uid) {
  //   content = <RemoteLogin></RemoteLogin>
  // }

  // TODO: ???????????????????????????????????? API ???????????????
  // const content = mainContent;
  // const content = <Login></Login>;
  const content = store.getState().config.data.user ? mainContent : <Login></Login>;
  // console.log('theme', store.getState().config);
  const themes = {
    "????????????": {
      palette: {
        primary: {
          main: teal[500]
        },
        secondary: {
          main: green[500]
        },
        success: {
          main: green[500],
        }
      },
    },
    "????????????": {
      palette: {
        type: "dark",
        primary: {
          main: blueGrey[500],
        },
        secondary: {
          main: grey[500],
        },
      },
    },
    "diana": {
      palette: {
        secondary: {
          main: "#FEDBC4"
        },
        primary: {
          main: "#FB756E"
        }
      }
    }
  };
  const mui_theme = "diana";

  return (
    <div className={classes.root}>
      <ErrorBoundary>
        {/* <ThemeProvider theme={store.getState().config.theme}> */}
        <ThemeProvider theme={createTheme(themes[mui_theme])}>
          {content}
          <Dialog fullWidth open={openUser} onClose={() => { setOpenUser(false); }}>
            <DialogContent>
              {/* <User onClose={() => { setOpenUser(false); }}></User> */}
            </DialogContent>
          </Dialog>
          <Dialog open={errorDialogInfo ? true : false} onClose={() => { setErrorDialogInfo(null); }}>
            <DialogTitle>????????????</DialogTitle>
            <DialogContent>
              <Typography variant="body1">????????????</Typography>
              <Box component="div">
                <Box component="div">
                  {() => {
                    if (isIterator(errorDialogInfo) && typeof (errorDialogInfo) !== 'string') {
                      return <List>
                        {errorDialogInfo.map((d, i) => <ListItem key={d}>
                          <code>{JSON.stringify(d) === '{}' ? d.toString() : JSON.stringify(d)}</code>
                        </ListItem>)}
                      </List>;
                    } else {
                      return <code>{JSON.stringify(errorDialogInfo) === '{}' ? errorDialogInfo.toString() : JSON.stringify(errorDialogInfo)}</code>;
                    }
                  }}
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={() => { window.location.reload() }}>??????</Button>
              <Button color="primary" onClick={() => { setErrorDialogInfo(null); }}>??????</Button>
            </DialogActions>
          </Dialog>
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            open={myMessage !== null}
            autoHideDuration={(myMessage && myMessage.duration) ? myMessage.duration : 5000}
            // onClose={(e) => { console.log(e); }}
            message={(myMessage && myMessage.type) ? null : myMessage}
            onClose={() => setMyMessage(null)}
            action={
              <React.Fragment>
                <IconButton size="small" aria-label="close" color="inherit" onClick={() => setMyMessage(null)}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </React.Fragment>
            }
          >
            {(myMessage && myMessage.type) ? <Alert severity={myMessage.type} onClose={() => setMyMessage(null)}>
              <AlertTitle>{myMessage.title ? myMessage.title : myMessage.type}</AlertTitle>
              <span style={{ minWidth: 250, display: "block" }}>{myMessage.text}</span>
            </Alert> : null}
          </Snackbar>
        </ThemeProvider>
      </ErrorBoundary>
    </div >
  );
}
