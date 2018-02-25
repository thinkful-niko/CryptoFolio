import React from 'react';
import SearchBar from './searchBar';
import './addcoin.css';

const number = value =>
  value && isNaN(Number(value)) ? 'Must be a number' : undefined;
const required = value => (value ? undefined : 'Required');

const AddCoinMenu = (props) => {
    //Hides coin menu when X is clicked
    const hideCoinMenu = () => {
        const coinMenu = document.getElementsByClassName('addCoinMenuContainer')[0];
        coinMenu.style.display = 'none';
    }

	return(
		<div className='addCoinMenu'>
            <p onClick={hideCoinMenu}>X</p>
            <h1>Add Coin</h1>
            <SearchBar coins={props.coins} className="addCoinSearchBar" addCoinToEntry = {props.addCoinToEntry}/>
            <input type='number' placeholder='Amount' className="amountInput" onChange = {props.amountHandler} validate={[required, number]}/>
            <button  type='button' onClick = {props.addCoinFunction}>Add Coin</button>
        </div>
    )
}

export default AddCoinMenu;