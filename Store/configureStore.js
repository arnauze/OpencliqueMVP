import { createStore } from 'redux';
import changeFilter from './Reducers/handle_filters'

export default createStore(changeFilter)