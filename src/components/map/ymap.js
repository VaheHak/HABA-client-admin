import React, { Component } from 'react';
import { GeoObject, Map, Placemark, SearchControl, YMaps } from "react-yandex-maps";
import _ from "lodash";

class YMap extends Component {
	constructor(props) {
		super(props);
		this.state = {n: '', c: '', p: ''}
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const {name, state} = this.props;
		if (!_.isEmpty(name) && prevProps.name !== name){
			this.ymaps.geocode(name).then((result) => {
				const newCoords = result.geoObjects.get(0).geometry.getCoordinates();
				this.setState({n: name, c: newCoords || ''})
			});
		}
		if (!_.isEmpty(state) && prevProps.state !== state){
			this.ymaps.geocode(state).then((result) => {
				const name = result.geoObjects.get(0).properties.get('description');
				this.setState({p: name})
			});
		}
	}

	onYmapsLoad = (ymaps) => {
		const {onSuggestSelect, input} = this.props;
		this.ymaps = ymaps;
		if (this.ymaps && input){
			new this.ymaps.SuggestView(input.current).events.add("select", onSuggestSelect);
		}
	};

	render() {
		const {onClick, coords, state, zoom, coordinates, from, to, s} = this.props;
		const {n, c, p} = this.state;
		const pattern = /^-?[\d]{1,3}[.][\d]+$/;

		return (<YMaps
			enterprise
			query={ {
				ns: 'use-load-option', load: 'package.full', lang: 'en_RU', apikey: '0d2ae518-d1d0-4f48-8a2e-9e484579e4e1',
			} }>
			<Map state={ {
				center: !_.isEmpty(state) && pattern.test(state[0]) && pattern.test(state[1]) ? state : c ? c : [40.785269, 43.841680],
				zoom: zoom ? zoom : 7
			} }
			     width={ '100%' }
			     height={ 300 }
			     onLoad={ this.onYmapsLoad }
			     onBoundsChange={ s }
			     instanceRef={ map => (this.map = map) }
			     onClick={ onClick }
			>
				<SearchControl
					options={ {
						float: "left", maxWidth: 200, noPlacemark: true, resultsPerPage: 5,
					} }
				/>
				{ (!_.isEmpty(coords) && pattern.test(state[0]) && pattern.test(state[1])) || c ? <Placemark
					geometry={ !_.isEmpty(coords) ? coords : c ? c : coords }
					properties={ {
						balloonContent: !_.isEmpty(coords) ? coords : c ? c : coords,
						hintContent: !_.isEmpty(coords) ? coords : c ? c : coords,
						iconContent: n && _.isEmpty(coords) ? n : p
					} }
					options={ {
						preset: (n && _.isEmpty(coords)) || p ? 'islands#darkGreenStretchyIcon' : '',
					} }
				/> : null }
				{ !_.isEmpty(from) && pattern.test(from[0]) && pattern.test(from[1]) ? <Placemark
					geometry={ from }
					properties={ {
						balloonContent: from, hintContent: from, iconContent: 'From'
					} }
					options={ {
						preset: 'islands#darkGreenStretchyIcon'
					} }
				/> : null }
				{ !_.isEmpty(to) && pattern.test(to[0]) && pattern.test(to[1]) ? <Placemark
					geometry={ to }
					properties={ {
						balloonContent: to, hintContent: to, iconContent: 'To'
					} }
					options={ {
						preset: 'islands#redStretchyIcon'
					} }
				/> : null }
				{ !_.isEmpty(coordinates) && !_.isEmpty(coordinates[0]) && !_.isEmpty(coordinates[1]) ? <GeoObject
					geometry={ {
						type: 'LineString', coordinates: coordinates,
					} }
					options={ {
						geodesic: true, strokeWidth: 5,
					} }
				/> : null }
			</Map>
		</YMaps>);
	}
}

export default YMap;
