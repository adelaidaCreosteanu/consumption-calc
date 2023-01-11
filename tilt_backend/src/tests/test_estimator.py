import os
import sys

parentdir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
sys.path.append(parentdir)
import pytest

from src.types import Appliance, UsageCategory
from src.estimator import estimate, compute_min_max_consumption


def test_compute_min_max_consumption():
    f = Appliance("Fridge", UsageCategory.F, power=2)
    dwr = Appliance("Dishwasher", UsageCategory.A, power=2.5)
    tv = Appliance("TV", UsageCategory.L, power=0.5)
    ist = Appliance("Induction stove", UsageCategory.A, power=3)
    lt = Appliance("Big light", UsageCategory.L, power=0.8)

    actual = compute_min_max_consumption([f, dwr])
    assert actual["min"] == 14.5
    assert actual["max"] == 26.0

    actual = compute_min_max_consumption([tv, ist, lt])
    assert actual["min"] == 5.6
    assert actual["max"] == 27.6

    actual = compute_min_max_consumption([f, dwr, tv, ist, lt])
    assert actual["min"] == 17.35
    assert actual["max"] == 42.6


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


def test_estimate_two_categories():
    f = Appliance("Fridge", UsageCategory.F, power=2)
    tv = Appliance("TV", UsageCategory.L, power=0.5)
    consumption = 21
    # expected ranges for consumption
    expected_fridge = {"range": [12.0, 16.0], "mean": 14.0}
    expected_tv = {"range": [5.0, 9.0], "mean": 7.0}

    actual = estimate([f, tv], consumption)
    assert actual[f.name] == expected_fridge
    assert actual[tv.name] == expected_tv


def test_estimate_three_categories():
    f = Appliance("Fridge", UsageCategory.F, power=2)
    dwr = Appliance("Dishwasher", UsageCategory.A, power=2.5)
    tv = Appliance("TV", UsageCategory.L, power=0.5)
    consumption = 20
    # expected ranges for consumption
    expected_fridge = {"range": [12.0, 15.5], "mean": 13.75}
    expected_dwr = {"range": [2.5, 6.0], "mean": 4.25}
    expected_tv = {"range": [2.0, 5.5], "mean": 2.0}

    actual = estimate([f, dwr, tv], consumption)
    assert actual[f.name] == expected_fridge
    assert actual[dwr.name] == expected_dwr
    assert actual[tv.name] == expected_tv


def test_estimate_five_appliances():
    f = Appliance("Fridge", UsageCategory.F, power=2)
    dwr = Appliance("Dishwasher", UsageCategory.A, power=2.5)
    tv = Appliance("TV", UsageCategory.L, power=0.5)
    ist = Appliance("Induction stove", UsageCategory.A, power=3)
    lt = Appliance("Big light", UsageCategory.L, power=0.8)

    consumption = 20
    # expected ranges for consumption
    expected_fridge = {"range": [12.0, 14.65], "mean": 13.325}
    expected_dwr = {
        "range": [1.25, 2.454545454545455],
        "mean": 1.8522727272727275
    }
    expected_tv = {
        "range": [1.0, 2.019230769230769],
        "mean": 1.0000000000000004
    }
    expected_ist = {
        "range": [1.5, 2.9454545454545458],
        "mean": 2.2227272727272727
    }
    expected_lt = {
        "range": [1.6, 3.230769230769231],
        "mean": 1.6000000000000008,
    }

    actual = estimate([f, dwr, tv, ist, lt], consumption)
    assert actual[f.name] == expected_fridge
    assert actual[dwr.name] == expected_dwr
    assert actual[tv.name] == expected_tv
    assert actual[ist.name] == expected_ist
    assert actual[lt.name] == expected_lt
