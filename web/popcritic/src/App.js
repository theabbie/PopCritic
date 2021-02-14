import React from 'react';
import ReactDOM from 'react-dom';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {color: "red"};
  }
  render() {
    return <h2>Hello World</h2>;
  }
}