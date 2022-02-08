import React, { Component } from 'react';
import _ from "lodash";
import "../../assets/css/pages/drivers.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSort } from "@fortawesome/free-solid-svg-icons";
import { Link, withRouter } from "react-router-dom";
import { ArrowDropDown, ArrowDropUp } from "@material-ui/icons";

class DriverTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sort: true,
      sortKey: 'id',
      i: void 0,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {sort, sortKey, i} = this.state;
    if (prevState.sort !== sort || prevState.sortKey !== sortKey || prevState.i !== i){
      this.setState({sort, sortKey, i});
    }
  }

  handleChange = (ev, i = '') => {
    const {sort} = this.state;
    const {formData, history} = this.props;
    this.setState({sort: !sort, sortKey: ev, i});
    this.props.onClick(formData.page, formData.id, formData.make, formData.model, formData.color,
      formData.year ? new Date(formData.year).getFullYear() : void 0, formData.passengersSeat,
      formData.number, formData.type, formData.partner, ev, !sort, i);
    history.push(`?sk=${ ev }&sort=${ !sort }&i=${ i }`);
  }

  render() {
    const {data} = this.props;
    const {sort, sortKey, i} = this.state;

    return (
      <table className="table">
        <thead>
        <tr className="tr">
          <th className="th" onClick={ () => this.handleChange('id', 'id') }>
            <div className="center">
              <p>Id</p>
              { sortKey === "id" ? sort === false ? <ArrowDropDown/> : <ArrowDropUp/> :
                <>&ensp;<FontAwesomeIcon icon={ faSort }/></> }
            </div>
          </th>
          <th className="th" onClick={ () => this.handleChange('driverUser', 'firstName') }>
            <div className="center">
              <p>User</p>
              { sortKey === "driverUser" && i === 'firstName' ? sort === false ? <ArrowDropDown/> : <ArrowDropUp/> :
                <>&ensp;<FontAwesomeIcon icon={ faSort }/></> }
            </div>
          </th>
          <th className="th" onClick={ () => this.handleChange('type') }>
            <div className="center">
              <p>Type</p>
              { sortKey === "type" ? sort === false ? <ArrowDropDown/> : <ArrowDropUp/> :
                <>&ensp;<FontAwesomeIcon icon={ faSort }/></> }
            </div>
          </th>
          <th className="th" onClick={ () => this.handleChange('driverCars', 'make') }>
            <div className="center">
              <p>Car Make</p>
              { sortKey === "driverCars" && i === "make" ? sort === false ? <ArrowDropDown/> : <ArrowDropUp/> :
                <>&ensp;<FontAwesomeIcon icon={ faSort }/></> }
            </div>
          </th>
          <th className="th" onClick={ () => this.handleChange('driverCars', 'model') }>
            <div className="center">
              <p>Car Model</p>
              { sortKey === "driverCars" && i === "model" ? sort === false ? <ArrowDropDown/> : <ArrowDropUp/> :
                <>&ensp;<FontAwesomeIcon icon={ faSort }/></> }
            </div>
          </th>
          <th className="th" onClick={ () => this.handleChange('driverCars', 'color') }>
            <div className="center">
              <p>Car Color</p>
              { sortKey === "driverCars" && i === "color" ? sort === false ? <ArrowDropDown/> : <ArrowDropUp/> :
                <>&ensp;<FontAwesomeIcon icon={ faSort }/></> }
            </div>
          </th>
          <th className="th" onClick={ () => this.handleChange('driverCars', 'year') }>
            <div className="center">
              <p>Car Year</p>
              { sortKey === "driverCars" && i === "year" ? sort === false ? <ArrowDropDown/> : <ArrowDropUp/> :
                <>&ensp;<FontAwesomeIcon icon={ faSort }/></> }
            </div>
          </th>
          <th className="th" onClick={ () => this.handleChange('driverCars', 'passengersSeat') }>
            <div className="center">
              <p>Car Passangers Seat</p>
              { sortKey === "driverCars" && i === "passengersSeat" ? sort === false ? <ArrowDropDown/> :
                  <ArrowDropUp/> :
                <>&ensp;<FontAwesomeIcon icon={ faSort }/></> }
            </div>
          </th>
          <th className="th" onClick={ () => this.handleChange('driverCars', 'number') }>
            <div className="center">
              <p>Car Number</p>
              { sortKey === "driverCars" && i === "number" ? sort === false ? <ArrowDropDown/> : <ArrowDropUp/> :
                <>&ensp;<FontAwesomeIcon icon={ faSort }/></> }
            </div>
          </th>
          <th className="th">Edit</th>
        </tr>
        </thead>
        <tbody>
        { _.map(data, (v, k) => (v ?
          <tr className="tr" key={ k }>
            <td className="td">{ v.id }</td>
            <td className="td">
              { v.driverUser?.firstName ? v.driverUser.firstName + ' ' + v.driverUser.lastName : '-' }
            </td>
            <td className="td">{ _.map(v.type, (d, k) => (
              <h6 key={ k }>
                { +d === 1 ? "Out City" : null }
                { +d === 2 ? "In City" : null }
              </h6>
            )) }</td>
            <td className="td">{ v.driverCars?.make || "-" }</td>
            <td className="td">{ v.driverCars?.model || "-" }</td>
            <td className="td dfc">
              { v.driverCars?.color || "-" }
              <div style={ {background: v.driverCars?.color} } className="car_color"/>
            </td>
            <td className="td">{ v.driverCars?.year ? v.driverCars?.year : "-" }</td>
            <td className="td">{ v.driverCars?.passengersSeat || "-" }</td>
            <td className="td">{ v.driverCars?.number || "-" }</td>
            <td className="td">
              <Link to={ `/driver_update/${ v.id }` } title="Edit">
                <FontAwesomeIcon icon={ faEdit } className="edit"/>
              </Link>
            </td>
          </tr>
          : null)) }
        </tbody>
      </table>
    );
  }
}

export default withRouter(DriverTable);
