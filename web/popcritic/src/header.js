import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import { fade, makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  login: {
    [theme.breakpoints.down('sm')]: {
      padding: '5px',
    },
  },
  search: {
    position: 'relative',
    borderRadius: '20px',
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '20ch',
      '&:focus': {
        width: '30ch',
      },
    },
  },
}));

export default function SearchAppBar() {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  return (
    <div className={classes.root}>
      <AppBar position="static" style={{ background: '#3c3c3c' }}>
        <Toolbar>
          <Link href="/">
          <Avatar alt="PopCritic" src="/header.png" style={{ "margin-right": '20px' }} />
          </Link>
          <Typography className={classes.title} variant="h6" noWrap style={{ "font-size": "25px", "font-weight": "bolder" }}>
            PopCritic
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search Movie"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              onChange={ (e) => setValue(e.target.value) }
              onKeyDown={ (e) => {if (e.keyCode==13) window.location.href="/search/"+e.target.value} }
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
          <Button variant="contained" href="http://popcritic.herokuapp.com/login" className={classes.login} style={{ margin: '20px', "font-weight": "bolder" }}>Log In</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
