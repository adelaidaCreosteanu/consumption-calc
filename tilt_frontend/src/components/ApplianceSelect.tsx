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
} from "@mui/material";
import { useEffect, useState } from "react";

const appliance_codes = {
  fdg: "Fridge",
  wmc: "Washing machine",
  tv: "TV",
  frz: "Freezer",
  dwr: "Dishwasher",
  isv: "Induction stove",
  slt: "Small Light",
  blt: "Big Light",
};

interface IProps {
  consumption: number | undefined;
  setConsumption: React.Dispatch<React.SetStateAction<number | undefined>>;
  setEstimates: React.Dispatch<React.SetStateAction<IApplianceEstimates>>;
}

function ApplianceSelect(props: IProps) {
  const [appliances, setAppliances] = useState<string[]>([]);
  const [minC, setMinC] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (appliances.length > 0) {
      sendMinRequest();
    } else {
      // If appliances list is emptied, set min consumption to 0
      setMinC(0);
    }
  }, [appliances]);

  useEffect(() => {
    if (appliances.length > 0 && props.consumption) {
      sendComputeRequest();
    } else {
      props.setEstimates({})
    }
  }, [appliances, props.consumption]);

  const sendMinRequest = () => {
    fetch(
      `http://localhost:8000/min_consumption?appliances=${appliances.join()}`
    )
      .then((response) => response.json())
      .then((min_consumption: number) => setMinC(min_consumption));
  };

  const sendComputeRequest = () => {
    fetch(
      `http://localhost:8000/estimate_appliances?total=${props.consumption}&appliances=${appliances.join()}`
    )
      .then((response) => response.json())
      .then((estimates: IApplianceEstimates) =>
        props.setEstimates(estimates)
      );
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
    <div>
      <div>
        <FormControl sx={{ m: 1, width: 300 }}>
          <InputLabel id="appliance-selection-label">Appliances:</InputLabel>
          <Select
            labelId="appliance-selection-label"
            id="appliance-selection"
            multiple
            value={appliances}
            onChange={handleAppliancesChange}
            input={<OutlinedInput id="select-appliance" label="Appliance" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={
                      appliance_codes[value as keyof typeof appliance_codes]
                    }
                  />
                ))}
              </Box>
            )}
          >
            {Object.entries(appliance_codes).map(([code, name]) => (
              <MenuItem key={code} value={code}>
                {name}
              </MenuItem>
            ))}
          </Select>
          <Slider
            aria-label="consumption-input"
            min={typeof minC === "number" ? minC : 0}
            max={75}
            value={props.consumption}
            onChange={handleSliderChange}
            valueLabelDisplay="auto"
          />
        </FormControl>
      </div>
    </div>
  );
}

export default ApplianceSelect;
