// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PPPContract {
    address public government;
    address public contractor;
    address[] public users;
    address public regulator;
    uint public contractFunds;
    uint public initialInvestment;
    mapping(address => uint) public ratings;
    uint public completionPeriod;
    uint public currentMonth;
    uint public workCompleted;
    bool public regulatorApproval;
    bool public fundsReleased;

    constructor() {
        government = msg.sender;
        contractFunds = 4500000; // 45 lakh Indian rupees
        initialInvestment = 1500000; // 15 lakh Indian rupees
        completionPeriod = 4; // 4 months
        currentMonth = 1;
        workCompleted = 0;
        regulatorApproval = false;
        fundsReleased = false;
    }

    modifier onlyGovernment() {
        require(msg.sender == government, "Only government can call this function");
        _;
    }

    modifier onlyContractor() {
        require(msg.sender == contractor, "Only contractor can call this function");
        _;
    }

    modifier onlyUser() {
        require(isUser(msg.sender), "Only users can call this function");
        _;
    }

    modifier onlyRegulator() {
        require(msg.sender == regulator, "Only regulator can call this function");
        _;
    }

    function isUser(address _user) public view returns (bool) {
        for (uint256 i = 0; i < users.length; i++) {
            if (users[i] == _user) {
                return true;
            }
        }
        return false;
    }

    function addUser(address _user) external onlyGovernment {
        require(!isUser(_user), "User already exists");
        users.push(_user);
    }

    function assignContractor(address _contractor) external onlyGovernment {
        contractor = _contractor;
    }

    function assignRegulator(address _regulator) external onlyGovernment {
        regulator = _regulator;
    }

    function releaseInitialInvestment() external onlyGovernment {
        require(!fundsReleased, "Initial investment already released.");
        contractFunds -= initialInvestment;
    }

    function submitWork(uint _workCompleted) external onlyContractor {
        require(_workCompleted <= 25, "Invalid work completion. Maximum 25% of work can be completed in one month.");
        workCompleted += _workCompleted;
        currentMonth++;
    }

    function approveWork() external onlyUser {
        // User's work approval logic here
    }

    function rateWork(uint _rating) external onlyUser {
        require(_rating >= 1 && _rating <= 5, "Invalid rating. Rating should be between 1 and 5.");
        ratings[msg.sender] = _rating;
    }

    function inspectWork() external onlyRegulator {
        // Regulator's work inspection logic here
        if (currentMonth <= completionPeriod) {
            revert("Cannot inspect work before completion period");
        }
        
        uint totalRatings = 0;
        uint sumRatings = 0;

        for (uint256 i = 0; i < users.length; i++) {
            totalRatings++;
            sumRatings += ratings[users[i]];
        }

        uint averageRating = sumRatings / totalRatings;

        if (averageRating > 75) {
            regulatorApproval = true;
        }
    }

    function completeContract() external onlyContractor {
        require(currentMonth > completionPeriod, "Contract completion period not reached.");
        require(workCompleted >= 100, "Work completion not sufficient for contract completion.");
        require(regulatorApproval, "Regulator approval required.");
        fundsReleased = true;
    }
}
