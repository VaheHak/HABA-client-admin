import React, { Component } from 'react';
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSort } from "@fortawesome/free-solid-svg-icons";
import ModalButton from "../modals/modal";
import YMap from "../map/ymap";
import { Link, withRouter } from "react-router-dom";
import { ArrowDropDown, ArrowDropUp } from "@material-ui/icons";

class CityTable extends Component {
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
    const {history} = this.props;
    const {page} = this.props.match.params;
    this.setState({sort: !sort, sortKey: ev, i});
    this.props.onClick(page ? page : void 0, ev, !sort, i);
    history.push(`?sk=${ ev }&sort=${ !sort }&i=${ i }`);
  }

  render() {
    const {data, role} = this.props;
    const {sort, sortKey, i} = this.state;

    return (
      <table className="table">
        <thead>
        <tr className="tr">
          <th className="th" onClick={ () => this.handleChange('id') }>
            <div className="center">
              <p>Number</p>
              { sortKey === "id" ? sort === false ? <ArrowDropDown/> : <ArrowDropUp/> :
                <>&ensp;<FontAwesomeIcon icon={ faSort }/></> }
            </div>
          </th>
          <th className="th" onClick={ () => this.handleChange('name') }>
            <div className="center">
              <p>City Name</p>
              { sortKey === "name" ? sort === false ? <ArrowDropDown/> : <ArrowDropUp/> :
                <>&ensp;<FontAwesomeIcon icon={ faSort }/></> }
            </div>
          </th>
          <th className="th" onClick={ () => this.handleChange('coords', 0) }>
            <div className="center">
              <p>Coordinates Latitude</p>
              { sortKey === "coords" && i === 0 ? sort === false ? <ArrowDropDown/> : <ArrowDropUp/> :
                <>&ensp;<FontAwesomeIcon icon={ faSort }/></> }
            </div>
          </th>
          <th className="th" onClick={ () => this.handleChange('coords', 1) }>
            <div className="center">
              <p>Coordinates Longitude</p>
              { sortKey === "coords" && i === 1 ? sort === false ? <ArrowDropDown/> : <ArrowDropUp/> :
                <>&ensp;<FontAwesomeIcon icon={ faSort }/></> }
            </div>
          </th>
          <th className="th" onClick={ () => this.handleChange('isCanTakePassengers') }>
            <div className="center">
              <p>User Take</p>
              { sortKey === "isCanTakePassengers" ? sort === false ? <ArrowDropDown/> : <ArrowDropUp/> :
                <>&ensp;<FontAwesomeIcon icon={ faSort }/></> }
            </div>
          </th>
          <th className="th">Map</th>
          { +role?.role === 1 ? <th className="th">Edit</th> : null }
        </tr>
        </thead>
        <tbody>
        { _.map(data, (v, k) => (
          v ? <tr className="tr" key={ k }>
            <td className="td">{ v.id }</td>
            <td className="td">{ v.name }</td>
            <td className="td">{ v.coords ? v.coords[0] : null }</td>
            <td className="td">{ v.coords ? v.coords[1] : null }</td>
            <td className="td center">{ v.isCanTakePassengers ? <div className="verified__yes">Yes</div> :
              <div className="verified__no">No</div> }</td>
            <td className="td map">
              <ModalButton
                title={ "Map" }
                label={ "Map" }
                button={ <img src="/images/icons/map.svg" alt="map"/> }
                className={ "c_map" }
                cl={ 'log_out' }
                input={
                  <div className="user__create_content">
                    <p>Country - { v.country?.name }</p>
                    <br/>
                    { v.coords && v.coords[0] && v.coords[1] ?
                      <YMap onClick={ this.onMapClick } state={ v.coords } coords={ v.coords } zoom={ 9 }/>
                      : <p className="center">No data</p> }
                  </div>
                }
              />
            </td>
            { +role?.role === 1 ? <td className="td">
              <Link to={ `/city_update/${ v.id }` } title="Edit">
                <FontAwesomeIcon icon={ faEdit } className="edit"/>
              </Link>
            </td> : null }
          </tr> : <p className="center">No data</p>
        )) }
        </tbody>
      </table>
    );
  }
}

export default withRouter(CityTable);
