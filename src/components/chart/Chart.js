import React from "react";
import { Axis, Chart, LineAdvance, Tooltip } from "bizcharts";
import moment from "moment-timezone";

const cols = {
  passengerSeat: {
    tickInterval: 1,
    alias: "Passengers",
  },
};

const LineChart = React.memo(({data}) => {
  return (
    <Chart padding={ [10, 20, 60, 40] } scale={ cols } autoFit height={ 400 } data={ data }>
      <Axis name="createdAt" label={ {formatter: val => moment(val).tz('UTC').calendar()} }/>
      <Tooltip title={ (title) => moment(title).tz('UTC').format('llll') }/>
      <LineAdvance
        shape="smooth"
        point
        area
        position="createdAt*passengerSeat"
        color="rgba(0, 118, 255, 0.9)"
      />
    </Chart>
  );
});

function Charts(props) {
  return (
    <div className="chart_content">
      <LineChart data={ props.data }/>
    </div>
  );
}

export default Charts;
