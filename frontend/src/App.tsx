import { useState } from "react";
import "./App.css";
import ConsumptionChart from "./components/ConsumptionChart";
import UserForm from "./components/UserForm";

function App() {
  const [consumption, setConsumption] = useState<number | undefined>(undefined);
  const [estimates, setEstimates] = useState<IApplianceEstimates>({});

  return (
    <div className="App">
      <UserForm
        consumption={consumption}
        setConsumption={setConsumption}
        setEstimates={setEstimates}
      />
      <ConsumptionChart estimates={estimates} consumption={consumption}/>
    </div>
  );
}

export default App;
