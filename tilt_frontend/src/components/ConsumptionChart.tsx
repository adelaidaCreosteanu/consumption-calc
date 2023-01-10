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
    let max = 0;

    for (let code in props.estimates) {
      let aplcData = props.estimates[code];

      // Set max
      if (aplcData.range[1] * 1000 > max) {
        max = aplcData.range[1] * 1000
      }

      // Convert from kWh to Wh
      let rangeWh = aplcData.range.map((r) => (r * 1000).toFixed(0));
      let meanWh = (aplcData.mean * 1000).toFixed(0);
      // Convert appliance codes to names
      let fullName = applianceCodes[code as keyof typeof applianceCodes];

      data.push({
        name: fullName,
        range: rangeWh,
        mean: meanWh,
      });
    }

    return {data: data, max: max};
  };

  if (Object.keys(props.estimates).length === 0) {
    return (
      <Typography id="chart-no-data-label" gutterBottom>
        No data to plot!
      </Typography>
    );
  } else {
    let data = prepareData();
    return (
      <ComposedChart
        width={900}
        height={400}
        data={data.data}
        margin={{
          top: 5,
          right: 30,
          left: 50,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis unit="Wh" domain={[0, data.max]} />
        <Tooltip />
        <Legend verticalAlign="bottom" />
        <Bar dataKey="range" fill="#8884d8" />
        <Scatter dataKey="mean" fill="blue" />
      </ComposedChart>
    );
  }
}
