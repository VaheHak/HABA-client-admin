import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

class WrapperLogout extends Component {

  render() {
    const {token} = this.props;
    if (token){
      return <Redirect to="/all_users"/>
    }
    return (
      <div>
        { this.props.children }
      </div>
    );
  }

}

const mapStateToProps = (state) => ({
  token: state.users.token,
});

const mapDispatchToProps = {}

const WrapperLogoutContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(WrapperLogout)

export default WrapperLogoutContainer;
