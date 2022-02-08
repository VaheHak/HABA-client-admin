import React, { Component } from 'react';
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import moment from "moment-timezone";

class ServiceTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      StatusEnum: Object.freeze({1: "Pending", 2: "Start Cargo", 3: "Start Take Passengers", 4: "Executing", 5: "End"}),
      TypeEnum: Object.freeze({1: 'Inercity T', 2: 'Cargo T'}),
    };
  }

  render() {
    const {data, role} = this.props;
    const {StatusEnum, TypeEnum} = this.state;

    return (
      _.map(data, (v, k) => (v ?
        <table className="tableT" key={ k }>
          <thead>
          <tr className="trT">
            <th className="thT">No</th>
            <th className="thT">Service Type</th>
            <th className="thT">Max Count</th>
            <th className="thT">Available Count</th>
            <th className="thT">Start date</th>
            <th className="thT">Route</th>
            <th className="thT">Price</th>
            <th className="thT">Status</th>
            { +role?.role === 1 ? <th className="thT">Edit</th> : null }
          </tr>
          </thead>
          <tbody>
          <tr className="trT">
            <td className="tdT">{ v.id }</td>
            <td className="tdT">{ _.map(v.details, (d, l) => (
              <div key={ l }>
                { d?.type ? TypeEnum[d.type] : '-' }
                <br/>
              </div>
            )) }</td>
            <td className="tdT">{ _.map(v.details, (d, l) => (
              <div key={ l }>
                { d?.maxCount ? d.maxCount : '-' }
                <br/>
              </div>
            )) }</td>
            <td className="tdT">{ _.map(v.details, (d, l) => (
              <div key={ l }>
                { d?.availableCount ? d.availableCount : '-' }
                <br/>
              </div>
            )) }</td>
            <td className="tdT">{ v.startDate ? moment(v.startDate).tz('UTC').format('llll') : '-' }</td>
            <td className="tdT">
              { v.route?.routesFrom ? v.route?.routesFrom?.name || '-' : v.route?.from || <i>No</i> }
              &ensp;-&ensp;
              { v.route?.routesTo ? v.route?.routesTo?.name || '-' : v.route?.to || <i>No</i> }
            </td>
            <td className="tdT">{ _.map(v.details, (d, l) => (
              <div key={ l }>
                { d?.price || "-" }
                <br/>
              </div>
            )) }</td>
            <td className="tdT center">
              <div
                className={ +v?.state === 1 ? 'pending' : +v?.state === 2 || +v?.state === 3 ? 'start'
                  : +v?.state === 4 ? 'cancel ' : 'end' }>
                { StatusEnum[v?.state] || "-" }</div>
            </td>
            { +role?.role === 1 ? <td className="tdT">
              <Link to={ `/update_service/${ v.id }` } title="Edit">
                <FontAwesomeIcon icon={ faEdit } className="edit"/>
              </Link>
            </td> : null }
          </tr>
          </tbody>
        </table>
        : null))
    );
  }
}

export default ServiceTable;
