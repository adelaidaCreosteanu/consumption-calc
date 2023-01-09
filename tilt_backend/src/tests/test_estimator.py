import os
import sys

parentdir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
sys.path.append(parentdir)
import pytest

from src.types import Appliance, UsageCategory
from src.estimator import estimate, compute_min_consumption


def test_compute_min_consumption():
    f = Appliance("Fridge", UsageCategory.F, power=2)
    dwr = Appliance("Dishwasher", UsageCategory.A, power=2.5)
    tv = Appliance("TV", UsageCategory.L, power=0.5)
    ist = Appliance("Induction stove", UsageCategory.A, power=3)
    lt = Appliance("Big light", UsageCategory.L, power=0.8)

    actual = compute_min_consumption([f, dwr])
    assert actual == 14.5

    actual = compute_min_consumption([tv, ist, lt])
    assert actual == 5.6

    actual = compute_min_consumption([f, dwr, tv, ist, lt])
    assert actual == 17.35


@pytest.mark.parametrize("category",
                         [UsageCategory.F, UsageCategory.A, UsageCategory.L])
def test_estimate_single_appliances(category):
    if category == UsageCategory.A:
        power = 2
    else:
        power = 1

    a = Appliance("device", category, power)
    consumption = 6
    expected = {"min": 6.0, "mean": 6.0, "max": 6.0}

    actual = estimate([a], consumption)
    assert actual[a.name] == expected


def test_estimate_two_categories():
    f = Appliance("Fridge", UsageCategory.F, power=2)
    tv = Appliance("TV", UsageCategory.L, power=0.5)
    consumption = 21
    # expected ranges for consumption
    expected_fridge = {"min": 12.0, "mean": 14.0, "max": 16.0}
    expected_tv = {"min": 5.0, "mean": 7.0, "max": 9.0}

    actual = estimate([f, tv], consumption)
    assert actual[f.name] == expected_fridge
    assert actual[tv.name] == expected_tv


def test_estimate_three_categories():
    f = Appliance("Fridge", UsageCategory.F, power=2)
    dwr = Appliance("Dishwasher", UsageCategory.A, power=2.5)
    tv = Appliance("TV", UsageCategory.L, power=0.5)
    consumption = 20
    # expected ranges for consumption
    expected_fridge = {"min": 12.0, "mean": 13.75, "max": 15.5}
    expected_dwr = {"min": 2.5, "mean": 4.25, "max": 6.0}
    expected_tv = {"min": 2.0, "mean": 2.0, "max": 5.5}

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
    expected_fridge = {"min": 12.0, "mean": 13.325, "max": 14.65}
    expected_dwr = {
        "min": 1.25,
        "mean": 1.8522727272727275,
        "max": 2.454545454545455
    }
    expected_tv = {
        "min": 1.0,
        "mean": 1.0000000000000004,
        "max": 2.019230769230769
    }
    expected_ist = {
        "min": 1.5,
        "mean": 2.2227272727272727,
        "max": 2.9454545454545458
    }
    expected_lt = {
        "min": 1.6,
        "mean": 1.6000000000000008,
        "max": 3.230769230769231
    }

    actual = estimate([f, dwr, tv, ist, lt], consumption)
    assert actual[f.name] == expected_fridge
    assert actual[dwr.name] == expected_dwr
    assert actual[tv.name] == expected_tv
    assert actual[ist.name] == expected_ist
    assert actual[lt.name] == expected_lt
