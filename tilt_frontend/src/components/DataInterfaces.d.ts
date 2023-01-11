interface IApplianceEstimates {
  // Each appliance has a dictionary containing numeric attributes.
  [aplc: string]: { range: number[]; mean: number; };
}

interface IConsumptionRange {
  min: number;
  max: number;
}
