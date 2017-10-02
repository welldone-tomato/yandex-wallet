import React, { Component } from 'react';

import Nav from './nav/';

class App extends Component {
  render() {
    return (
      <div>
        <Nav />
        { this.props.children }
      </div>
      );
  }
}

export default App;
