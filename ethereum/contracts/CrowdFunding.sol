pragma solidity ^0.4.17;

contract CrowdFunding
{
    struct Member
    {
        string name; 
        address account;
    }
    
    mapping(address => Member) accountToMember;
    
    mapping(address => bool) public registered;
    
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
           account: _account 
        });
        
        accountToMember[_account] = newMember;
        registered[_account] = true;
    }
    
    function getMember(address _account) public registeredMember(_account) view returns(string)
    {
        Member memory member = accountToMember[_account];
        
        return (member.name);
    }
    
    function changeMemberDetails(address _account, string _name) public registeredMember(_account)
    {
        Member storage member = accountToMember[_account];
        
        member.name = _name;
    }
}
