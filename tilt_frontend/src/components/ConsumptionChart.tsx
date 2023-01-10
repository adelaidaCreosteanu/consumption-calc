import { Typography } from "@mui/material";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  Scatter,
  ComposedChart,
} from "recharts";
import { applianceCodes } from "./UserForm";

interface IChartProps {
  estimates: IApplianceEstimates;
}

export default function ConsumptionChart(props: IChartProps) {
  const prepareData = () => {
    let data = [];

    for (let code in props.estimates) {
      let aplcData = props.estimates[code];
      // Convert from kWh to Wh
      let rangeWh = aplcData.range.map((r) => (r * 1000).toFixed(0) );
      let meanWh = (aplcData.mean * 1000).toFixed(0);
      // Convert appliance codes to names
      let fullName = applianceCodes[code as keyof typeof applianceCodes];

      data.push({
        name: fullName,
        range: rangeWh,
        mean: meanWh,
      });
    }

    return data;
  };

  if (Object.keys(props.estimates).length === 0) {
    return (
      <Typography id="chart-no-data-label" gutterBottom>
        No data to plot!
      </Typography>
    );
  } else {
    return (
      <ComposedChart
        width={600}
        height={400}
        data={prepareData()}
        margin={{
          top: 5,
          right: 30,
          left: 50,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" angle={-20}/>
        <YAxis label={{ value: 'Consumption in Wh', angle: -90, position: 'left' }}/>
        <Tooltip />
        <Legend verticalAlign="bottom" />
        <Bar dataKey="range" fill="#8884d8" />
        <Scatter dataKey="mean" fill="blue" />
      </ComposedChart>
    );
  }
}
