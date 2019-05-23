import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class Test extends Component {
  render() {
    return (
      <div>
        test
      </div>
    );
  }
}

Test.propTypes = {
};

Test.defaultProps = {
};

const mapStateToProps = store => ({
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Test);
