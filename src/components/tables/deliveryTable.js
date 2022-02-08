import React, { Component } from 'react';
import _ from "lodash";
import "../../assets/css/components/tables.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import moment from "moment";

class DeliveryTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			StatusEnum: Object.freeze({0: "Created", 1: "Pending", 2: "Took", 3: "Done"}),
		};
	}

	render() {
		const {data} = this.props;
		const {StatusEnum} = this.state;

		return (
			_.map(data, (v, k) => (v ?
				<table className="tableT" key={ k }>
					<thead>
					<tr className="trT">
						<th className="thT">No</th>
						<th className="thT">Delivery Address</th>
						<th className="thT">Created Date</th>
						<th className="thT">Pending Date</th>
						<th className="thT">Took Date</th>
						<th className="thT">Done Date</th>
						<th className="thT">Order Price</th>
						<th className="thT">Status</th>
						<th className="thT">Edit</th>
					</tr>
					</thead>
					<tbody>
					<tr className="trT">
						<td className="tdT">{ v.id }</td>
						<td className="tdT">{ v.deliveryAddress || '-' }</td>
						<td className="tdT">{ v.createdAt ? moment(v.createdAt).format('llll') : '-' }</td>
						<td className="tdT">{ v.pendingDate ? moment(v.pendingDate).format('llll') : '-' }</td>
						<td className="tdT">{ v.tookDate ? moment(v.tookDate).format('llll') : '-' }</td>
						<td className="tdT">{ v.doneDate ? moment(v.doneDate).format('llll') : '-' }</td>
						<td className="tdT">{ v.orderPrice || '-' }</td>
						<td className="tdT center">
							<div
								className={ +v?.status === 1 ? 'pending' : +v?.status === 2 ? 'start' : +v?.status === 3 ? 'cancel ' : 'end' }>
								{ StatusEnum[v?.status] || "-" }
							</div>
						</td>
						<td className="tdT">
							<Link to={ `/${ v?.partnerId }/${ v?.partnerBranchId }/update_orders/${ v.id }` } title="Edit">
								<FontAwesomeIcon icon={ faEdit } className="edit"/>
							</Link>
						</td>
					</tr>
					</tbody>
				</table>
				: null))
		);
	}
}

export default DeliveryTable;
