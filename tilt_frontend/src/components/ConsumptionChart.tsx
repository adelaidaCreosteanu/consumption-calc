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

interface IChartProps {
  estimates: IApplianceEstimates;
}

const data = [
  { name: "fdg", range: [12000, 13800], mean: 12900 },
  { name: "slt", range: [200, 500], mean: 350 },
  { name: "tv", range: [1000, 2500], mean: 1750 },
];

export default function ConsumptionChart(props: IChartProps) {
  if (Object.keys(props.estimates).length === 0) {
    return (
      <Typography id="chart-no-data-label" gutterBottom>
        No data to plot!
      </Typography>
    );
  } else {
    console.log("creating chart");
    return (
      <ComposedChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="range" fill="#8884d8" />
        <Scatter dataKey="mean" fill="red" />
      </ComposedChart>
    );
  }
}
