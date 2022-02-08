import React, { Component } from 'react';
import { NavLink, withRouter } from "react-router-dom";
import "../assets/css/components/leftNavbar.css"
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar, faHandshake } from "@fortawesome/free-solid-svg-icons";

class Header extends Component {
	constructor(props) {
		super(props);
		this.state = {
			src: this.props.location.pathname,
			page: this.props.match.params.page,
			id: this.props.match.params.id,
			bId: this.props.match.params.bId,
			oId: this.props.match.params.oId,
		}
	}

	render() {
		const {src, page, id, bId, oId} = this.state;
		const path = _.replace(src, `/${ page }`, '');

		return (
			<header className='header'>
				<div className='left__navbar'>
					<div className="header__logo">
						<img src="/images/logos/haba-black.png" alt="haba-black"/>
					</div>
					<nav className="navbar__content">
						{ ['/all_users', '/user_update'].includes(path) ?
							<NavLink to="/all_users" className="nav__link active">
								<img src="/images/icons/Users-white.svg" alt="Users"/>&ensp;Users
							</NavLink> :
							<NavLink to="/all_users" className="nav__link">
								<img src="/images/icons/Users.svg" alt="Users"/>&ensp;Users
							</NavLink>
						}
						{ ['/countries', '/country_update'].includes(path) ?
							<NavLink to="/countries" className="nav__link active">
								<img src="/images/icons/Countries-white.svg" alt="Countries"/>&ensp;Countries
							</NavLink> :
							<NavLink to="/countries" className="nav__link">
								<img src="/images/icons/Countries.svg" alt="Countries"/>&ensp;Countries
							</NavLink>
						}
						{ ['/city', '/city_update'].includes(path) ?
							<NavLink to="/city" className="nav__link active">
								<img src="/images/icons/Cities-white.svg" alt="Cities"/>&ensp;Cities
							</NavLink> :
							<NavLink to="/city" className="nav__link">
								<img src="/images/icons/Cities.svg" alt="Cities"/>&ensp;Cities
							</NavLink>
						}
						<NavLink to="/route" className="nav__link">
							{ path === '/route' ? <img src="/images/icons/Routes-white.svg" alt="Routes"/> :
								<img src="/images/icons/Routes.svg" alt="Routes"/> }
							&ensp;Routes</NavLink>
						{ ['/drivers', '/driver_update', '/active_drivers'].includes(path) ?
							<NavLink to="/drivers" className="nav__link active">
								<img src="/images/icons/Drivers-white.svg" alt="Drivers"/>&ensp;Drivers
							</NavLink> :
							<NavLink to="/drivers" className="nav__link">
								<img src="/images/icons/Drivers.svg" alt="Drivers"/>&ensp;Drivers
							</NavLink>
						}
						<NavLink to="/partners" className="nav__link">
							<FontAwesomeIcon icon={ faHandshake }/>&ensp;Partners
						</NavLink>
						{ ['/choose/service', '/services', '/add_service', '/update_service', `/orders`,
							`/add_order`, `/${ id }/${ bId }/update_orders/${ oId }`].includes(path) ?
							<NavLink to="/choose/service" className="nav__link active">
								<img src="/images/icons/Services-white.svg" alt="Services"/>&ensp;Services
							</NavLink> :
							<NavLink to="/choose/service" className="nav__link">
								<img src="/images/icons/Services.svg" alt="Services"/>&ensp;Services
							</NavLink>
						}
						{ ['/ticket', '/add_ticket', '/update_ticket'].includes(path) ?
							<NavLink to="/ticket" className="nav__link active">
								<img src="/images/icons/Tickets-white.svg" alt="Tickets"/>&ensp;Tickets
							</NavLink> :
							<NavLink to="/ticket" className="nav__link">
								<img src="/images/icons/Tickets.svg" alt="Tickets"/>&ensp;Tickets
							</NavLink>
						}
						<NavLink to="/transport" className="nav__link">
							<FontAwesomeIcon icon={ faCar }/>&ensp;Transport
						</NavLink>
						<NavLink to="/dashboard" className="nav__link">
							{ path === '/dashboard' ? <img src="/images/icons/Dashboard-white.svg" alt="Dashboard"/> :
								<img src="/images/icons/Dashboard.svg" alt="Dashboard"/> }
							&ensp;Dashboard</NavLink>
					</nav>
					<br/>
				</div>
			</header>
		);
	}
}

export default withRouter(Header);
