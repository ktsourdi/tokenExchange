import React, { Component } from 'react';
import Navbar from './Navbar.js';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import Icon from "react-crypto-icons";
import dai from './Dai';
import web3 from './web3';
import ReactDOM from 'react-dom';
import App from './App';
import Exchange from './Exchange.js';
import Vote from './Vote.js';



class Pool extends Component {

    constructor(props) {
        super(props)
        this.state = {
          account: '',
          ethBalance: '0',
          value1: '',
          value2: '',
          token: 'ETH',
          token2: 'DAI',
          rate: [1, 100, 1000], //Μας δείχνει πόσα tokens παίρνει κάποιος με 1 eth (με την σειρά των tokens eth, dai, tsrd)
          selectedRate1: '',
          selectedRate2: '',
          poolEthDai: [], //πίνακας με διευθύνσεις οι οποίες έχουν κάνει κατάθεση στο pool
          pointerPoolEthDai: [], //πίνακας 
          stakes: '0',
        };
        this.onChange1 = this.onChange1.bind(this);
        this.onChange2 = this.onChange2.bind(this);
        this.showsStake = this.showsStake.bind(this);
      }


      onChange1(e){
        const re = /^[0-9]*([,.][0-9]*)?$/;
        if (e.target.value === '' || re.test(e.target.value)) {
           this.setState({value1: e.target.value})
        }
        
        if(this.state.token === "ETH" && this.state.token2 === "DAI") {
          this.setState({value2: e.target.value/this.state.rate[0]*this.state.rate[1]}, 
            () => {console.log(this.state.value2)}
            )
        }

        if(this.state.token === "DAI" && this.state.token2 === "ETH") {
          this.setState({value2: e.target.value/this.state.rate[1]*this.state.rate[0]}, 
            () => {console.log(this.state.value2)}
            )
        }

        if(this.state.token === "ETH" && this.state.token2 === "TSRD") {
          this.setState({value2: e.target.value/this.state.rate[0]*this.state.rate[2]}, 
            () => {console.log(this.state.value2)}
            )
        }

        if(this.state.token === "TSRD" && this.state.token2 === "ETH") {
          this.setState({value2: e.target.value/this.state.rate[2]*this.state.rate[0]}, 
            () => {console.log(this.state.value2)}
            )
        }

        if(this.state.token === "DAI" && this.state.token2 === "TSRD") {
          this.setState({value2: e.target.value/this.state.rate[1]*this.state.rate[2]}, 
            () => {console.log(this.state.value2)}
            )
        }

        if(this.state.token === "TSRD" && this.state.token2 === "DAI") {
          this.setState({value2: e.target.value/this.state.rate[2]*this.state.rate[1]}, 
            () => {console.log(this.state.value2)}
            )
        }

        if(this.state.token ===  this.state.token2 && this.state.token!=='Επιλέξτε νόμισμα') {
          this.setState({value2: e.target.value}, 
            () => {console.log(this.state.value2)}
            )
        }
      }

     

     onChange2(e){
      const re = /^[0-9]*([,.][0-9]*)?$/;
      if (e.target.value === '' || re.test(e.target.value)) {
         this.setState({value2: e.target.value})
      }

      if(this.state.token === "ETH" && this.state.token2 === "DAI") {
        this.setState({value1: e.target.value*this.state.rate[0]/this.state.rate[1]}, 
          () => {console.log(this.state.value2)}
          )
      }

      if(this.state.token === "DAI" && this.state.token2 === "ETH") {
        this.setState({value1: e.target.value*this.state.rate[1]/this.state.rate[0]}, 
          () => {console.log(this.state.value2)}
          )
      }
    }  

    change(token) {
      this.setState({token:token})
    };

    change2(token) {
      this.setState({token2:token})
    };

    
    onclick = async () => {
      

      const accounts = await web3.eth.getAccounts();
      this.setState ({account: accounts[0]});


      if(this.state.account === undefined) {
        alert("Δεν έχετε συνδέσει κάποιο πορτοφόλι,  \nΘα μεταβείτε στην σελίδα σύνδεσης.")
        ReactDOM.render(<App />, document.getElementById('root'));
      }
      else if(this.state.token === 'Επιλέξτε νόμισμα' || this.state.token2 === 'Επιλέξτε νόμισμα') {
        alert("Παρακαλώ επιλέξτε νομίσματα.")
      }
      else if(this.state.value1 === '' || this.state.value2 === '') {
        alert("Παρακαλώ ορίστε ποσότητα νομισμάτων.")
      }
      else if(isNaN(parseFloat(this.state.value1)) || isNaN(parseFloat(this.state.value2))) {
        alert("Οι τιμές δεν συμπληρώθηκαν σωστά.")
      }
     

      else {
        if(this.state.token === 'ETH' && this.state.token2 === 'DAI') {
          dai.methods.createStake(web3.utils.toWei(String(this.state.value2, 'ether'))).send(
            {
              from: accounts[0],
              value: web3.utils.toWei(this.state.value1, 'ether')
            }
          );
        }
      }
    }

    showsStake = async () => {

      
      const accounts = await web3.eth.getAccounts();
      this.setState ({account: accounts[0]});

      if(this.state.account === undefined) {
        alert("Δεν έχετε συνδέσει κάποιο πορτοφόλι,  \nΘα μεταβείτε στην σελίδα σύνδεσης.")
        ReactDOM.render(<App />, document.getElementById('root'));
      }

      else {

        const _stakes = await dai.methods.stakeOf(accounts[0]).call();


        this.setState({stakes: _stakes.toString()/1000000000000000000}); 
        
        if(this.state.stakes === 0) {alert("Δεν έχετε υπόλοιπο στο pool.")}
        else {
          var answer = window.confirm("Θέλετε να κάνετε ανάληψη "+ this.state.stakes + " dai και " +_stakes/1000000000000000000/100 + " eth;");
          if (answer) {
              dai.methods.removeStake(web3.utils.toWei(String(_stakes/1000000000000000000, 'ether')), web3.utils.toWei(String(_stakes/1000000000000000000/100))).send(
                {
                  from: accounts[0]
                }
              );
          }
          else {
            
          }
        }
      }
  }

    
    render() {

    return (

      <div style={{backgroundColor:'blue'}}>              
        <Navbar account={this.state.account}/>
          <div className="container-fluid align-items-center h-100">
            <div className="align-items-center">
              <main role="main" className="col-lg-12 d-flex text-center align-items-center h-100">
                <div className="content mr-auto ml-auto align-items-center h-100" >
                  <Card
                    style={{
                      width: 600,
                      height: 630,
                      backgroundColor: "white",
                  
                      position: 'fixed',
                      top: '10%',
                      left: '30%'
                    }}
                  >
                    <Button 
                        onClick={ () => {ReactDOM.render(<Exchange />, document.getElementById('root'))}}
                        variant="light" 
                        size="lg"
                        style={{
                          width: 200
                        }}>SWAP</Button>
                    <Button 
                        onClick={ () => {ReactDOM.render(<Pool />, document.getElementById('root'))}}
                        variant="info" 
                        size="lg"
                        style={{
                          width: 200
                        }}>POOL</Button>
                    <Button 
                        onClick={ () => {ReactDOM.render(<Vote />, document.getElementById('root'))}}
                        variant="light" 
                        size="lg"
                        style={{
                          width: 200
                        }}>VOTE</Button>
                    <CardContent>
                      <Typography variant="h4" component="h2">
                        Pool
                      </Typography>
                      <Typography
                        style={{
                          marginBottom: 12,
                        }}
                        color="textSecondary"
                      >
                        Καταθέστε νομίσματα Eth και Dai!
                      </Typography>
                      <div class="form-group">
                        <div class="row align-items-center">
                          <div class="col-sm">
                            <input 
                            name= 'input1'
                            value={this.state.value1} 
                            onChange={this.onChange1}
                            placeholder="0.0"
                            style={{
                              margin: 20,
                              borderRadius:20,
                              height: 100,
                              width: 300
                            }}/> <br/>
                          </div>
                          <div class="col-sm">
                            <Dropdown>
                              <Dropdown.Toggle
                               variant="success" 
                               id="dropdown-basic"
                               style={{
                                width: 160
                               }}
                               >
                                <text>Eth</text>
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item onSelect={()=> (this.setState({value1: ''}),this.change("ETH"), this.setState({selectedRate1:0}))}><Icon name="eth" size={25} /> ETH </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                        </div>
                        <div class="row align-items-center">
                          <div class="col-sm">
                            <input 
                            name= 'input2'
                            value={this.state.value2} 
                            onChange={this.onChange2}
                            placeholder="0.0"
                            style={{
                              margin: 20,
                              borderRadius:20,
                              height: 100,
                              width: 300
                            }} />
                          </div>
                          <div class="col-sm">
                            <Dropdown>
                              <Dropdown.Toggle 
                              variant="success" 
                              id="dropdown-basic"
                              style={{
                                width: 160
                               }}>
                              <text>Dai</text>
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item onSelect={()=> (this.setState({value2: ''}),this.change2("DAI"), this.setState({selectedRate2:1}))}><Icon name="dai" size={25} /> DAI </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                        </div>
                        <h6>Κατάθεση Eth και Dai σε αναλογία 1 προς 100!</h6>
                      </div>
                     
                    </CardContent>
                    
                      <div className="d-grid gap-2">
                        <Button 
                        onClick={this.onclick}
                        variant="outline-warning" 
                        size="lg"
                        style={{
                          width: 400
                        }}>Κατάθεση</Button>
                      </div>
                      <div className="d-grid gap-2" style={{paddingTop: 20}}>
                        <Button 
                        onClick={this.showsStake}
                        variant="outline-info" 
                        size="md"
                        style={{
                          width: 300
                        }}>Κάντε ανάληψη των καταθέσεων σας.</Button>
                        
                      </div>
                  </Card>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
    }
}
export default Pool;