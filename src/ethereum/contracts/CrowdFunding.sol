pragma solidity ^0.4.17;

contract CrowdFunding
{
    struct Member
    {
        string name;
        address account;
        address[] campaigns;
    }
    
    mapping(address => Member) accountToMember;
    
    mapping(address => bool) public registered;
    
    address[] public campaigns;
    
    modifier registeredMember(address _account)
    {
        require(registered[_account]);
        _;
    }

    function register(string _name, address _account) public 
    {
        require(!registered[_account]);
        
        Member memory newMember = Member({
           name: _name,
           account: _account,
           campaigns: new address[](0)
        });
        
        accountToMember[_account] = newMember;
        registered[_account] = true;
    }
    
    function getMember(address _account) 
    public registeredMember(_account) view returns(
        string, address[]
    )
    {
        Member memory member = accountToMember[_account];
        
        return (
            member.name,
            member.campaigns
        );
    }
    
    function changeMemberDetails(address _account, string _name) public registeredMember(_account)
    {
        Member storage member = accountToMember[_account];
        
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
    }
    
    function getAllCampaigns() public view returns(address[])
    {
        return campaigns;
    }
}

contract Campaign
{
    string public name;
    string public description;
    uint public mimimunContribution;
    string public startDate;
    bool public active;
    address public manager;
    
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
    }
    
    function getSummary() public view returns(
        string, string, uint, string, bool, address, uint
    )
    {
        return (
            name,
            description,
            mimimunContribution,
            startDate,
            active,
            manager,
            address(this).balance
        );
    }
}
