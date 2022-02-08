import React, { Component } from 'react';
import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { Close } from "@material-ui/icons";

class FileEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
    }
  }

  handleChange = (ev) => {
    const files = [...ev.target.files];
    _.forEach(files, (file) => {
      file.preview = URL.createObjectURL(file);
    })
    this.setState({files})
    this.props.onChange(ev, files);
    ev.target.value = '';
  }

  close = () => {
    this.setState({files: []})
  }

  render() {
    const {className, title, onClick, ...props} = this.props;
    const {files} = this.state;
    return (
      <div className="edit_image_content">
        { !_.isEmpty(files) ? <span className="close_avd" onClick={ () => {
            onClick()
            this.close()
          } } title="Remove"><Close/></span>
          : null }
        <label className={ className } title={ title }>
          <div className="emptyFile__content">
            <FontAwesomeIcon style={ {color: '#3d3d3d', fontSize: '24px'} } icon={ faCamera }/>
          </div>
          <input { ...props } type="file" onChange={ this.handleChange }/>
        </label>
      </div>
    );
  }
}

export default FileEdit;
