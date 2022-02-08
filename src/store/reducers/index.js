import { combineReducers } from "redux";
import users from './admin/users';
import location from './admin/location';
import service from './admin/service';
import statistics from './admin/statistics';
import transport from './admin/transport';
import delivery from './admin/delivery';

export default combineReducers({
  users,
  location,
  service,
  statistics,
  transport,
  delivery,
})
