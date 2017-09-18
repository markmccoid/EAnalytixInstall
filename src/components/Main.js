import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import MainContainer from './MainContainer';


class Main extends React.Component {

  //------------------
  render() {
    return (
      <MemoryRouter
        initialEntries={[ '/', '/install/location']}
        initialIndex={0}
      >
        <MainContainer />
      </MemoryRouter>
    );
  }
}

export default Main;
