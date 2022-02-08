import React, { Component } from 'react';
import Wrapper from "../components/Wrapper";
import '../assets/css/pages/dashboard.css'
import { connect } from "react-redux";
import { getStatistic } from "../store/actions/admin/statistics";
import Charts from "../components/chart/Chart";
import CargoCharts from "../components/chart/CargoChart";
import _ from "lodash";
import moment from "moment";
import UserHeader from "../components/UserHeader";

class Dashboard extends Component {
  static defaultProps = {
    today: new Date(),
  }

  constructor(props) {
    super(props);
    const {today} = this.props;
    this.state = {
      formData: {
        toStartDate: today.toISOString(), cargoToStartDate: today.toISOString(),
      },
    }
  }

  componentDidMount() {
    this.props.getStatistic();
  }

  handleChange = (path, ev) => {
    const {formData} = this.state;
    _.set(formData, path, ev);
    this.setState({formData});
    this.props.getStatistic(formData.toStartDate, formData.fromStartDate, formData.cargoToStartDate, formData.cargoFromStartDate,
    )
  }

  render() {
    const {statistics} = this.props;
    const {formData} = this.state;

    return (
      <Wrapper showFooter={ false }>
        <UserHeader title="Dashboard"/>
        <div className="container">
          <div className="users__content">
            <menu className="dashboard">
              <div className="details_content">
                <div className="details_item">
                  <b className="details__item_title">Cargo</b>
                  <div>
                    <h3>${ statistics.cargoPrice }</h3>
                    <i>Total Price</i>
                  </div>
                </div>
                <div className="details_item">
                  <b className="details__item_title">Cargo</b>
                  <div>
                    <h3>{ statistics.kg } kg</h3>
                    <i>Total Count</i>
                  </div>
                </div>
                <div className="details_item">
                  <b className="details__item_title">Intercity</b>
                  <div>
                    <h3>${ statistics.intercityPrice }</h3>
                    <i>Total Price</i>
                  </div>
                </div>
                <div className="details_item">
                  <b className="details__item_title">Intercity</b>
                  <div>
                    <h3>{ statistics.passengerSeat }</h3>
                    <i>Total Count</i>
                  </div>
                </div>
              </div>
              <div className="details_content">
                <div className="details_row">
                  <div className="users_count">
                    <p>Total Users</p>
                    <h3>{ statistics.users }</h3>
                  </div>
                  <div className="users_count">
                    <p>Total Drivers</p>
                    <h3>{ statistics.drivers }</h3>
                  </div>
                </div>
                <div className="details_row">
                  <div className="users_count">
                    <p>Total Partners</p>
                    <h3>{ statistics.partners }</h3>
                  </div>
                </div>
              </div>
              <div className="details_content">
                <div className="dashboard_charts">
                  <div className="dfc">
                    <p>
                      { moment(_.minBy(statistics.cargo, 'createdAt')?.createdAt).format('MMMM DD') }&ensp;-&ensp;
                      { moment(_.maxBy(statistics.cargo, 'createdAt')?.createdAt).format('MMMM DD') }
                    </p>
                    <div className="dashboard_select-date">
                      <input type="date"
                             value={ formData.cargoFromStartDate ? formData.cargoFromStartDate : '' }
                             className="ticket__filter_input"
                             max={ new Date().toISOString().substring(0, 10) }
                             onChange={ (event) => this.handleChange('cargoFromStartDate', event.target.value) }
                      />
                    </div>
                  </div>
                  <br/>
                  <CargoCharts data={ statistics.cargo }/>
                </div>
                <div className="dashboard_charts">
                  <div className="dfc">
                    <p>
                      { moment(_.minBy(statistics.intercity, 'createdAt')?.createdAt).format('MMMM DD') }&ensp;-&ensp;
                      { moment(_.maxBy(statistics.intercity, 'createdAt')?.createdAt).format('MMMM DD') }
                    </p>
                    <div className="dashboard_select-date">
                      <input type="date"
                             value={ formData.fromStartDate ? formData.fromStartDate : '' }
                             className="ticket__filter_input"
                             max={ new Date().toISOString().substring(0, 10) }
                             onChange={ (event) => this.handleChange('fromStartDate', event.target.value) }
                      />
                    </div>
                  </div>
                  <br/>
                  <Charts data={ statistics.intercity }/>
                </div>
              </div>
            </menu>
            <br/>
          </div>
        </div>
      </Wrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  statistics: state.statistics.statistics,
})

const mapDispatchToProps = {
  getStatistic
}

const DashboardContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Dashboard)

export default DashboardContainer;
