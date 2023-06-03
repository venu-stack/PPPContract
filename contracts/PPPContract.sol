// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MultiSigWallet {
    address[] public approvers;
    mapping(address => bool) public isApprover;

    constructor(address[] memory _approvers) {
        approvers = _approvers;
        for (uint256 i = 0; i < _approvers.length; i++) {
            isApprover[_approvers[i]] = true;
        }
    }

    modifier onlyApprover() {
        require(isApprover[msg.sender], "Not an approver");
        _;
    }
}

contract PPPContract {
    address payable public government;
    address payable public contractor;
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
    MultiSigWallet public multiSigWallet;

    mapping(address => bool) public workApprovals;

    constructor(address _multiSigWallet) payable {
        government = payable(msg.sender);
        contractFunds = 4500000; // 45 lakh Indian rupees
        initialInvestment = 1500000; // 15 lakh Indian rupees
        completionPeriod = 4; // 4 months
        currentMonth = 1;
        workCompleted = 0;
        regulatorApproval = false;
        fundsReleased = false;
        multiSigWallet = MultiSigWallet(_multiSigWallet);
    }

    modifier onlyGovernment() {
        require(
            msg.sender == government,
            "Only government can call this function"
        );
        _;
    }

    modifier onlyContractor() {
        require(
            msg.sender == contractor,
            "Only contractor can call this function"
        );
        _;
    }

    modifier onlyUser() {
        require(isUser(msg.sender), "Only users can call this function");
        _;
    }

    modifier onlyRegulator() {
        require(
            msg.sender == regulator,
            "Only regulator can call this function"
        );
        _;
    }

    modifier onlyApprover() {
        require(multiSigWallet.isApprover(msg.sender), "Not an approver");
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

    function assignContractor(
        address payable _contractor
    ) external onlyGovernment {
        contractor = _contractor;
    }

    function assignRegulator(address _regulator) external onlyGovernment {
        regulator = _regulator;
    }

    function releaseInitialInvestment() external onlyGovernment {
        require(!fundsReleased, "Initial investment already released.");
        // contractFunds -= initialInvestment;
        require(
            address(this).balance >= initialInvestment,
            "Contract does not have enough funds."
        );
        contractFunds -= initialInvestment;
        contractor.transfer(initialInvestment);
    }

    function submitWork(uint _workCompleted) external onlyContractor {
        require(
            _workCompleted <= 25,
            "Invalid work completion. Maximum 25% of work can be completed in one month."
        );
        workCompleted += _workCompleted;
        currentMonth++;
    }

    function approveWork() external onlyUser {
        workApprovals[msg.sender] = true;
    }

    function rateWork(uint _rating) external onlyUser {
        require(
            _rating >= 1 && _rating <= 5,
            "Invalid rating. Rating should be between 1 and 5."
        );
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

        if (averageRating > 3) {
            regulatorApproval = true;
        }
    }

    function completeContract() external onlyContractor {
        require(
            currentMonth > completionPeriod,
            "Contract completion period not reached."
        );
        require(
            workCompleted >= 100,
            "Work completion not sufficient for contract completion."
        );
        require(
            regulatorApproval,
            "Work must be approved by regulator before contract completion."
        );

        uint totalRatings = 0;
        uint sumRatings = 0;

        for (uint256 i = 0; i < users.length; i++) {
            totalRatings++;
            sumRatings += ratings[users[i]];
        }

        uint averageRating = sumRatings / totalRatings;

        // Require that the average rating is above 3 to release the funds
        require(
            averageRating > 3,
            "Average rating of the final project should be above 3."
        );

        require(
            address(this).balance >= contractFunds,
            "Contract does not have enough funds."
        );

        // Transfer the remaining contractFunds to the contractor
        contractor.transfer(contractFunds);

        fundsReleased = true;
    }
}
