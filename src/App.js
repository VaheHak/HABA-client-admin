import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./pages/Login";
import AllUsers from "./pages/AllUsers";
import UserUpdate from "./pages/UserUpdate";
import Drivers from "./pages/Drivers";
import DriverUpdate from "./pages/DriverUpdate";
import Countries from "./pages/Countries";
import CountryUpdate from "./pages/CountryUpdate";
import City from "./pages/City";
import CityUpdate from "./pages/CityUpdate";
import Routes from "./pages/Route";
import Services from "./pages/Services";
import AddService from "./pages/AddService";
import ServiceUpdate from "./pages/ServiceUpdate";
import Ticket from "./pages/Ticket";
import AddTicket from "./pages/AddTicket";
import TicketUpdate from "./pages/TicketUpdate";
import Dashboard from "./pages/Dashboard";
import Partner from "./pages/Partner";
import PartnerUpdate from "./pages/PartnerUpdate";
import NotFound from "./pages/NotFound";
import AddPartner from "./pages/AddPartner";
import DeliveryTransport from "./pages/DeliveryTransport";
import DeliveryTransportUpdate from "./pages/DeliveryTransportUpdate";
import DeliveryOrders from "./pages/DeliveryOrders";
import AddOrder from "./pages/AddOrder";
import UpdateOrder from "./pages/UpdateOrder";
import ChooseService from "./pages/ChooseService";
import ActiveDrivers from "./pages/ActiveDrivers";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={ Login }/>
          <Route path="/all_users" exact component={ AllUsers }/>
          <Route path="/all_users/:page" exact component={ AllUsers }/>
          <Route path="/user_update/:page" exact component={ UserUpdate }/>
          <Route path="/countries" exact component={ Countries }/>
          <Route path="/countries/:page" exact component={ Countries }/>
          <Route path="/country_update/:page" exact component={ CountryUpdate }/>
          <Route path="/city" exact component={ City }/>
          <Route path="/city/:page" exact component={ City }/>
          <Route path="/city_update/:page" exact component={ CityUpdate }/>
          <Route path="/route" exact component={ Routes }/>
          <Route path="/route/:page" exact component={ Routes }/>
          <Route path="/drivers" exact component={ Drivers }/>
          <Route path="/drivers/:page" exact component={ Drivers }/>
          <Route path="/driver_update/:page" exact component={ DriverUpdate }/>
          <Route path="/active_drivers" exact component={ ActiveDrivers }/>
          <Route path="/partners" exact component={ Partner }/>
          <Route path="/partners/:page" exact component={ Partner }/>
          <Route path="/add_partner" exact component={ AddPartner }/>
          <Route path="/update_partner/:page" exact component={ PartnerUpdate }/>
          <Route path="/choose/service" exact component={ ChooseService }/>
          <Route path="/orders" exact component={ DeliveryOrders }/>
          <Route path="/add_order" exact component={ AddOrder }/>
          <Route path="/:id/:bId/update_orders/:oId" exact component={ UpdateOrder }/>
          <Route path="/services" exact component={ Services }/>
          <Route path="/services/:page" exact component={ Services }/>
          <Route path="/add_service" exact component={ AddService }/>
          <Route path="/update_service/:page" exact component={ ServiceUpdate }/>
          <Route path="/ticket" exact component={ Ticket }/>
          <Route path="/ticket/:page" exact component={ Ticket }/>
          <Route path="/add_ticket" exact component={ AddTicket }/>
          <Route path="/update_ticket/:page" exact component={ TicketUpdate }/>
          <Route path="/transport" exact component={ DeliveryTransport }/>
          <Route path="/transport/:page" exact component={ DeliveryTransport }/>
          <Route path="/update_transport/:page" exact component={ DeliveryTransportUpdate }/>
          <Route path="/dashboard" exact component={ Dashboard }/>

          <Route exact component={ NotFound }/>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
