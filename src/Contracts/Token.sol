// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;

contract Token {
    string  public name = "Token";
    string  public symbol = "TKN";
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

    mapping(address => uint256) internal rewards;


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


    receive() external payable {

    }
}