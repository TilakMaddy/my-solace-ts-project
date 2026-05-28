// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Test} from "forge-std/Test.sol";
import {Counter} from "../src/Counter.sol";

contract CounterTest is Test {
    Counter internal counter;

    function setUp() public {
        counter = new Counter(address(0xdead));
    }

    function test_IncrementsByOne() public {
        counter.increment();
        assertEq(counter.count(), 1);
    }

    function test_IncBy() public {
        counter.incBy(7);
        assertEq(counter.count(), 7);
    }
}
