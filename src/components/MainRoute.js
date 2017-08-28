import React from 'react';
import { MemoryRouter, Switch, Route, Redirect } from 'react-router-dom';
import Routes from './Routes';


class Main extends React.Component {

	//------------------
	render() {
		return (
			<MemoryRouter
			 initialEntries={[ '/', '/install/location']}
			 initialIndex={0}
			>
			 <Routes />
			</MemoryRouter>
		);
	}
}

export default Main;
