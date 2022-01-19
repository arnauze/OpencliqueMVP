import {combineReducers} from 'redux';
import PlaceNearByReducer from './place-near-by';

export default combineReducers({
  placeNearByData: PlaceNearByReducer,
});
