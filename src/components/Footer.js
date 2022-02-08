import React, { Component } from 'react';

class Footer extends Component {

  render() {
    return (
      <footer>
        <div className='container'>
          <div className='footer__row'>
            <div className='footer__copyright'>
              &copy; 2021-{ new Date().getFullYear() } HABA.<p>&ensp;All rights reserved</p>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
