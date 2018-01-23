import React from 'react';
import {connect} from 'react-redux';
import {Link, Redirect} from 'react-router-dom';

import {fetchProtectedData, getCoinData, addCoinToList} from '../actions/protected-data';
import { saveCoinData } from '../actions/addNew';
import './Dashboard.css';
import Table from './table';
import SearchBar from './searchBar';
import Chart from './chart';
import AddCoinMenu from './add-coin-menu';
import './addcoin.css';

export class Dashboard extends React.Component {
    componentDidMount() {
        if (!this.props.loggedIn) {
            return;
        }
        console.log('second', this.props);
        // this.props.dispatch(fetchProtectedData());
        this.props.dispatch(getCoinData());
        // this.props.dispatch(yourCoinData());
    }

    state = {
        coinName:'',
        coinPrice: '',
        coinAmount: 0
    }

    showCoinMenu = () => {
        const coinMenu = document.getElementsByClassName('addCoinMenuContainer')[0];
        coinMenu.style.display = 'block';
    }

    addCoin = (coin) => {
        console.log('addcoin@', this.props);
        this.props.dispatch(saveCoinData(coin));
        //added to state to fetch on button
        this.setState(
            coin
        );
        console.log('addCoin is:', coin);
    }

    addToList = () => {
        console.log(this.state.coinData);
        this.props.dispatch(addCoinToList(null, this.state.coinData));
        console.log('ADD TO LIST DASH')
    }



    render() {
        // Only visible to logged in users
        if (!this.props.loggedIn) {
            return <Redirect to="/" />;
        }
        const dataDemo = [
          {name: 'Date A', CoinA: 4000, CoinB: 2400, CoinC: 2400},
          {name: 'Date B', CoinA: 3000, CoinB: 1398, CoinC: 2210},
          {name: 'Date C', CoinA: 2000, CoinB: 9800, CoinC: 2290},
          {name: 'Date D', CoinA: 2780, CoinB: 3908, CoinC: 2000},
          {name: 'Date E', CoinA: 1890, CoinB: 4800, CoinC: 2181},
          {name: 'Date F', CoinA: 2390, CoinB: 3800, CoinC: 2500},
          {name: 'Date G', CoinA: 3490, CoinB: 4300, CoinC: 2100},
        ];

        // const addToList = () => {
        //     return <Table selectedCoin = {this.state.coin} selectedCoinPrice = {this.state.price} />
        // }

        return (
            <div className="dashboard">
                <div className="dashContainer">
                    <div className="totalDisplay">
                        <h1>Potfolio Value</h1>
                        <div className="totalValue"><p>$9999,99</p></div>
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
                                    <Table coins={this.props.yourCoins}/>
                                </tbody>
                            </table>

                        </div>
                    </div>

                    <div className="addCoinMenuContainer">
                       <AddCoinMenu coins={this.props.data} addCoin = {this.addCoin} selectedCoin = {this.state.coin} selectedCoinPrice = {this.state.price} addCoinFunction = {this.addToList}/>
                    </div>

                    <div className="chartDisplay">
                        <div className="chart">
                            <Chart data={dataDemo} />
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
    console.log(currentUser);
    return {
        loggedIn: currentUser !== null,
        email: currentUser ? state.auth.currentUser.email : '',
        data: state.protectedData.data,
        yourCoins : state.protectedData.yourCoins
    };
};



export default connect(mapStateToProps)(Dashboard);
