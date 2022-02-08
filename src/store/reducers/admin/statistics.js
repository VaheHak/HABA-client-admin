import * as statisticsAction from "../../actions/admin/statistics";

const initialState = {
  statistics: {},
  statisticsStatus: '',
}

export default function reducer(state = initialState, action) {

  switch ( action.type ) {
    case statisticsAction.GET_STATISTICS.REQUEST: {
      return {
        ...state,
        statisticsStatus: 'request',
      }
    }
    case statisticsAction.GET_STATISTICS.SUCCESS: {
      const {data} = action.payload.data;
      return {
        ...state,
        statisticsStatus: 'success',
        statistics: data,
      }
    }
    case statisticsAction.GET_STATISTICS.FAIL: {
      return {
        ...state,
        statisticsStatus: 'fail',
      }
    }

    default: {
      return state;
    }
  }
}
