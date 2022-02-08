import React, { Component } from 'react';
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import ModalButton from "../modals/modal";
import { deletingRoute } from "../../store/actions/admin/location";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { ArrowDropDown, ArrowDropUp } from "@material-ui/icons";

class RouteTable extends Component {
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
    const {history} = this.props;
    const {page} = this.props.match.params;
    this.setState({sort: !sort, sortKey: ev});
    this.props.onClick(page ? page : void 0, ev, !sort);
    history.push(`?sk=${ ev }&sort=${ !sort } `);
  }

  render() {
    const {data, onClick} = this.props;
    const {sort, sortKey} = this.state;

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
          <th className="th" onClick={ () => this.handleChange('from') }>
            <div className="center">
              <p>From</p>
              { sortKey === "from" ? sort === false ? <ArrowDropDown/> : <ArrowDropUp/> :
                <>&ensp;<FontAwesomeIcon icon={ faSort }/></> }
            </div>
          </th>
          <th className="th" onClick={ () => this.handleChange('to') }>
            <div className="center">
              <p>To</p>
              { sortKey === "to" ? sort === false ? <ArrowDropDown/> : <ArrowDropUp/> :
                <>&ensp;<FontAwesomeIcon icon={ faSort }/></> }
            </div>
          </th>
          <th className="th">Delete</th>
        </tr>
        </thead>
        <tbody>
        { _.map(data, (v, k) => (
          v ? <tr className="tr" key={ k }>
            <td className="td">{ v.id }</td>
            <td className="td">{ v.routesFrom?.name }</td>
            <td className="td">{ v.routesTo?.name }</td>
            <td className="td">
              <ModalButton
                title={ "Delete" }
                label={ "Delete Route" }
                className={ "c_map" }
                text={ "Are you sure you want to delete route?" }
                button={ <FontAwesomeIcon icon={ faTrashAlt }/> }
                enter={ "Yes" }
                onClick={ () => this.props.deletingRoute(v?.id).then(() => {
                  onClick();
                }) }
              />
            </td>
          </tr> : <p className="center">No data</p>
        )) }
        </tbody>
      </table>
    );
  }
}

const mapStateToProps = () => ({})

const mapDispatchToProps = {
  deletingRoute,
}

const RouteTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(RouteTable)

export default withRouter(RouteTableContainer);
