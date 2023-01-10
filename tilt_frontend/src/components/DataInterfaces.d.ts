interface IApplianceEstimates {
  // Each appliance has a dictionary containing numeric attributes.
  [aplc: string]: { range: number[]; mean: number; };
}
