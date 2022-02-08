import React, { Component } from 'react';
import { Map, RoutePanel, YMaps } from "react-yandex-maps";
import _ from "lodash";

class RouteMap extends Component {

	render() {
		const {onChange, coordinates} = this.props;

		return (<YMaps enterprise query={ {lang: 'en_RU', apikey: '0d2ae518-d1d0-4f48-8a2e-9e484579e4e1'} }>
			<Map
				width={ '100%' }
				height={ 300 }
				defaultState={ {
					center: [40.785269, 43.841680], zoom: 9, controls: [],
				} }
				onBoundsChange={ onChange }
			>
				<RoutePanel options={ {float: 'right'} } instanceRef={ (ref) => {
					if (ref && !_.isEmpty(coordinates) && !_.isEmpty(_.get(coordinates, 0))
						&& !_.isEmpty(_.get(coordinates, 1))){
						ref.routePanel.state.set({
							fromEnabled: false,
							from: _.get(coordinates, 0)?.map(Number),
							to: _.get(coordinates, 1)?.map(Number),
							type: "auto"
						});
					}
				} }/>
			</Map>
		</YMaps>);
	}
}

export default RouteMap;
