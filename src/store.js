import { createStore, combineReducers, applyMiddleware } from 'redux';
import { reducer as formReducer } from 'redux-form';
import createSagaMiddleware from 'redux-saga';

import loaderReducer from './reducer/loader';
import authReducer from './reducer/auth';

import authSaga from './saga/auth';

const sagaMiddleware = createSagaMiddleware();

const reducers = combineReducers({
  loader: loaderReducer,
  auth: authReducer,
  form: formReducer,
});

const store = createStore(
  reducers,
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(authSaga);

export default store;
