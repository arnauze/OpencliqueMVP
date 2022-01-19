import {
  FETCH_PLACE_NEAR_BY_REQUEST,
  FETCH_PLACE_NEAR_BY_SUCCESS,
  FETCH_PLACE_NEAR_BY_FAILURE,
} from '../types/types';
import {postApi} from './api';

export const fetchPlaceNearByRequest = () => ({
  type: FETCH_PLACE_NEAR_BY_REQUEST,
});

export const fetchPlaceNearBySuccess = data => ({
  type: FETCH_PLACE_NEAR_BY_SUCCESS,
  data,
});

export const fetchPlaceNearByFailure = error => ({
  type: FETCH_PLACE_NEAR_BY_FAILURE,
  error,
});

export const fetchPlaceNearBy = apiData => dispatch => {
  dispatch(fetchPlaceNearByRequest());

  return postApi('/places/nearby', apiData)
    .then(data => {
      dispatch(fetchPlaceNearBySuccess(data));
    })
    .catch(error => {
      dispatch(fetchPlaceNearByFailure(error));
    });
};
