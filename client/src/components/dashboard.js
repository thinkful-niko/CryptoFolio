import React from 'react';
import {connect} from 'react-redux';
import {Link, Redirect} from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

import {fetchProtectedData, getCoinData} from '../actions/protected-data';
import './Dashboard.css';
import Table from './table';
import SearchBar from './searchBar';
import Chart from './chart';

export class Dashboard extends React.Component {
    componentDidMount() {
        if (!this.props.loggedIn) {
            return;
        }
        // this.props.dispatch(fetchProtectedData());
        this.props.dispatch(getCoinData());
    }

    addCoin(coin){
        console.log(coin);
    }


    render() {
        // Only visible to logged in users
        if (!this.props.loggedIn) {
            return <Redirect to="/" />;
        }
        const dataDemo = [
          {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
          {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
          {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
          {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
          {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
          {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
          {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
        ];

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

                        <div className="addCoin"  onClick = { () => { this.props.addCoin('hi') } } > + Add Coin</div>
                        <SearchBar coins={this.props.data} className="searchBar"/>
    {/*                    <input type="text" name="coinName" />*/}
                        <div className="tableCoins">
                            <Table coins={this.props.data}/>
                        </div>
                        
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
        data: state.protectedData.data
    };
};

export default connect(mapStateToProps)(Dashboard);
