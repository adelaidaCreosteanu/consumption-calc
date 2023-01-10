import { useState } from "react";
import "./App.css";
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
    </div>
  );
}

export default App;
