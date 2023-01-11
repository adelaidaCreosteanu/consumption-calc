import os
import sys

parentdir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
sys.path.append(parentdir)
import pytest

from src.types import Appliance, UsageCategory
from src.estimator import estimate, compute_min_max_consumption


@pytest.fixture(scope="session")
def appliances():
    return {
        "f": Appliance("Fridge", UsageCategory.F, power=2),
        "dwr": Appliance("Dishwasher", UsageCategory.A, power=2.5),
        "tv": Appliance("TV", UsageCategory.L, power=0.5),
        "ist": Appliance("Induction stove", UsageCategory.A, power=3),
        "lt": Appliance("Big light", UsageCategory.L, power=0.8),
    }


@pytest.fixture(params=[2, 3, 5])
def appliance_group(appliances, request):
    number = request.param
    aplcs = [appliances["f"], appliances["dwr"]]
    if number == 2:
        return aplcs
    aplcs.append(appliances["tv"])
    if number == 3:
        return aplcs
    aplcs.extend([appliances["ist"], appliances["lt"]])
    return aplcs


@pytest.mark.parametrize(
    "appliance_group, ex_min, ex_max",
    [(2, 14.5, 26.0), (3, 16.5, 38.0), (5, 17.35, 42.6)],
    indirect=["appliance_group"],
)
def test_compute_min_max_consumption(appliance_group, ex_min, ex_max):
    actual = compute_min_max_consumption(appliance_group)
    assert actual["min"] == ex_min
    assert actual["max"] == ex_max


@pytest.mark.parametrize("category",
                         [UsageCategory.F, UsageCategory.A, UsageCategory.L])
def test_estimate_single_appliances(category):
    if category == UsageCategory.A:
        power = 2
    else:
        power = 1

    a = Appliance("device", category, power)
    consumption = 6
    expected = {"range": [6.0, 6.0], "mean": 6.0}

    actual = estimate([a], consumption)
    assert actual[a.name] == expected


@pytest.mark.parametrize(
    "appliance_group, expected_vals",
    [
        # Two appliances
        (2, [{
            "range": [12.0, 16.0],
            "mean": 14.0
        }, {
            "range": [4.0, 8.0],
            "mean": 6.0
        }]),
        # Three appliances
        (3, [{
            "range": [12.0, 15.5],
            "mean": 13.75
        }, {
            "range": [2.5, 6.0],
            "mean": 4.25
        }, {
            "range": [2.0, 5.5],
            "mean": 2.0
        }]),
        # Five appliances
        (5, [{
            "range": [12.0, 14.65],
            "mean": 13.325
        }, {
            "range": [1.25, 2.454545454545455],
            "mean": 1.8522727272727275
        }, {
            "range": [1.0, 2.019230769230769],
            "mean": 1.0000000000000004
        }, {
            "range": [1.5, 2.9454545454545458],
            "mean": 2.2227272727272727
        }, {
            "range": [1.6, 3.230769230769231],
            "mean": 1.6000000000000008,
        }])
    ],
    indirect=["appliance_group"],
)
def test_estimate_appliance_group(appliance_group, expected_vals):
    actual = estimate(appliance_group, 20)

    for i in range(len(appliance_group)):
        name = appliance_group[i].name
        assert actual[name] == expected_vals[i]
