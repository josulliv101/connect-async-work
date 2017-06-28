import { handleActions } from 'redux-actions';

const initialState = {
  loaded: false,
  loadState: {},
};

const reducer = handleActions({}, initialState);

export default reducer;
