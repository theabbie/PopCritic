import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 250,
    margin: "20px",
    display: "inline-block",
    background: "#DCDCDC",
    [theme.breakpoints.down('xs')]: {
      maxWidth: "100%",
      "margin-left": "40px",
      "margin-right": "40px"
    }
  },
  media: {
    height: 200,
  },
}));

export default function Home() {
  const classes = useStyles();
  const [movies, setMovies] = useState(0);
  
  useEffect(() => {
    fetch("https://popcritic.herokuapp.com/movies").then(resp => resp.json()).then((data) => setMovies(data));
  })

  return (
   <div>
   { movies?movies.map(movie =>
    <Card className={classes.root}>
        <CardMedia
          className={classes.media}
          image={ "https://image.tmdb.org/t/p/w500" + movie.poster }
          title={ movie.title }
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
          { movie.title }
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
          { movie.plot.slice(0,100) + "..." }
          </Typography>
        </CardContent>
      <CardActions>
        <Button size="small" color="primary">
          Learn More
        </Button>
      </CardActions>
    </Card>
   ):""}
   </div>
  );
}
