from dataclasses import dataclass
from enum import Enum
from typing import Optional


class UsageCategory(Enum):
    """Appliance category based on daily hours of usage."""
    F = (6, 8)
    A = (1, 4)
    L = (4, 24)

    def min(self):
        return self.value[0]

    def max(self):
        return self.value[1]


@dataclass
class Appliance:
    name: str
    category: UsageCategory
    # Power in kW
    power: float
    # Consumption in kWh
    min_consumption: Optional[float] = None
    mean_consumption: Optional[float] = None
    max_consumption: Optional[float] = None

    def consumption_dict(self) -> dict[str, float]:
        return {
            "min": self.min_consumption,
            "mean": self.mean_consumption,
            "max": self.max_consumption
        }
