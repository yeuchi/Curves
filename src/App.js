import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Point from './Point';
import SvgCubicSpline from './SvgCubicSpline';

class App extends Component {

  constructor()
  {
    super();
    this.state = null;

    this.points = [ new Point(0,400), 
                    new Point(400,200),
                    new Point(650,400)];
  }

  render() {

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React for SplineCOMB</h1>
        </header>
        <p className="App-intro">
          Click in SVG to add a knot on the curve.
        </p>

        <SvgCubicSpline points={this.points}/>
      </div>
    );
  }
}

export default App;
