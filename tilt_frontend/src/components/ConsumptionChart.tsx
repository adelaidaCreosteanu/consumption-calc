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
} from "recharts";
import { applianceCodes } from "./UserForm";

interface IBarData {
  name: string;
  range: number[];
  mean: number;
}

interface IPieData {
  name: string;
  ratio: number;
}

interface IChartProps {
  estimates: IApplianceEstimates;
  consumption: number | undefined;
}

export default function ConsumptionChart(props: IChartProps) {
  const prepareData = () => {
    let data: IBarData[] = [];
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

  const preparePercentages = (data: IBarData[]) => {
    if (props.consumption) {
      // Convert total consumption to Wh
      let total = props.consumption * 1000;
      let prcs: IPieData[] = [];
      for (let d of data) {
        let p = Number(((Number(d.mean) / total) * 100).toFixed(2));
        prcs.push({
          name: d.name,
          ratio: p,
        });
      }
      return prcs;
    }
  };

  const propsExist = () => {
    return Object.keys(props.estimates).length > 0 && props.consumption;
  };

  if (propsExist()) {
    let data = prepareData();
    let percentages = preparePercentages(data.data);

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
          <Bar dataKey="range" fill="#8884d8" />
          <Scatter dataKey="mean" fill="blue" />
        </ComposedChart>

        <PieChart width={400} height={400}>
          <Pie
            dataKey="ratio"
            data={percentages}
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            label
          />
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
