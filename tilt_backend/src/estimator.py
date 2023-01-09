import numpy as np

from src.types import Appliance, UsageCategory


def avg_power(appliances: list[Appliance]) -> float:
    if len(appliances):
        return np.mean([a.power for a in appliances])
    return 0


def estimate(appliances: list[Appliance],
             consumption: float) -> dict[str, float]:
    app_f = [a for a in appliances if a.category == UsageCategory.F]
    app_a = [a for a in appliances if a.category == UsageCategory.A]
    app_l = [a for a in appliances if a.category == UsageCategory.L]

    # get average power, because time is split equally to appliances
    # of the same category
    power_f = avg_power(app_f)
    power_a = avg_power(app_a)
    power_l = avg_power(app_l)

    # Compute min and max time of usage
    min_f, max_f = UsageCategory.F.min(), UsageCategory.F.max()
    min_a, max_a = UsageCategory.A.min(), UsageCategory.A.max()
    min_l, max_l = UsageCategory.L.min(), UsageCategory.L.max()

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

    # Compute one average solution
    mean_f = (min_f + max_f) / 2
    if power_l:
        # Select the mean and only solve the third variable
        mean_a = (min_a + max_a) / 2
        mean_l = (consumption - (mean_f * power_f + mean_a * power_a)) / power_l
    elif power_a:
        # Solve now, as the third variable is 0 anyway
        mean_a = (consumption - (mean_f * power_f)) / power_a
        mean_l = 0
    else:
        # No appliances of category a or l
        mean_a = 0
        mean_l = 0

    for a in app_f:
        a.min_consumption = (min_f / len(app_f)) * a.power
        a.mean_consumption = (mean_f / len(app_f)) * a.power
        a.max_consumption = (max_f / len(app_f)) * a.power

    for a in app_a:
        a.min_consumption = (min_a / len(app_a)) * a.power
        a.mean_consumption = (mean_a / len(app_a)) * a.power
        a.max_consumption = (max_a / len(app_a)) * a.power

    for a in app_l:
        a.min_consumption = (min_l / len(app_l)) * a.power
        a.mean_consumption = (mean_l / len(app_l)) * a.power
        a.max_consumption = (max_l / len(app_l)) * a.power

    res = {a.name: a.consumption_dict() for a in appliances}
    return res
