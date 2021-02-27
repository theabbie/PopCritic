import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {Helmet} from "react-helmet";

import UserReviewList from './userReviewList';

const useStyles = makeStyles((theme) => ({
  poster: {
    maxWidth: 250,
    margin: 20,
    display: "inline-block",
    [theme.breakpoints.down('xs')]: {
      maxWidth: "80%"
    }
  },
   box: {
    [theme.breakpoints.down('xs')]: {
      flexWrap: "wrap"
    }
  },
  text: {
    color: "white",
    paddingTop: 10
  },
  btn: {
    margin: 25,
    fontWeight: "bolder"
  },
  avatar: {
    margin: 20,
    height: 200,
    width: 200
  }
}));

function toDate(date) {
  return (new Date(date)).toDateString();
}

export default function User() {
  const [profile, setProfile] = useState(0);

  const classes = useStyles();

  useEffect(() => {
    var id = window.location.pathname.substring(6);
    fetch("https://popcritic.herokuapp.com/user/"+id).then(resp => resp.json()).then((data) => setProfile(data)).catch(console.log);
  },[])

  return (
  	<div>
    <Helmet>
    <title>{ profile?("User "+profile.user_id):"PopCritic - Movies Reviewed by people, for people" }</title>
    </Helmet>
  	<CircularProgress style={{ display: profile?"none":"block", margin: "20px auto" }} />
  	<Box display="flex" className={classes.box} justifyContent="flex-start" m={1} p={1}>
    	<Box p={1}>
          <Avatar alt="Profile Avatar" src={ profile?profile.pic:"" } className={classes.avatar} />
        </Box>
        <Box p={1}>
          <Typography variant="h5" gutterBottom className={classes.text}>Email:</Typography>
          <Typography variant="subtitle1" gutterBottom className={classes.text}>{ profile?profile.email:"" }</Typography>
          <Typography variant="h5" gutterBottom className={classes.text}>Joined:</Typography>
          <Typography variant="subtitle1" gutterBottom className={classes.text} style={{ color: "lightgrey" }}>{ profile?toDate(profile.join_date):"" }</Typography>
        </Box>
  	</Box>
    <Box display="flex" className={classes.box} justifyContent="flex-start" m={1} p={1}>
      <Box p={1}>
        <UserReviewList />
      </Box>
    </Box>
    </div>
  )
}