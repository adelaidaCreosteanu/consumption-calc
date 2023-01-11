import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Slider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

export const applianceCodes = {
  fdg: "Fridge",
  wmc: "Washing machine",
  tv: "TV",
  frz: "Freezer",
  dwr: "Dishwasher",
  isv: "Induction stove",
  slt: "Small Light",
  blt: "Big Light",
};

interface IFormProps {
  consumption: number | undefined;
  setConsumption: React.Dispatch<React.SetStateAction<number | undefined>>;
  setEstimates: React.Dispatch<React.SetStateAction<IApplianceEstimates>>;
}

export default function UserForm(props: IFormProps) {
  const [appliances, setAppliances] = useState<string[]>([]);
  const [minC, setMinC] = useState<number>(0);
  const [maxC, setMaxC] = useState<number>(75);

  useEffect(() => {
    if (appliances.length > 0) {
      sendMinMaxRequest();
    } else {
      // If appliances list is emptied, reset min and max
      setMinC(0);
      setMaxC(75);
    }
  }, [appliances]);

  useEffect(() => {
    if (appliances.length > 0 && props.consumption) {
      sendComputeRequest();
    } else {
      props.setEstimates({});
    }
  }, [appliances, props.consumption]);

  const sendMinMaxRequest = () => {
    fetch(
      `http://localhost:8000/min_max_consumption?appliances=${appliances.join()}`
    )
      .then((response) => response.json())
      .then((range: IConsumptionRange) => {
        setMinC(Math.ceil(range.min * 100) / 100);
        setMaxC(Math.floor(range.max * 100) / 100);
      });
  };

  const sendComputeRequest = () => {
    fetch(
      `http://localhost:8000/estimate_appliances?total=${
        props.consumption
      }&appliances=${appliances.join()}`
    )
      .then((response) => response.json())
      .then((estimates: IApplianceEstimates) => props.setEstimates(estimates));
  };

  const handleAppliancesChange = (
    event: SelectChangeEvent<typeof appliances>
  ) => {
    const {
      target: { value },
    } = event;
    setAppliances(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    props.setConsumption(Number(newValue));
  };

  return (
    <Stack direction="row" justifyContent="center" alignItems="center">
      <Stack spacing={4} sx={{ m: 10 }}>
        <TextField
          id="email"
          label="Email"
          variant="outlined"
          sx={{ width: 300 }}
        />

        <FormControl sx={{ width: 300 }}>
          <InputLabel id="appliance-selection-label">Appliances:</InputLabel>
          <Select
            labelId="appliance-selection-label"
            id="appliance-selection"
            multiple
            value={appliances}
            sx={{ width: 300 }}
            onChange={handleAppliancesChange}
            input={<OutlinedInput id="select-appliance" label="Appliance" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={applianceCodes[value as keyof typeof applianceCodes]}
                  />
                ))}
              </Box>
            )}
          >
            {Object.entries(applianceCodes).map(([code, name]) => (
              <MenuItem key={code} value={code}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ width: 300 }}>
          <Typography id="input-slider" gutterBottom>
            Daily consumption in kWh:
          </Typography>
          <Slider
            aria-label="consumption-input"
            min={minC}
            max={maxC}
            value={props.consumption ? props.consumption : 0}
            onChange={handleSliderChange}
            valueLabelDisplay="auto"
          />
        </FormControl>
      </Stack>
    </Stack>
  );
}
