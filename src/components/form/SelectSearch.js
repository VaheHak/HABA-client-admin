import React, { Component, Fragment } from 'react';
import Select from 'react-select';

export default class SearchSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isClearable: true,
      isSearchable: true,
    };
  }

  render() {
    const {isClearable, isSearchable} = this.state;
    const {name, placeholder, data, value, onChange, errors, onScroll, onScrollTop, ...others} = this.props;

    return (
      <Fragment>
        <Select
          { ...others }
          options={ data }
          defaultValue={ value }
          name={ name }
          menuShouldScrollIntoView={ true }
          placeholder={ placeholder }
          onChange={ onChange }
          className="basic-single"
          classNamePrefix="select"
          isLoading={ !data }
          isClearable={ isClearable }
          isSearchable={ isSearchable }
          onMenuScrollToTop={ onScrollTop }
          onMenuScrollToBottom={ onScroll }
        />
        <p className='err' style={ {marginTop: '5px'} }>{ errors ? errors : null }</p>
      </Fragment>
    );
  }
}
