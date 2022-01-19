import {
  FETCH_PLACE_NEAR_BY_REQUEST,
  FETCH_PLACE_NEAR_BY_SUCCESS,
  FETCH_PLACE_NEAR_BY_FAILURE,
} from '../types/types';

const PlaceNearByReducer = (
  state = {
    data: null,
    error: null,
    isLoading: false,
  },
  action,
) => {
  switch (action.type) {
    case FETCH_PLACE_NEAR_BY_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case FETCH_PLACE_NEAR_BY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: action.data.data,
        error: null,
      };
    case FETCH_PLACE_NEAR_BY_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };
    default:
      return state;
  }
};

export default PlaceNearByReducer;
