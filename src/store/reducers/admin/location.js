import * as locationAction from "../../actions/admin/location";

const initialState = {
  allCountries: {},
  allCities: {},
  allRoutes: {},
  countryCreate: {},
  cityCreate: {},
  routeCreate: {},
  countryUpdate: {},
  cityUpdate: {},
  countryDelete: {},
  cityDelete: {},
  routeDelete: {},
  countryStatus: '',
  cityStatus: '',
  routesStatus: '',
  countryCreateStatus: '',
  cityCreateStatus: '',
  routeCreateStatus: '',
  countryUpdateStatus: '',
  cityUpdateStatus: '',
  countryDeleteStatus: '',
  cityDeleteStatus: '',
  routeDeleteStatus: '',
  countryCreateErr: {},
  countryUpdateErr: {},
  cityCreateErr: {},
  cityUpdateErr: {},
  routeCreateErr: {},
  country: {},
  city: {},
}

export default function reducer(state = initialState, action) {

  switch ( action.type ) {
    case locationAction.CREATE_COUNTRY.REQUEST: {
      return {
        ...state,
        countryCreateStatus: 'request',
      }
    }
    case locationAction.CREATE_COUNTRY.SUCCESS: {
      const {data} = action.payload;
      return {
        ...state,
        countryCreateStatus: 'success',
        countryCreate: data,
      }
    }
    case locationAction.CREATE_COUNTRY.FAIL: {
      const {data} = action.payload;
      return {
        ...state,
        countryCreateStatus: 'fail',
        countryCreateErr: data.message,
      }
    }

    case locationAction.CREATE_CITY.REQUEST: {
      return {
        ...state,
        cityCreateStatus: 'request',
      }
    }
    case locationAction.CREATE_CITY.SUCCESS: {
      const {data} = action.payload;
      return {
        ...state,
        cityCreateStatus: 'success',
        cityCreate: data,
      }
    }
    case locationAction.CREATE_CITY.FAIL: {
      const {data} = action.payload;
      return {
        ...state,
        cityCreateStatus: 'fail',
        cityCreateErr: data.message,
      }
    }

    case locationAction.CREATE_ROUTE.REQUEST: {
      return {
        ...state,
        routeCreateStatus: 'request',
      }
    }
    case locationAction.CREATE_ROUTE.SUCCESS: {
      const {data} = action.payload;
      return {
        ...state,
        routeCreateStatus: 'success',
        routeCreate: data,
      }
    }
    case locationAction.CREATE_ROUTE.FAIL: {
      const {data} = action.payload;
      return {
        ...state,
        routeCreateStatus: 'fail',
        routeCreateErr: data.message,
      }
    }

    case locationAction.GET_COUNTRY.SUCCESS: {
      const {data} = action.payload.data;
      return {
        ...state,
        countryStatus: 'success',
        allCountries: data,
      }
    }
    case locationAction.GET_COUNTRY.FAIL: {
      return {
        ...state,
        countryStatus: 'fail',
      }
    }

    case locationAction.GET_ONE_COUNTRY.REQUEST: {
      return {
        ...state,
        countryStatus: 'request',
        country: {},
        countryUpdateErr: {}
      }
    }
    case locationAction.GET_ONE_COUNTRY.SUCCESS: {
      const {data} = action.payload.data;
      return {
        ...state,
        countryStatus: 'success',
        country: data,
      }
    }
    case locationAction.GET_ONE_COUNTRY.FAIL: {
      return {
        ...state,
        countryStatus: 'fail',
      }
    }

    case locationAction.GET_CITY.SUCCESS: {
      const {data} = action.payload.data;
      return {
        ...state,
        cityStatus: 'success',
        allCities: data,
      }
    }
    case locationAction.GET_CITY.FAIL: {
      return {
        ...state,
        cityStatus: 'fail',
      }
    }

    case locationAction.GET_ONE_CITY.REQUEST: {
      return {
        ...state,
        cityStatus: 'request',
        city: {},
        cityUpdateErr: {},
      }
    }
    case locationAction.GET_ONE_CITY.SUCCESS: {
      const {data} = action.payload.data;
      return {
        ...state,
        cityStatus: 'success',
        city: data,
      }
    }
    case locationAction.GET_ONE_CITY.FAIL: {
      return {
        ...state,
        cityStatus: 'fail',
      }
    }

    case locationAction.GET_ROUTE.SUCCESS: {
      const {data} = action.payload.data;
      return {
        ...state,
        routesStatus: 'success',
        allRoutes: data,
      }
    }
    case locationAction.GET_ROUTE.FAIL: {
      return {
        ...state,
        routesStatus: 'fail',
      }
    }

    case locationAction.UPDATE_COUNTRY.REQUEST: {
      return {
        ...state,
        countryUpdateStatus: 'request',
      }
    }
    case locationAction.UPDATE_COUNTRY.SUCCESS: {
      const {data} = action.payload;
      return {
        ...state,
        countryUpdateStatus: 'success',
        countryUpdate: data,
      }
    }
    case locationAction.UPDATE_COUNTRY.FAIL: {
      const {data} = action.payload;
      return {
        ...state,
        countryUpdateStatus: 'fail',
        countryUpdateErr: data.message,
      }
    }

    case locationAction.UPDATE_CITY.REQUEST: {
      return {
        ...state,
        cityUpdateStatus: 'request',
      }
    }
    case locationAction.UPDATE_CITY.SUCCESS: {
      const {data} = action.payload;
      return {
        ...state,
        cityUpdateStatus: 'success',
        cityUpdate: data,
      }
    }
    case locationAction.UPDATE_CITY.FAIL: {
      const {data} = action.payload;
      return {
        ...state,
        cityUpdateStatus: 'fail',
        cityUpdateErr: data.message,
      }
    }

    case locationAction.DELETE_COUNTRY.SUCCESS: {
      const {data} = action.payload;
      return {
        ...state,
        countryDeleteStatus: 'success',
        countryDelete: data,
      }
    }
    case locationAction.DELETE_COUNTRY.FAIL: {
      return {
        ...state,
        countryDeleteStatus: 'fail',
      }
    }

    case locationAction.DELETE_CITY.SUCCESS: {
      const {data} = action.payload;
      return {
        ...state,
        cityDeleteStatus: 'success',
        cityDelete: data,
      }
    }
    case locationAction.DELETE_CITY.FAIL: {
      return {
        ...state,
        cityDeleteStatus: 'fail',
      }
    }

    case locationAction.DELETE_ROUTE.SUCCESS: {
      const {data} = action.payload;
      return {
        ...state,
        routeDeleteStatus: 'success',
        routeDelete: data,
      }
    }
    case locationAction.DELETE_ROUTE.FAIL: {
      return {
        ...state,
        routeDeleteStatus: 'fail',
      }
    }


    case locationAction.DELETE_COUNTRY_DATA: {
      return {
        ...state,
        countryCreate: {},
        countryUpdate: {},
        countryDelete: {},
        countryCreateErr: {},
        countryUpdateErr: {},
        cityCreate: {},
        cityUpdate: {},
        cityDelete: {},
        cityCreateErr: {},
        cityUpdateErr: {},
        routeCreate: {},
        routeDelete: {},
        routeCreateErr: {},
      }
    }

    default: {
      return state;
    }
  }
}
