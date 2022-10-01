// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;


contract Dai {
    string  public name = "DAI";
    string  public symbol = "DAI";
    uint256 public totalSupply = 1000000000000000000000000; // 1 million tokens
    uint8   public decimals = 18;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    event TokensSold(
        address account,
        address token,
        uint amount,
        uint rate
    );

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor() {
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_value <= balanceOf[_from]);
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        
        emit Transfer(_from, _to, _value);
        return true;
    }

    function buyToken(uint amount) public payable{
        uint tokenAmount = amount;
        
        require(this.balanceOf(address(this)) >= tokenAmount);
        this.transfer(msg.sender, tokenAmount);

    }

    function sellToken(uint _amount, uint etherAmount) public{
        
        this.transferFrom(msg.sender, address(this), _amount);
        payable(msg.sender).transfer(etherAmount);
    }





    address[] internal stakeholders;
    mapping(address => uint256) internal stakes;

    function isStakeholder(address _address)
        public
        view
        returns(bool, uint256)
    {
        for (uint256 s = 0; s < stakeholders.length; s += 1){
            if (_address == stakeholders[s]) return (true, s);
        }
        return (false, 0);
    }

    function addStakeholder(address _stakeholder)
        public
    {
        (bool _isStakeholder, ) = isStakeholder(_stakeholder);
        if(!_isStakeholder) stakeholders.push(_stakeholder);
    }
    
    function removeStakeholder(address _stakeholder)
       public
    {
       (bool _isStakeholder, uint256 s) = isStakeholder(_stakeholder);
       if(_isStakeholder){
           stakeholders[s] = stakeholders[stakeholders.length - 1];
           stakeholders.pop();
       }
    }

    function stakeOf(address _address)
       public
       view
       returns(uint)
    {
       return stakes[_address];
    }

    function createStake(uint256 _stake) public payable
    {
       this.transferFrom(msg.sender, address(this), _stake);
       if(stakes[msg.sender] == 0) addStakeholder(msg.sender);
       stakes[msg.sender] = stakes[msg.sender]+= (_stake);
    }

   function removeStake(uint256 _stake, uint etherAmount) public
    {
       stakes[msg.sender] = stakes[msg.sender] -= (_stake);
       if(stakes[msg.sender] == 0) removeStakeholder(msg.sender);
       this.transfer(msg.sender, _stake);
       payable(msg.sender).transfer(etherAmount);
    }   


    receive() external payable {

    }
}