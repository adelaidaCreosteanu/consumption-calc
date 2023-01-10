interface IApplianceEstimates {
  // Each appliance has a dictionary containing numeric attributes.
  [aplc: string]: { min: number; mean: number; max: number };
}
