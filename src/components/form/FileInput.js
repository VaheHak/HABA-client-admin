import React, { Component } from 'react';
import _ from 'lodash';
import "../../assets/css/components/fileInput.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImage } from "@fortawesome/free-solid-svg-icons";
import Avatars from "../utils/Avatars";
import { Close } from "@material-ui/icons";

class FileInput extends Component {
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
    const {files} = this.state;
    const {onClick, ...props} = this.props;
    return (
      <div className="fileInput_content">
        <span className="close_avd" onClick={ () => {
          onClick()
          this.close()
        } } title="Remove"><Close/></span>
        <label className="fileInput">
          { !_.isEmpty(files) ? <ul>
              { files.map((file, key) => (
                <li key={ key }>
                  <Avatars src={ file.preview }
                           style={ {
                             width: '80px',
                             height: '80px',
                             boxShadow: '1px 1px 3px black',
                           } }
                           alt={ file.name }
                           onError={ ev => {
                             ev.target.src = "/images/icons/avatar.jpg"
                           } }
                  />
                  <p title={ file.name }>{ _.truncate(file.name, {
                    'length': 30,
                    'separator': ''
                  }) }</p>
                </li>
              )) }
            </ul> :
            <div className="emptyFile__content">
              <FontAwesomeIcon icon={ faFileImage } className="imageIcon"/>
              <span>Upload image</span>
            </div> }
          <input { ...props } type="file" onChange={ this.handleChange }/>
        </label>
      </div>
    );
  }
}

export default FileInput;
