import React, { Component } from 'react';
import { Map, Placemark, YMaps } from "react-yandex-maps";
import _ from "lodash";

class DriverMap extends Component {

	render() {
		const {onClick, coords, state, zoom, name} = this.props;
		const pattern = /^-?[\d]{1,3}[.][\d]+$/;

		return (<YMaps query={ {lang: 'en_RU'} }>
			<Map state={ {
				center: !_.isEmpty(state) && pattern.test(state[0]) && pattern.test(state[1]) ? state : [40.785269, 43.841680],
				zoom: zoom ? zoom : 10
			} }
			     width={ "100%" }
			     height={ "100%" }
			     instanceRef={ map => (this.map = map) }
			     onClick={ onClick }
			>
				{ (!_.isEmpty(coords) && pattern.test(state[0]) && pattern.test(state[1])) ? <Placemark
					modules={ ["geoObject.addon.balloon", "geoObject.addon.hint"] }
					geometry={ !_.isEmpty(coords) ? coords : [] }
					properties={ {
						balloonContent: !_.isEmpty(name) ? name?.firstName + ' ' + name?.lastName : "",
						hintContent: !_.isEmpty(coords) ? coords : "",
						iconContent: !_.isEmpty(name) ? name?.firstName || name?.username : "",
					} }
					options={ {
						preset: 'islands#darkGreenStretchyIcon' || '',
					} }
				/> : null }
			</Map>
		</YMaps>);
	}
}

export default DriverMap;
