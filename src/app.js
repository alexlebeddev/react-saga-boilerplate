import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.css';

import { setToken, dropUser, dropToken, loginConfirm } from './action/auth';

import Login from './container/login';
import Test from './container/test';

class App extends Component {
  constructor(...props) {
    super(...props);

    this.checkAuth(props[0]);
  }

  componentWillReceiveProps(props) {
    if (props.token !== this.props.token
      || props.user !== this.props.user) {
      this.checkAuth(props);
    }
  }

  checkAuth = (props) => {
    if (props.token && !props.user) {
      props.loginConfirm();
      return;
    }

    if (!props.token) {
      try {
        const lSore = JSON.parse(localStorage.getItem('token'));
        if (lSore) {
          props.setToken(lSore);

          if (props.location.pathname === '/login') {
            props.history.push('/');
          }

          return;
        }

        if (props.location.pathname !== '/login') {
          props.history.push('/login');
        }
      } catch (e) {
        props.dropToken();
        props.dropUser();

        if (props.location.pathname !== '/login') {
          props.history.push('/login');
        }
      }

      return;
    }

    if (props.token && props.location.pathname === '/login') {
      props.history.push('/');
    }
  }

  render() {
    return (<div>
      <Switch>
        {
          (this.props.user && this.props.token) &&
          (
            <Route exact path='/' component={Test}/>
          )
        }
        <Route exact path='/login' component={Login}/>
      </Switch>

      {this.props.loaderView && <div className="loader fade show" tabIndex="-1">
        <Spinner animation="border" variant="primary">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>}
    </div>);
  }
}

App.propTypes = {
  user: PropTypes.object,
  token: PropTypes.object,
  loaderView: PropTypes.bool.isRequired,
  setToken: PropTypes.func.isRequired,
  dropToken: PropTypes.func.isRequired,
  dropUser: PropTypes.func.isRequired,
  loginConfirm: PropTypes.func.isRequired,
};

App.defaultProps = {
  user: null,
  token: null,
  loaderView: false,
};

const mapStateToProps = store => ({
  user: store.auth.user,
  token: store.auth.token,
  loaderView: store.loader.view,
});

const mapDispatchToProps = dispatch => {
  return {
    setToken: (data) => dispatch(setToken(data)),
    dropToken: () => dispatch(dropToken()),
    dropUser: () => dispatch(dropUser()),
    loginConfirm: () => dispatch(loginConfirm()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
