import React, { Component } from 'react';
import Wrapper from "../components/Wrapper";
import { connect } from "react-redux";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import "../assets/css/pages/activeDrivers.css"
import Avatars from "../components/utils/Avatars";
import DriverMap from "../components/map/DriverMap";
import { deleteActiveDrivers, getActiveDrivers } from "../store/actions/admin/socket";

class ActiveDrivers extends Component {
	constructor(props) {
		super(props);
		this.state = {
			formData: {type: "all"},
		};
	}

	componentDidMount() {
		this.props.deleteActiveDrivers();
		this.props.getActiveDrivers(1);
	}

	handleChange = (id, name) => {
		const {formData} = this.state;
		_.set(formData, "id", id);
		_.set(formData, "name", name);
		this.setState({formData});
	};

	handleFilter = (path, ev) => {
		let {formData} = this.state;
		formData = {};
		_.set(formData, path, ev);
		this.props.deleteActiveDrivers();
		this.props.getActiveDrivers(formData);
		this.setState({formData});
	};

	changePage = () => {
		const {activeDriversData} = this.props;
		const {formData} = this.state;
		if (this.scroll.scrollHeight - this.scroll.scrollTop === this.scroll.clientHeight){
			if (+activeDriversData?.currentPage < +activeDriversData?.totalPages){
				const page = activeDriversData?.currentPage ? activeDriversData.currentPage + 1 : 1;
				_.set(formData, "page", page);
				this.props.getActiveDrivers(formData)
				this.setState({formData});
			}
		}
	}

	render() {
		const {activeDrivers, coordsList} = this.props;
		const {formData} = this.state;
		const dId = +_.get(activeDrivers, 0)?.id;
		const avatar = "/images/icons/avatar.jpg"
		const c = _.find(coordsList || [], ["driverId", formData?.id ? +formData.id : dId]);
		const defaultCoords = formData?.id ? _.find(activeDrivers, {id: +formData?.id})?.coords :
			_.get(activeDrivers, 0) ? _.get(activeDrivers, 0)?.coords : [];

		return (<Wrapper showFooter={ false }>
			<div className="container">
				<div className="w100 dfj">
					<div className="active_drivers_left" ref={ (r) => this.scroll = r }
					     onScroll={ () => this.changePage() }
					>
						<div className="active_drivers_filter">
							<div className={ formData?.type === "all" ? "green" : '' }
							     onClick={ () => this.handleFilter("type", "all") }>All
							</div>
							<div
								className={ `middle ${ +formData?.type === 1 ? "green" : '' }` }
								onClick={ () => this.handleFilter("type", 1) }>Out City
							</div>
							<div className={ +formData?.type === 2 ? "green" : '' }
							     onClick={ () => this.handleFilter("type", 2) }>In City
							</div>
						</div>
						<ul className="active_drivers_list">
							{ !_.isEmpty(activeDrivers) ? _.map(activeDrivers || [], (v, k) => (v ?
								<li key={ v?.id || k }
								    className={ `active_drivers_item ${ +v?.id === +formData?.id ? "sad" : dId ? "sad" : "" }` }
								    onClick={ () => this.handleChange(v?.id, v?.driverUser) }>
									<div className="active_drivers_avatar">
										<Avatars
											src={ avatar } alt="avatar"
											onError={ ev => {
												ev.target.src = avatar
											} }/>
										<div className='on'/>
									</div>
									{ v?.driverUser?.firstName || '' } { v?.driverUser?.lastName || '' }
								</li> : null)) : 'No active drivers' }
						</ul>
					</div>
					<div className="active_drivers_right">
						<DriverMap
							name={ formData?.name ? formData.name : _.get(activeDrivers, 0) ? _.get(activeDrivers, 0)?.driverUser : {} }
							coords={ !_.isEmpty(c?.coords) ? c?.coords : defaultCoords }
							state={ !_.isEmpty(c?.coords) ? c?.coords : defaultCoords }
						/>
					</div>
				</div>
			</div>
		</Wrapper>);
	}
}

const mapStateToProps = (state) => ({
	activeDrivers: state.users.activeDrivers,
	activeDriversData: state.users.activeDriversData,
	coordsList: state.users.coordsList,
})

const mapDispatchToProps = {
	getActiveDrivers, deleteActiveDrivers,
}

const ActiveDriversContainer = connect(mapStateToProps, mapDispatchToProps,)(ActiveDrivers)

export default withRouter(ActiveDriversContainer);
