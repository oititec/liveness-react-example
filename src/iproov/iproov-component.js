import '@iproov/web'; // includes the @iproov/web client into your app
import React, { Component } from 'react';

class IProovComponent extends Component {
  render() {
    return (
      <div className="App">
        <iproov-me
          token="f55c0ca4b55dedce27e454dcf5a8d6639d0a7cfa805bad2d642a00421801vu01"
          base_url="https://us.rp.secure.iproov.me"
          custom_title="Oiti Technologies"
          filter="vibrant"
          debug="true"
        >
          <div slot="button">
            <button type="button">Iniciar</button>
          </div>

          <div slot="passed">
            <h3 class="iproov-lang-heading">Passed</h3>
            <div class="iproov-lang-term">You have iProoved successfully</div>
          </div>
        </iproov-me>
      </div>
    );
  }
}

export default IProovComponent;
