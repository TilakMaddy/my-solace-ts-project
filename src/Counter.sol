// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract Counter {
    uint256 public count;

    event Incremented(uint256 newCount);

    function increment() external {
        unchecked {
            count += 1;
        }
        emit Incremented(count);
    }

    function incBy(uint256 by) external {
        count += by;
        emit Incremented(count);
    }
}
