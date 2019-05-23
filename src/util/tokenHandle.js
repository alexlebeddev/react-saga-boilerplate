import q from 'q';
import axios from 'axios';
import _ from 'lodash';

import store from '../store';
import { dropToken, dropUser, setToken } from '../action/auth';
import { showLoader, hideLoader } from '../action/loader';
import config from '../config/index';

const refreshTokenUrl = `${config.BASE_URL}/api/v1/access/refreshToken`;

export const refreshToken = (auth) => {
  let refreshToken = '';

  if (auth.token && auth.token.accessToken) {
    refreshToken = auth.token.refreshToken;
  }

  return axios({
    method: 'post',
    url: refreshTokenUrl,
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      refreshToken,
    },
  });
};

const tokenHandle = ({ method, url, headers = {}, data = {}, config = {}, params = {} }) => {
  const deferred = q.defer();

  const auth = store.getState().auth;

  store.dispatch(showLoader());

  if (auth.token && auth.token.accessToken) {
    headers.Authorization = `Bearer ${auth.token.accessToken}`;
  }

  axios({ method, url, headers, data, config, params })
    .then(res => {
      deferred.resolve(res);
      store.dispatch(hideLoader());
    })
    .catch(err => {
      if (err.response && err.response.data && _.isArray(err.response.data)) {
        const check = err.response.data.some(el => el.param === 'accessToken');

        if (!check) {
          deferred.reject(err);
          store.dispatch(hideLoader());
          return;
        }
      } else {
        deferred.reject(err);
        store.dispatch(hideLoader());
        return;
      }

      refreshToken(auth)
        .then(res => {
          store.dispatch(setToken(res.data));
          headers.Authorization = `Bearer ${auth.token.accessToken}`;

          axios({ method, url, headers, data, config, params })
            .then(res => {
              deferred.resolve(res);
              store.dispatch(hideLoader());
            })
            .catch((err) => {
              deferred.reject(err);
              store.dispatch(hideLoader());
            })
        })
        .catch(() => {
          store.dispatch(dropToken());
          store.dispatch(dropUser());
          store.dispatch(hideLoader());
          deferred.reject(err);
        })
    });

  return deferred.promise
};

export default tokenHandle;
