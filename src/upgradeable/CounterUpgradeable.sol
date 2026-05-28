// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract CounterUpgradeable is Initializable, OwnableUpgradeable, UUPSUpgradeable {
    uint256 public count;

    event Incremented(uint256 newCount);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address initialOwner, uint256 initialCount) external initializer {
        __Ownable_init(initialOwner);
        __UUPSUpgradeable_init();
        count = initialCount;
    }

    function increment() external {
        unchecked {
            count += 1;
        }
        emit Incremented(count);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
