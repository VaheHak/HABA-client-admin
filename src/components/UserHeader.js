import React, { Component } from 'react';
import { connect } from "react-redux";
import { deleteToken } from "../store/actions/admin/users";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import Avatars from "./utils/Avatars";
import _ from "lodash";
import ModalButton from "./modals/modal";

class UserHeader extends Component {
  render() {
    const {title, myAccount, profileStatus} = this.props;
    const avatar = "/images/icons/avatar.jpg";

    return (
      <div className="user__header_content">
        <h3 className="users__title">{ title }</h3>
        <div className="user__header_right">
          { profileStatus === 'success' ?
            <div className='dfc'>
              <Avatars
                src={ avatar } alt="avatar"
                onError={ ev => {
                  ev.target.src = avatar
                } }/>
              <div>
                <h4>{ myAccount?.roles?.name } { myAccount?.id }</h4>
                <p title={ myAccount?.firstName + ' ' + myAccount?.lastName }>
                  { _.truncate(myAccount?.firstName, {
                    'length': 14,
                    'separator': ' '
                  }) } { _.truncate(myAccount?.lastName, {
                  'length': 14,
                  'separator': ' '
                }) }
                </p>
              </div>
            </div>
            : null }
          <ModalButton
            title={ " Log Out" }
            label={ " Log Out" }
            className={ "logout" }
            cl={ "log_out" }
            text={ "Are you sure you want to log out?" }
            div={ <><FontAwesomeIcon icon={ faSignOutAlt }/>&ensp;Log Out</> }
            enter={ "Yes" }
            onClick={ () => this.props.deleteToken() }
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  myAccount: state.users.myAccount,
  profileStatus: state.users.profileStatus,
})

const mapDispatchToProps = {
  deleteToken,
}

const UserHeaderContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserHeader)

export default UserHeaderContainer;
