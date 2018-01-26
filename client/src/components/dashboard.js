/*TODO:
-Figure out what is going on with the Search component now. Somehow data(500) becomes overwritten.
*/
import React from 'react';
import {connect} from 'react-redux';
import {Link, Redirect} from 'react-router-dom';

import {fetchProtectedData, getCoinData, addCoinToList, pushEntryToState} from '../actions/protected-data';
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
        console.log('second', this.props);

//----!GET COIN DATA IS RUNNING UPON START, BUT IT ALSO HANDLES ADD TO LIST!
        this.props.dispatch(getCoinData());
//----!This shouldn't be empty!
        console.log("DATA:", this.props.data);
    }

//----!coinData is setState'd by addCoinToEntry() on searchBar.js! This has to go to the reducer state! State could be mutating data
    state = {}

    showCoinMenu = () => {
        const coinMenu = document.getElementsByClassName('addCoinMenuContainer')[0];
        coinMenu.style.display = 'block';
    }

//Fetches the selected coin and stores it in the state, then accesses by addToList().!!!!!!!THIS HAS TO BE IN THE PROP INSTEAD OF STATE
    addCoinToEntry = (coin) => {
        //I have to set this as a coin prop instead of using state
        this.setState(coin);
        console.log('addCoin is:', coin);
    }
//Fetches amount added by user and adds it to coinData in the STATE
    amountHandler = (event) =>{
        if(event.target.value < 0) {alert("Please Enter A Number");  return};
        console.log('EVENT STATE', this.state)
        console.log(event.target.value);
//----! ADDS AMOUNT TO THE STATE, IT HAS TO GO TO THE REDUCER!
        //this.props.somethingHere
        this.state.coinData.amount = event.target.value;
    }

//Adds selected coin to YourCoins State, which then is mapped in <Table />. Also saves coin to the collection.
//PROBLEM: <Table /> is mapping yourCoins on reload, so it doesn't show new coins until the page is reloaded.
//A change of state needs to happen in order to trigger a refresh
    addToList = () => {
        //the second parameter of addCoinToList is the entry
        console.log("!ADD TO LIST!",this.state.coinData);
//------!!! Sending null and "this.state.coinData" is creating a conflict in the Reducer
        this.props.dispatch(pushEntryToState(null, this.state.coinData));
        //this.props.addCoinToList(null, this.state.coinData)
//----!IT IS SAVING DATA FROM THE STATE, THIS ALSO HAS TO GO TO THE REDUCER AND PULL DATA FROM PROPS!
        this.props.dispatch(saveCoinData(this.state.coinData));

        //Add a return <table coins={this.state.coinData}>, but how to target the right div?
    }

    render() {
        // Only visible to logged in users
        if (!this.props.loggedIn) {
            return <Redirect to="/" />; 
        }

        // const addToList = () => {
        //     return <Table selectedCoin = {this.props.entry}  />
        // }

        console.log("STATE Render:",this.state, "PROP Render:", this.prop,this.props.data, this.props.yourCoins);

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
        
{/*                        <SearchBar coins={this.props.data} className="searchBar"/>*/}
    {/*                    <input type="text" name="coinName" />*/}
                        <div className="tableCoins">
                            <table>
                                <tbody>
                                    {this.props.yourCoins.map((item, index)=>{
                                        return <Table coin={item} key={index}/>
                                    })}                              
                                </tbody>
                            </table>

                        </div>
                    </div>

                    <div className="addCoinMenuContainer">
                       <AddCoinMenu coins={this.props.data} 
                       addCoinToEntry = {this.addCoinToEntry} 
                       selectedCoin = {this.state.coin} 
                       addCoinFunction = {this.addToList}
                       amountHandler = {this.amountHandler}
                       />
                    </div>

                    <div className="chartDisplay">
                        <div className="chart">
                            <Chart data={this.props.chartData} />
                        </div>
                        <div className="selectors">
                            <h1>View Coins:</h1>
                            <input type="radio" name="coin" value="BitCoin" /> BitCoin
                        </div>
                    </div>


    {/*                <br />
                    <div className="dashboard-username">
                        Email: {this.props.email}
                    </div>
                    <div className="dashboard-protected-data">
                        Protected data: {this.props.protectedData}
                    </div>
                    <br />
                    <Link to="/add">Add Entry</Link>*/}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const {currentUser} = state.auth;
    // console.log(currentUser);
    return {
        loggedIn: currentUser !== null,
        email: currentUser ? state.auth.currentUser.email : '',
        data: state.protectedData.data,
        yourCoins : state.protectedData.yourCoins,
        chartData: state.protectedData.chartData
    };
};

//mapDispatchToProps breaks the searchBar
// const mapDispatchToProps = dispatch => {
//     return{
//         addCoinToList: () => ({type: 'ADD_COIN_TO_LIST'})
//     };
// };



export default connect(mapStateToProps)(Dashboard);
