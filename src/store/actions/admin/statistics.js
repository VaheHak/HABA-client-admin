import { define } from "../../../helpers/redux-request";
import Api from "../../../Api";

export const GET_STATISTICS = define('GET_STATISTICS');

export function getStatistic(toStartDate, fromStartDate, cargoToStartDate, cargoFromStartDate) {
  return GET_STATISTICS.request(() => Api.getStatistics(toStartDate, fromStartDate, cargoToStartDate, cargoFromStartDate)).takeLatest();
}
