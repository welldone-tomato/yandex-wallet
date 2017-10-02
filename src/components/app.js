import React, { Component } from 'react';

import Nav from './nav/';

class App extends Component {
  render() {
    return (
      <div>
        <Nav />
        <div className="section">
          { this.props.children }
        </div>
      </div>
      );
  }
}

export default App;
