import React from 'react';
import {connect} from 'react-redux';
import {Link, Redirect} from 'react-router-dom';
import {fetchProtectedData, getCoinData} from '../actions/protected-data';
import './Dashboard.css';
import Table from './table';
import SearchBar from './searchBar';

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
                        <div className="chart"></div>
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
