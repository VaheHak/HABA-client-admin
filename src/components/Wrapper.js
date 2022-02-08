import React, { Component } from 'react';
import Header from "./Header";
import Footer from "./Footer";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { getAccount } from "../store/actions/admin/users";
import { socketInit } from "../store/actions/admin/socket";

class Wrapper extends Component {
  static defaultProps = {
    showFooter: true,
  }

  componentDidMount() {
    const {token} = this.props;
    if (token){
      this.props.getAccount();
      this.props.socketInit(token);
    }
  }

  render() {
    const {showFooter, token} = this.props;
    if (!token){
      return <Redirect to="/"/>
    }
    return (
      <>
        <Header/>
        <div className="content">
          { this.props.children }
        </div>
        { showFooter ? <Footer/> : null }
      </>
    );
  }

}

const mapStateToProps = (state) => ({
  token: state.users.token,
});

const mapDispatchToProps = {
  getAccount,
  socketInit,
}

const WrapperContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Wrapper)

export default WrapperContainer;
