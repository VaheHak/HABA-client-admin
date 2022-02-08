import React, { Component } from 'react';
import UserHeader from "../components/UserHeader";
import Wrapper from "../components/Wrapper";
import { DirectionsCar, LocalShipping } from "@material-ui/icons";
import { Link } from "react-router-dom";

class ChooseService extends Component {

	render() {

		return (<Wrapper showFooter={ false }>
			<UserHeader title={ `Choose Service Type` }/>
			<div className="choose_service_content">
				<Link to="/services" className="choose_service_block">
					<h2>Intercity/Cargo</h2>
					<p>Service</p>
					<br/>
					<DirectionsCar fontSize="large"/>
				</Link>
				<Link to="/orders" className="choose_service_block">
					<h2>Delivery</h2>
					<p>Service</p>
					<br/>
					<LocalShipping fontSize="large"/>
				</Link>
			</div>
		</Wrapper>);
	}
}

export default ChooseService;
