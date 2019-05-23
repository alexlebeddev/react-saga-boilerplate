import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import LoginForm from '../component/login/loginForm';
import { loginRequest, loginError } from '../action/auth';

class Login extends Component {
  handleSubmit = values => {
    this.props.login(values);
    this.props.loginError(null);
  };

  render() {
    return (
      <div className="center_div">
        <div className="form_container">
          <LoginForm loginError={this.props.error} onSubmit={this.handleSubmit} />
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  error: PropTypes.arrayOf(PropTypes.object),
  login: PropTypes.func.isRequired,
  loginError: PropTypes.func.isRequired,
};

Login.defaultProps = {
  error: null,
};

const mapStateToProps = store => ({
  error: store.auth.error,
});

const mapDispatchToProps = dispatch => ({
  login: (data) => dispatch(loginRequest(data)),
  loginError: (data) => dispatch(loginError(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
