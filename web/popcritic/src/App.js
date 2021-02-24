import React from 'react';
import ReactDOM from 'react-dom';
import SearchAppBar from './header';
import Home from './home';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {color: "red"};
  }
  render() {
    return (
    	<div>
    	<SearchAppBar />
    	<Home />
    	</div>
    );
  }
}