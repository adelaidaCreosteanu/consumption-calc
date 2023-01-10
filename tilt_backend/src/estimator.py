import numpy as np

from src.types import Appliance, UsageCategory


def avg_power(appliances: list[Appliance]) -> float:
    if len(appliances):
        return np.mean([a.power for a in appliances])
    return 0


def group_by_category(
        appliances: list[Appliance]) -> dict[UsageCategory, list[Appliance]]:
    groups = {}
    for cat in UsageCategory:
        groups[cat] = [a for a in appliances if a.category == cat]
    return groups


def compute_min_consumption(appliances: list[Appliance]) -> float:
    groups = group_by_category(appliances)

    # 1. Get average power over appliances from the same group
    power_f = avg_power(groups[UsageCategory.F])
    power_a = avg_power(groups[UsageCategory.A])
    power_l = avg_power(groups[UsageCategory.L])

    # 2. Get min usage time
    min_f = UsageCategory.F.min()
    min_a = UsageCategory.A.min()
    min_l = UsageCategory.L.min()

    min_consumption = min_f * power_f + min_a * power_a + min_l * power_l
    return min_consumption


def estimate(appliances: list[Appliance],
             consumption: float) -> dict[str, float]:
    groups = group_by_category(appliances)

    # 1. Get average power over appliances from the same group
    power_f = avg_power(groups[UsageCategory.F])
    power_a = avg_power(groups[UsageCategory.A])
    power_l = avg_power(groups[UsageCategory.L])

    # 2. Get min and max usage time
    min_f, max_f = UsageCategory.F.min(), UsageCategory.F.max()
    min_a, max_a = UsageCategory.A.min(), UsageCategory.A.max()
    min_l, max_l = UsageCategory.L.min(), UsageCategory.L.max()

    # 3. Fine tune usage time based on total consumption
    if power_f:
        tmp = (consumption - (min_a * power_a + min_l * power_l)) / power_f
        if tmp < max_f:
            max_f = tmp

        tmp = (consumption - (max_a * power_a + max_l * power_l)) / power_f
        if tmp > min_f:
            min_f = tmp

    if power_a:
        tmp = (consumption - (min_f * power_f + min_l * power_l)) / power_a
        if tmp < max_a:
            max_a = tmp

        tmp = (consumption - (max_f * power_f + max_l * power_l)) / power_a
        if tmp > min_a:
            min_a = tmp

    if power_l:
        tmp = (consumption - (min_f * power_f + min_a * power_a)) / power_l
        if tmp < max_l:
            max_l = tmp

        tmp = (consumption - (max_f * power_f + max_a * power_a)) / power_l
        if tmp > min_l:
            min_l = tmp

    # 4. Compute one average solution
    mean_f = (min_f + max_f) / 2
    if power_l:
        # Select the mean and only solve the third variable
        mean_a = (min_a + max_a) / 2
        mean_l = (consumption -
                  (mean_f * power_f + mean_a * power_a)) / power_l
    elif power_a:
        # Solve now, as the third variable is 0 anyway
        mean_a = (consumption - (mean_f * power_f)) / power_a
        mean_l = 0
    else:
        # No appliances of category a or l
        mean_a = 0
        mean_l = 0

    # 5. Compute consumption per appliance
    for a in groups[UsageCategory.F]:
        n = len(groups[UsageCategory.F])
        a.min_consumption = (min_f / n) * a.power
        a.mean_consumption = (mean_f / n) * a.power
        a.max_consumption = (max_f / n) * a.power

    for a in groups[UsageCategory.A]:
        n = len(groups[UsageCategory.A])
        a.min_consumption = (min_a / n) * a.power
        a.mean_consumption = (mean_a / n) * a.power
        a.max_consumption = (max_a / n) * a.power

    for a in groups[UsageCategory.L]:
        n = len(groups[UsageCategory.L])
        a.min_consumption = (min_l / n) * a.power
        a.mean_consumption = (mean_l / n) * a.power
        a.max_consumption = (max_l / n) * a.power

    result = {a.name: a.consumption_dict() for a in appliances}
    return result
