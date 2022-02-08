import React, { Component } from 'react';
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Avatars from "../utils/Avatars";

class PartnerTable extends Component {

  render() {
    const {data} = this.props;
    const avatar = "/images/icons/avatar.jpg";

    return (
      _.map(data, (v, k) => (v ?
        <table className="tableT" key={ k }>
          <thead>
          <tr className="trT">
            <th className="thT">No</th>
            <th className="thT">Image</th>
            <th className="thT">Name</th>
            <th className="thT">Delivery Price</th>
            <th className="thT">Membership Price</th>
            <th className="thT">Last Membership Payment</th>
            <th className="thT">Next Membership Payment</th>
            <th className="thT">View</th>
          </tr>
          </thead>
          <tbody>
          <tr className="trT">
            <td className="tdT">{ v.id }</td>
            <td className="tdT center">
              <div className="partner_avatar">
                <Avatars
                  src={ v?.image || avatar }
                  alt="avatar"
                  id="partner_avatar"
                  onError={ ev => {
                    ev.target.src = avatar
                  } }/>
                <img className="image_zoom" src={ v?.image || avatar } alt={ v?.name }/>
              </div>
            </td>
            <td className="tdT">{ v.name || '-' }</td>
            <td className="tdT">{ v.deliveryPrice || '-' }</td>
            <td className="tdT">{ v.membershipPrice || '-' }</td>
            <td className="tdT">{ v.lastMembershipPayment || '-' }</td>
            <td className="tdT">{ v.nextMembershipPayment || '-' }</td>
            <td className="tdT">
              <Link to={ `/update_partner/${ v.id }` } title="Edit">
                <FontAwesomeIcon icon={ faEye } className="edit"/>
              </Link>
            </td>
          </tr>
          </tbody>
        </table>
        : null))
    );
  }
}

export default PartnerTable;
