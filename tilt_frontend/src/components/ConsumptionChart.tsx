import { Divider, Stack, Typography } from "@mui/material";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  Scatter,
  ComposedChart,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { applianceCodes } from "./UserForm";

const colors = [
  "#A6C80F",
  "#5DF087",
  "#6F87A5",
  "#63467F",
  "#562546",
  "#FF715B",
  "#F3DC31",
  "#41AFDF",
];

interface IChartData {
  name: string;
  range: number[];
  mean: number;
}

interface IChartProps {
  estimates: IApplianceEstimates;
  consumption: number | undefined;
}

export default function ConsumptionChart(props: IChartProps) {
  const prepareData = () => {
    // Prepare data for plotting
    let data: IChartData[] = [];
    let max = 0;

    for (let code in props.estimates) {
      let aplcData = props.estimates[code];

      // Convert from kWh to Wh
      let rangeWh = aplcData.range.map((r) => Math.round(r * 1000));
      let meanWh = Math.round(aplcData.mean * 1000);
      // Convert appliance codes to names
      let fullName = applianceCodes[code as keyof typeof applianceCodes];

      data.push({
        name: fullName,
        range: rangeWh,
        mean: meanWh,
      });

      // Set max
      if (rangeWh[1] > max) {
        max = rangeWh[1];
      }
    }
    return { data: data, max: max };
  };

  const renderCustomizedLabel = (args: any) => {
    // Render pie chart labels on top of segments
    const RADIAN = Math.PI / 180;
    let { cx, cy, midAngle, innerRadius, outerRadius, percent, index } = args;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const propsExist = () => {
    return Object.keys(props.estimates).length > 0 && props.consumption;
  };

  if (propsExist()) {
    let data = prepareData();
    return (
      <Stack
        spacing={5}
        sx={{ m: 1 }}
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        justifyContent="center"
        alignItems="center"
      >
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
          <Bar dataKey="range" fill="#8884d8">
            {data.data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Bar>
          <Scatter dataKey="mean" fill="blue" />
        </ComposedChart>

        <PieChart width={400} height={400}>
          <Pie
            dataKey="mean"
            data={data.data}
            cx="50%"
            cy="50%"
            outerRadius={150}
            labelLine={false}
            label={renderCustomizedLabel}
          >
            {data.data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </Stack>
    );
  } else {
    return (
      <Typography id="chart-no-data-label" gutterBottom>
        Select some appliances and total consumption to plot!
      </Typography>
    );
  }
}
