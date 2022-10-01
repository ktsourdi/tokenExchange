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
import Token from './Token';
import Pool from './Pool.js';
import Vote from './Vote.js';



class Exchange extends Component {

    constructor(props) {
        super(props)
        this.state = {
          account: '',
          ethBalance: '0',
          value1: '',
          value2: '',
          token: 'Επιλέξτε νόμισμα',
          token2: 'Επιλέξτε νόμισμα',
          rate: [1, 100, 1000], //Μας δείχνει πόσα tokens παίρνει κάποιος με 1 eth (με την σειρά των tokens eth, dai, tsrd)
          selectedRate1: '',
          selectedRate2: ''
        };
        this.onChange1 = this.onChange1.bind(this);
        this.onChange2 = this.onChange2.bind(this);

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

      if(this.state.token === "ETH" && this.state.token2 === "TSRD") {
        this.setState({value1: e.target.value*this.state.rate[0]/this.state.rate[2]}, 
          () => {console.log(this.state.value2)}
          )
      }

      if(this.state.token === "TSRD" && this.state.token2 === "ETH") {
        this.setState({value1: e.target.value*this.state.rate[2]/this.state.rate[0]}, 
          () => {console.log(this.state.value2)}
          )
      }

      if(this.state.token === "DAI" && this.state.token2 === "TSRD") {
        this.setState({value1: e.target.value*this.state.rate[1]/this.state.rate[2]}, 
          () => {console.log(this.state.value2)}
          )
      }

      if(this.state.token === "TSRD" && this.state.token2 === "DAI") {
        this.setState({value1: e.target.value*this.state.rate[2]/this.state.rate[1]}, 
          () => {console.log(this.state.value2)}
          )
      }

      if(this.state.token ===  this.state.token2 && this.state.token2!=='Επιλέξτε νόμισμα') {
        this.setState({value1: e.target.value}, 
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

    changeRateUp(amount) {
      this.state.rate[0] = this.state.rate[0] + amount/100;
    }

    
    onclick = async () => {

      const accounts = await web3.eth.getAccounts();
      this.setState ({account: accounts[0]});


      if(this.state.account === undefined) {
        alert("Δεν έχετε συνδέσει κάποιο πορτοφόλι,  \nΘα μεταβείτε στην σελίδα σύνδεσης.")
        ReactDOM.render(<App />, document.getElementById('root'));
      }
      else if(this.state.token === 'Επιλέξτε νόμισμα' || this.state.token2 === 'Επιλέξτε νόμισμα') {
        alert("Παρακαλώ επιλέξτε νομίσματα.")
        } else if (this.state.token ===  this.state.token2){
          alert("Επιλέξτε διαφορετικά νομίσματα.")
        }
      else if(this.state.value1 === '' || this.state.value2 === '') {
        alert("Παρακαλώ ορίστε ποσότητα νομισμάτων.")
      }
      else if(isNaN(parseFloat(this.state.value1)) || isNaN(parseFloat(this.state.value2))) {
        alert("Οι τιμές δεν συμπληρώθηκαν σωστά.")
      }
     
     

      else {
        if(this.state.token === 'ETH' && this.state.token2 === 'TSRD') {
          await Token.methods.buyToken(web3.utils.toWei(String(this.state.value2, 'ether'))).send(
            {
              from: accounts[0],
              value: web3.utils.toWei(this.state.value1, 'ether')
            }
          );
        }

        if(this.state.token === 'TSRD' && this.state.token2 === 'ETH') {
          await Token.methods.sellToken(web3.utils.toWei(String(this.state.value1, 'ether')), web3.utils.toWei(String(this.state.value2, 'ether'))).send(
            {
              from: accounts[0]
            }
          );
        }

        if(this.state.token === 'ETH' && this.state.token2 === 'DAI') {
          await dai.methods.buyToken(web3.utils.toWei(String(this.state.value2, 'ether'))).send(
            {
              from: accounts[0],
              value: web3.utils.toWei(this.state.value1, 'ether')
            }
          );
        }

        if(this.state.token === 'DAI' && this.state.token2 === 'ETH') {
          await dai.methods.sellToken(web3.utils.toWei(String(this.state.value1, 'ether')), web3.utils.toWei(String(this.state.value2, 'ether'))).send(
            {
              from: accounts[0]
            }
          );
        }


        if(this.state.token === 'TSRD' && this.state.token2 === 'DAI') {
          Token.methods.sellToken(web3.utils.toWei(String(this.state.value1, 'ether')), web3.utils.toWei(String(this.state.value1/this.state.rate[2], 'ether'))).send(
            {
              from: accounts[0]
            }
          );
          dai.methods.buyToken(web3.utils.toWei(String(this.state.value2, 'ether'))).send(
            {
              from: accounts[0],
              value: web3.utils.toWei(String(this.state.value2/this.state.rate[1], 'ether'))
            }
          );
        }

        if(this.state.token === 'DAI' && this.state.token2 === 'TSRD') {
      
          dai.methods.sellToken(web3.utils.toWei(String(this.state.value1, 'ether')), web3.utils.toWei(String(this.state.value1/this.state.rate[1], 'ether'))).send(
            {
              from: accounts[0]
            }
          );
          
          Token.methods.buyToken(web3.utils.toWei(String(this.state.value2, 'ether'))).send(
            {
              from: accounts[0],
              value: web3.utils.toWei(String(this.state.value2/this.state.rate[2], 'ether'))
            }
          );
        }
      }
    }



    render() {
    
    let isotimia;
    if(this.state.token !== 'Επιλέξτε νόμισμα' && this.state.token2 !== 'Επιλέξτε νόμισμα') {
      isotimia = <h6>Με 1 {this.state.token} παίρνετε {this.state.rate[this.state.selectedRate2]/this.state.rate[this.state.selectedRate1]}  {this.state.token2} </h6>
    }

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
                      height: 550,
                      backgroundColor: "white",
                  
                      position: 'fixed',
                      top: '20%',
                      left: '30%'
                    }}
                  >
                    <Button 
                        onClick={() => {ReactDOM.render(<Exchange />, document.getElementById('root'))}}
                        variant="info" 
                        size="lg"
                        style={{
                          width: 200
                        }}>SWAP</Button>
                    <Button 
                        onClick={() => {ReactDOM.render(<Pool />, document.getElementById('root'))}}
                        variant="light" 
                        size="lg"
                        style={{
                          width: 200
                        }}>POOL</Button>
                    <Button 
                        onClick={() => {ReactDOM.render(<Vote />, document.getElementById('root'))}}
                        variant="light" 
                        size="lg"
                        style={{
                          width: 200
                        }}>VOTE</Button>
                    <CardContent>
                      <Typography variant="h4" component="h2">
                        Συναλλαγή
                      </Typography>
                      <Typography
                        style={{
                          marginBottom: 12,
                        }}
                        color="textSecondary"
                      >
                        Επιλέξτε συνδιασμό νομισμάτων:
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
                                <text>{this.state.token}</text>
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item onSelect={()=> (this.setState({value1: ''}),this.change("ETH"), this.setState({selectedRate1:0}))}><Icon name="eth" size={25} /> ETH </Dropdown.Item>
                                <Dropdown.Item onSelect={()=> (this.setState({value1: ''}),this.change("DAI"), this.setState({selectedRate1:1}))}><Icon name="dai" size={25} /> DAI </Dropdown.Item>
                                <Dropdown.Item onSelect={()=> (this.setState({value1: ''}),this.change("TSRD"), this.setState({selectedRate1:2}))}><Icon name="tsrd" size={25} /> Tsourdi Token</Dropdown.Item>
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
                              <text>{this.state.token2}</text>
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item onSelect={()=> (this.setState({value2: ''}),this.change2("ETH"), this.setState({selectedRate2:0}))}><Icon name="eth" size={25} /> ETH </Dropdown.Item>
                                <Dropdown.Item onSelect={()=> (this.setState({value2: ''}),this.change2("DAI"), this.setState({selectedRate2:1}))}><Icon name="dai" size={25} /> DAI </Dropdown.Item>
                                <Dropdown.Item onSelect={()=> (this.setState({value2: ''}),this.change2("TSRD"), this.setState({selectedRate2:2}))}><Icon name="tsrd" size={25} /> Tsourdi Token</Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                        </div>
                        {isotimia}
                      </div>
                     
                    </CardContent>
                    
                      <div className="d-grid gap-2">
                        <Button 
                        onClick={this.onclick}
                        variant="dark" 
                        size="lg"
                        style={{
                          width: 400
                        }}>Συναλλαγή</Button>
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
export default Exchange;

