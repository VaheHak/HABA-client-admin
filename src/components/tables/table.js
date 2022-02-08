import React, { Component } from 'react';
import _ from "lodash";
import "../../assets/css/components/tables.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSort } from "@fortawesome/free-solid-svg-icons";
import { Link, withRouter } from "react-router-dom";
import { ArrowDropDown, ArrowDropUp } from "@material-ui/icons";
import moment from "moment";

class Table extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sort: true,
			sortKey: 'id',
		};
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const {sort, sortKey} = this.state;
		if (prevState.sort !== sort || prevState.sortKey !== sortKey){
			this.setState({sort, sortKey});
		}
	}

	handleChange = (ev) => {
		const {sort} = this.state;
		const {formData, history} = this.props;
		this.setState({sort: !sort, sortKey: ev});
		this.props.onClick(formData.id, ev, !sort, formData.phoneNumber, formData.username, formData.firstName,
			formData.lastName, formData.email, formData.verified, formData.deleted, formData.role, formData.page);
		history.push(`?sk=${ ev }&sort=${ !sort }`)
	}

	render() {
		const {data, activeUsers} = this.props;
		const {sort, sortKey} = this.state;

		return (
			<table className="table">
				<thead>
				<tr className="tr">
					<th className="th">Active</th>
					<th className="th" onClick={ () => this.handleChange('id') }>
						<div className="center">
							<p>Number</p>
							{ sortKey === "id" ? sort === false ? <ArrowDropDown/> : <ArrowDropUp/> :
								<>&ensp;<FontAwesomeIcon icon={ faSort }/></> }
						</div>
					</th>
					<th className="th" onClick={ () => this.handleChange('phoneNumber') }>
						<div className="center">
							<p>Phone Number</p>
							{ sortKey === "phoneNumber" ? sort === false ? <ArrowDropDown/> : <ArrowDropUp/> :
								<>&ensp;<FontAwesomeIcon icon={ faSort }/></> }
						</div>
					</th>
					<th className="th" onClick={ () => this.handleChange('balance') }>
						<div className="center">
							<p>Balance</p>
							{ sortKey === "balance" ? sort === false ? <ArrowDropDown/> : <ArrowDropUp/> :
								<>&ensp;<FontAwesomeIcon icon={ faSort }/></> }
						</div>
					</th>
					<th className="th" onClick={ () => this.handleChange('role') }>
						<div className="center">
							<p>Role</p>
							{ sortKey === "role" ? sort === false ? <ArrowDropDown/> : <ArrowDropUp/> :
								<>&ensp;<FontAwesomeIcon icon={ faSort }/></> }
						</div>
					</th>
					<th className="th" onClick={ () => this.handleChange('verified') }>
						<div className="center">
							<p>Verified</p>
							{ sortKey === "verified" ? sort === false ? <ArrowDropDown/> : <ArrowDropUp/> :
								<>&ensp;<FontAwesomeIcon icon={ faSort }/></> }
						</div>
					</th>
					<th className="th">Edit</th>
				</tr>
				</thead>
				<tbody>
				{ _.map(data, (v, k) => (
					<tr className="tr" key={ k }>
						<td className="td center">
							{ activeUsers.includes(+v.id) ? <div className="on"/> :
								<div className="off_block">
									<div className="off"/>
									<p className="lastVisit">{ moment(v.lastVisit || v.updatedAt).startOf('minutes').fromNow() }</p>
								</div> }
						</td>
						<td className="td">{ v.id }</td>
						<td className="td">{ v.phoneNumber }</td>
						<td className="td">$0000</td>
						<td className="td">{ v.role + ' - ' + v.roles?.name }</td>
						<td className="td center">{ v.verified ? <div className="verified__yes">Yes</div> :
							<div className="verified__no">No</div> }</td>
						<td className="td">
							<Link to={ `/user_update/${ v.id }` } title="Edit">
								<FontAwesomeIcon icon={ faEdit } className="edit"/>
							</Link>
						</td>
					</tr>
				)) }
				</tbody>
			</table>
		);
	}
}

export default withRouter(Table);
