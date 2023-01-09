import { Box, Chip, FormControl, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, TextField } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";

const appliance_codes = {
    fdg: "Fridge",
    wmc: "Washing machine",
    tv: "TV",
    frz: "Freezer",
    dwr: "Dishwasher",
    isv: "Induction stove",
    slt: "Small Light",
    blt: "Big Light",
}

interface IProps {
    
}

function ApplianceSelect(props: IProps) {
    const [appliances, setAppliances] = useState<string[]>([]);
    const [consumption, setConsumption] = useState<number | undefined>(undefined);
  
    useEffect(() => {
        if (appliances.length > 0 && consumption) {
            sendComputeRequest()
        } else {
            
        }
    }, [appliances, consumption]);

    const sendComputeRequest = () => {
        fetch(
            `http://localhost:8000/consumptions/?total=${consumption}&appliances=${appliances.join()}`
          )
            .then((response) => response.json())
            .then();
    }

    const handleAppliancesChange = (event: SelectChangeEvent<typeof appliances>) => {
        const {
          target: { value },
        } = event;
        setAppliances(
          // On autofill we get a stringified value.
          typeof value === "string" ? value.split(",") : value
        );
      };

    const handleConsumptionChange = (event: ChangeEvent<HTMLInputElement>) => {
        const {
            target: { value },
          } = event;
          setConsumption(
            Number(value)
          );
    }
    
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
                        label={appliance_codes[value as keyof typeof appliance_codes]}
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
              <TextField id="consumption-input" label="Total consumption" variant="standard" 
              onChange={handleConsumptionChange}
              InputProps={{
                endAdornment: <InputAdornment position="end">kWh</InputAdornment>,
              }}/>
            </FormControl>
          </div>
        </div>
      );
}

export default ApplianceSelect;
    