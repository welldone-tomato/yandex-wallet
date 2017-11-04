import React, { Component } from 'react';

class Payme extends Component {
    render() {
        return (
            <div>
              { this.props.params.guid }
            </div>
            );
    }
}

export default Payme;