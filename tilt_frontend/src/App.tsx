import { useState } from "react";
import "./App.css";
import ApplianceSelect from "./components/ApplianceSelect";

function App() {
  const [consumption, setConsumption] = useState<number | undefined>(undefined);
  const [estimates, setEstimates] = useState<IApplianceEstimates>({});

  return (
    <div className="App">
      <ApplianceSelect
        consumption={consumption}
        setConsumption={setConsumption}
        setEstimates={setEstimates}
      />
    </div>
  );
}

export default App;
