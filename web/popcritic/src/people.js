import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Link from '@material-ui/core/Link';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {Helmet} from "react-helmet";

import CreateReview from './createReview';
import ReviewList from './reviewList';

const useStyles = makeStyles((theme) => ({
  title: {
  	color: "white",
  	paddingTop: 10
  },
  prof: {
  	color: "lightgrey"
  },
  plot: {
  	color: "white",
  	paddingTop: 10
  },
  button: {
  	margin: 10,
  	fontWeight: "bolder"
  },
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
  list: {
    display: 'inline-block'
  },
  movies: {
    maxWidth: 150,
    margin: 15,
    [theme.breakpoints.down('xs')]: {
      maxWidth: 60
    }
  }
}));

function toDate(date) {
  return (new Date(date)).toDateString();
}

export default function Movie() {
  const [people, setPeople] = useState(0);

  const classes = useStyles();
  
  var found = true;

  useEffect(() => {
  	var query = window.location.pathname.substring(8);
    fetch("https://popcritic.herokuapp.com/people/"+query).then(resp => resp.json()).then((data) => setPeople(data)).catch(() => {window.location.href="/"});
  },[])

  return (
  	<div>
  	<Helmet>
    <title>{ people?(people.name+" | PopCritic"):"PopCritic - Movies Reviewed by people, for people" }</title>
    </Helmet>
  	<CircularProgress style={{ display: people?"none":"block", margin: "20px auto" }} />
  	<Box display="flex" className={classes.box} justifyContent="flex-start" m={1} p={1}>
    	<Box p={1}>
          <img className={classes.poster} src={ people?("https://image.tmdb.org/t/p/w500"+people.image):"https://via.placeholder.com/400x600" } />
        </Box>
        <Box p={1}>
          <Typography variant="h3" gutterBottom className={classes.title}>{ people?people.name:"" }</Typography>
          <Typography variant="h6" gutterBottom className={classes.prof}>{ people?people.profession:"" }</Typography>
        </Box>
  	</Box>
    <Box display="flex" className={classes.box} justifyContent="flex-start" m={1} p={1}>
      <Box p={1}>
        <Typography variant="h4" gutterBottom className={classes.title}>Movies:</Typography>
        <List className={classes.list}>
          {people?people.movies.map(m=>(<Link href={"/movie/"+m.movie_id}><img className={classes.movies} src={"https://image.tmdb.org/t/p/w500"+m.poster} /></Link>)):""}
        </List>
      </Box>
    </Box>
  	<Box display="flex" className={classes.box} justifyContent="flex-start" m={1} p={1}>
  		<Box p={1}>
        <CreateReview type="people" />
        <ReviewList type="people" />
      </Box>
  	</Box>
    </div>
  )
}