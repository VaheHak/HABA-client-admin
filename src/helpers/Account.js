class Account {

  static getToken() {
    return localStorage.getItem('token')
  }

  static setToken(token) {
    localStorage.setItem('token', token);
  }

  static getResetToken() {
    return localStorage.getItem('reset-token')
  }

  static setResetToken(token) {
    localStorage.setItem('reset-token', token);
  }

  static delete() {
    localStorage.removeItem('token');
    localStorage.removeItem('reset-token');
  }
}

export default Account
