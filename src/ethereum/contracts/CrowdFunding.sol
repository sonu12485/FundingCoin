pragma solidity ^0.4.17;

contract CrowdFunding
{
    struct Member
    {
        string name;
        address account;
        address[] campaigns;
        mapping(address => bool)myCampaigns;
        address[] contributedCampaigns;
        mapping(address => bool)myContributedCampaigns;
    }
    
    mapping(address => Member) accountToMember;
    
    mapping(address => bool) public registered;
    
    address[] public campaigns;
    
    modifier registeredMember(address _account)
    {
        require(registered[_account]);
        _;
    }

    function register(string _name) public 
    {
        require(!registered[msg.sender]);
        
        Member memory newMember = Member({
           name: _name,
           account: msg.sender,
           campaigns: new address[](0),
           contributedCampaigns: new address[](0)
        });
        
        accountToMember[msg.sender] = newMember;
        registered[msg.sender] = true;
    }
    
    function getMember(address _account) 
    public registeredMember(_account) view returns(
        string, address[], address[]
    )
    {
        Member memory member = accountToMember[_account];
        
        return (
            member.name,
            member.campaigns,
            member.contributedCampaigns
        );
    }
    
    function changeMemberDetails(string _name) public registeredMember(msg.sender)
    {
        Member storage member = accountToMember[msg.sender];
        
        member.name = _name;
    }
    
    function createCampaign(
        string _name, string _description, uint _min,string _startDate    
    ) public registeredMember(msg.sender)
    {
        address newCampaign = new Campaign(
            msg.sender, _name, _description, _min, _startDate
        );
        
        campaigns.push(newCampaign);
        
        Member storage member = accountToMember[msg.sender];
        
        member.campaigns.push(newCampaign);
        member.myCampaigns[newCampaign] = true;
    }
    
    function getAllCampaigns() public view returns(address[])
    {
        return campaigns;
    }
    
    function contribute(address _campaign) public registeredMember(msg.sender)
    {
        Member storage member = accountToMember[msg.sender];
        
        bool flag1 = member.myCampaigns[_campaign];
        require(!flag1);
        bool flag2 = member.myContributedCampaigns[_campaign];
        require(!flag2);
        
        member.contributedCampaigns.push(_campaign);
        member.myContributedCampaigns[_campaign] = true;
    }
}

contract Campaign
{
    struct Request
    {
        string name;
        string description;
        uint value;
        address recipient;
        bool complete;
        
        address[] approvers;
        mapping(address => bool) approvals;
        uint approvalCount;
    }
    
    string public name;
    string public description;
    uint public mimimunContribution;
    string public startDate;
    bool public active;
    address public manager;
    
    address[] public contributors;
    uint contributorsCount;
    mapping(address => bool) public isContributor;
    
    Request[] public requests;
    
    constructor(
        address _manager, string _name, string _description, uint _min,string _startDate
    ) public
    {
        manager = _manager;
        name = _name;
        description = _description;
        mimimunContribution = _min;
        startDate = _startDate;
        active = true;
        contributorsCount = 0;
    }
    
    function getSummary() public view returns(
        string, string, uint, string, bool, address, uint, address[], uint
    )
    {
        return (
            name,
            description,
            mimimunContribution,
            startDate,
            active,
            manager,
            address(this).balance,
            contributors,
            contributorsCount
        );
    }
    
    function contribute() public payable
    {
        require( msg.value >= mimimunContribution );
        require(!isContributor[msg.sender]);
        require(manager != msg.sender);
        
        contributors.push(msg.sender);
        isContributor[msg.sender] = true;
        contributorsCount++;
    }
    
    modifier onlyManager(address _address)
    {
        require(_address == manager);
        _;
    }
    
    function createRequest(
        string _name, string _description, uint _value, address _recipient
    ) public onlyManager(msg.sender) 
    {
        require(contributorsCount > 0);
        
        Request memory newRequest = Request({
            name: _name,
            description: _description,
            value: _value,
            recipient: _recipient,
            complete: false,
            approvers: new address[](0),
            approvalCount: 0
        });
        
        requests.push(newRequest);
    }
    
    function getRequest(uint _index) public view returns(
        string, string, uint, address, bool, address[], uint    
    )
    {
        Request memory request = requests[_index];
        
        return (
            request.name, request.description, request.value, request.recipient,
            request.complete, request.approvers, request.approvalCount
        );
    }
    
    function getRequestCount() public view returns(uint)
    {
        return requests.length;
    }
    
    function approveRequest(uint _index) public 
    {
        require(isContributor[msg.sender]);
        
        Request storage request = requests[_index];
        
        require(!request.approvals[msg.sender]);
        require(!request.complete);
        
        request.approvers.push(msg.sender);
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }
    
    function finalizeRequest(uint _index) public onlyManager(msg.sender)
    {
        Request storage request = requests[_index];
        
        require( request.approvalCount > (contributorsCount/2) );
        require(!request.complete);
        
        request.recipient.transfer(request.value);
        request.complete = true;
    }
}
