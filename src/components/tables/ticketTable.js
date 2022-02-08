import React, { Component } from 'react';
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import YMap from "../map/ymap";
import ModalButton from "../modals/modal";

class TicketTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      StatusEnum: Object.freeze({1: "Pending", 2: "Start", 3: "Cancel", 4: "End"}),
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
            <th className="thT">Service</th>
            <th className="thT">User</th>
            <th className="thT">Payment</th>
            <th className="thT">Location (from - to)</th>
            <th className="thT">{ v.detailsCargo ? 'Parcel Weigth' : 'Passangers' }</th>
            <th className="thT">Price</th>
            <th className="thT">Status</th>
            <th className="thT">View</th>
          </tr>
          </thead>
          <tbody>
          <tr className="trT">
            <td className="tdT">{ v.id }</td>
            <td className="tdT">
              { +v.serviceTicket?.type === 2 ? 'Cargo T' : +v.serviceTicket?.type === 1 ? 'Inercity T' : '-' }
            </td>
            <td className="tdT">
              { v.ticketUser?.username ? v.ticketUser.username :
                (v.ticketUser?.firstName || '-') + ' ' + (v.ticketUser?.lastName || '-') }
            </td>
            <td className="tdT">{ v.detailsPay?.method || "-" }</td>
            <td className="tdT map">
              { v.detailsCargo ?
                <ModalButton
                  title={ "Map" }
                  label={ "Map" }
                  button={ <img src="/images/icons/map.svg" alt="map"/> }
                  className={ "c_map" }
                  input={
                    <div className="user__create_content">
                      { v.detailsCargo?.fromCity && v.detailsCargo?.fromCity[0] && v.detailsCargo?.fromCity[1] &&
                      v.detailsCargo?.toCity && v.detailsCargo?.toCity[0] && v.detailsCargo?.toCity[1] ?
                        <YMap coordinates={ [v.detailsCargo?.fromCity, v.detailsCargo?.toCity] }
                              state={ v.detailsCargo?.fromCity } from={ v.detailsCargo?.fromCity }
                              to={ v.detailsCargo?.toCity } zoom={ 7 }/>
                        : <p className="center">No data</p> }
                    </div>
                  }
                /> || '-' : v.detailsPassenger ?
                  <ModalButton
                    title={ "Map" }
                    label={ "Map" }
                    button={ <img src="/images/icons/map.svg" alt="map"/> }
                    className={ "c_map" }
                    input={
                      <div className="user__create_content">
                        { _.map(v.detailsPassenger, (c, l) => (
                          c?.fromCity && c?.fromCity[0] && c?.fromCity[1] && c?.toCity && c?.toCity[0] && c?.toCity[1] ?
                            <div key={ l }><b>Id - { c?.id }</b>
                              <hr/>
                              <YMap coordinates={ [c?.fromCity, c?.toCity] } state={ c?.fromCity }
                                    from={ c?.fromCity } to={ c?.toCity } zoom={ 7 }/>
                              <hr/>
                              <br/></div>
                            : <><p className="center">{ c?.id }) No data</p><br/></>
                        )) }
                      </div>
                    }
                  /> || '-' : '-' }
            </td>
            <td className="tdT">
              { v.detailsCargo ? v.detailsCargo?.kg + 'kg' || '-' : v.detailsPassenger ?
                v.detailsPassenger.length || '-' : '-' }
            </td>
            <td className="tdT">{ v?.price || "-" }</td>
            <td className="tdT center">
              <div
                className={ +v?.status === 1 ? 'pending' : +v?.status === 2 ? 'start' : +v?.status === 3 ? 'cancel ' : 'end' }>
                { StatusEnum[v?.status] || "-" }</div>
            </td>
            <td className="tdT">
              <Link to={ `/update_ticket/${ v.id }` } title="Edit">
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

export default TicketTable;
