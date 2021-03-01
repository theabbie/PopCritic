import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Avatar from '@material-ui/core/Avatar';
import Link from '@material-ui/core/Link';
import Rating from '@material-ui/lab/Rating';

const useStyles = makeStyles((theme) => ({
  heading: {
    fontSize: 30,
    color: "white",
    marginTop: 45,
    marginLeft: 15
  },
  list: {
    background: '#121212',
    color: 'white',
    margin: 30,
    [theme.breakpoints.down('xs')]: {
      marginLeft: 10
    }
  },
  text: {
    fontSize: 20,
    margin: 15,
    color: "white"
  },
  poster: {
    maxWidth: 50
  },
  avatar: {
    margin: 25
  },
  box: {
    fontSize: 20,
    margin: 15,
    [theme.breakpoints.down('xs')]: {
      display: "none"
    }
  }
}));

export default function ReviewList(props) {
  const classes = useStyles();

  const [reviews, setReviews] = useState(0);

  useEffect(() => {
    var id = window.location.pathname.substring(props.type=="movie"?7:8);
    fetch("https://popcritic.herokuapp.com/"+props.type+"/"+id+"/reviews").then(resp => resp.json()).then((data) => setReviews(data));
  },[])

  return (
    <div>
    <Typography className={classes.heading}>Reviews</Typography>
    <CircularProgress style={{ display: reviews?"none":"block", margin: "20px auto" }} />
    <List component="nav" className={classes.list}>
    { reviews?reviews.map(x=> (
      <ListItem button>
        <Link href={ "/user/"+x.user_id }><Avatar alt="PopCritic" src={ x.pic } className={classes.avatar} /></Link>
        <Typography className={classes.text}>{ x.review_text }</Typography>
        <Typography className={classes.text}><Rating readOnly value={ parseInt(x.rating) } /></Typography>
      </ListItem>
    )):"" }
    </List>
    </div>
  );
}
