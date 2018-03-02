/*TO-DO:
-Historical Amount Handler and Snapshots
-E-mail Alerts
-Portfolio Percentages
-Diff % 
-Google Auth
-Transaction Journal
*/

import React from 'react';
import {connect} from 'react-redux';
import {Link, Redirect} from 'react-router-dom';

import {fetchProtectedData, getCoinData, addCoinToList, pushEntryToState, createColors, removeUserCoin} from '../actions/protected-data';
import { saveCoinData } from '../actions/addNew';
import './Dashboard.css';
import Table from './table';
import SearchBar from './searchBar';
import Chart from './chart';
import AddCoinMenu from './add-coin-menu';
import './addcoin.css';
import Total from './total';

export class Dashboard extends React.Component {
    componentDidMount() {
        if (!this.props.loggedIn) {
            return;
        }
        this.props.dispatch(createColors());
        this.props.dispatch(getCoinData());
    }

//State holds the selected coin data after the user input.
    state = {}

//Add Coin Menu Visibility Toggle
    showCoinMenu = () => {
        const coinMenu = document.getElementsByClassName('addCoinMenuContainer')[0];
        coinMenu.style.display = 'block';
    }

//Fetches the selected coin and stores it in the state, then accesses by addToList().!!!!!!!THIS HAS TO BE IN THE PROP INSTEAD OF STATE
    addCoinToEntry = (coin) => {
        //I have to set this as a coin prop instead of using state
        this.setState(coin);
        console.log("COIN BEING ADDED", coin);//it's creating the coin obj with the same _id. it needs to be a completely new obj.
        //if values are added first you will get NaN, this resets the amount to nothing after a coin is selected.
        document.getElementById('amountHandlerInput').value = '';
    }

// Fetches amount added by user and adds it to coinData in the STATE
    amountHandler = (event) =>{
        if(event.target.value < 0) {alert("Please Enter A Number");  return};
        this.state.coinData.amount = event.target.value;
    }

// Adds user selected coin to list and saves it in the coins collection.

    addToList = () => {
        this.props.dispatch(pushEntryToState(null, this.state.coinData, this.props.userId));
        this.props.dispatch(saveCoinData(this.state.coinData));
        document.getElementById('amountHandlerInput').value = '';
        document.getElementById('searchInput').value = '';
    }

    removeUserCoinHandler = (userId, coinName) => {
        console.log(userId, coinName);
        this.props.dispatch(removeUserCoin(userId, coinName));
    }

    render() {
        // Only visible to logged in users
        if (!this.props.loggedIn) {
            return <Redirect to="/" />; 
        }

        let yourCoins = 
        this.props.yourCoins.map((item, index)=>{
            return <Table coin={item} key={index} removeFunction={this.removeUserCoinHandler}/>
        })  

        console.log("PROP Render:", this.props);

        return (
            <div className="dashboard">
                <div className="dashContainer">
                    <div className="totalDisplay">
                        <h1>Potfolio Value</h1>
                        <div className="totalValue">
                            <Total coins={this.props.yourCoins}/>
                        </div>
                        <div className="percentChange"><p>+10.05% Change(24hrs)</p></div>
                    </div>

                    <div className="coinsDisplay">
                        <h1>Portfolio Breakdown</h1>
                        <table className="tableLable">
                            <tbody>
                                  <tr >
                                    <th>Currency</th>
                                    <th>Amount</th>
                                    <th>Price</th> 
                                    <th>Value</th>
                                </tr>
                            </tbody>
                        </table>

                        <div className="addCoin" onClick={this.showCoinMenu}> + Add Coin</div>

                        <div className="tableCoins">
                            <table>
                                <tbody>
                                   {yourCoins}                            
                                </tbody>
                            </table>

                        </div>
                    </div>
                {/*This is what shows up when you click '+ Add Coin', it's display is toggled between block or none*/}
                    <div className="addCoinMenuContainer">
                       <AddCoinMenu coins={this.props.unique} 
                       addCoinToEntry = {this.addCoinToEntry} 
                       selectedCoin = {this.state.coin} 
                       addCoinFunction = {this.addToList}
                       amountHandler = {this.amountHandler}
                       />
                    </div>

                    <div className="chartDisplay">
                        <div className="chart">
                            <Chart data = {this.props.chartData} colorRandom = {this.props.randomColor} userCoins = {this.props.yourCoins}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const {currentUser} = state.auth;
    return {
        loggedIn: currentUser !== null,
        email: currentUser ? state.auth.currentUser.email : '',
        data: state.protectedData.data,
        yourCoins : state.protectedData.yourCoins,
        chartData: state.protectedData.chartData,
        unique: state.protectedData.unique,
        randomColor: state.protectedData.randomColor,
        userId: state.protectedData.userId
    };
};

export default connect(mapStateToProps)(Dashboard);
