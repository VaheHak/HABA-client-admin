import React, { Component } from 'react';
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

class TransportTable extends Component {

  render() {
    const {data} = this.props;

    return (
      _.map(data, (v, k) => (v ?
        <table className="tableT" key={ k }>
          <thead>
          <tr className="trT">
            <th className="thT">Id</th>
            <th className="thT">Transport Type</th>
            <th className="thT">Country</th>
            <th className="thT">City</th>
            <th className="thT">Price</th>
            <th className="thT">Edit</th>
          </tr>
          </thead>
          <tbody>
          <tr className="trT">
            <td className="tdT">{ v.id }</td>
            <td className="tdT">{ _.upperFirst(v.type) || '-' }</td>
            <td className="tdT">{ v.deliveryTransportCountry?.name || '-' }</td>
            <td className="tdT">{ v.deliveryTransportCity?.name || '-' }</td>
            <td className="tdT">{ v.price || '-' }</td>
            <td className="tdT">
              <Link to={ `/update_transport/${ v.id }` } title="Edit">
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

export default TransportTable;
