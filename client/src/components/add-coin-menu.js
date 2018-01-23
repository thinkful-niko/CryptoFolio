import React from 'react';
import SearchBar from './searchBar';
import './addcoin.css';


const AddCoinMenu = (props) => {
    //Hides coin menu when X is clicked
    const hideCoinMenu = () => {
        const coinMenu = document.getElementsByClassName('addCoinMenuContainer')[0];
        coinMenu.style.display = 'none';
    }
    //Gets selected coin and adds that to the list element
    const addCoinToList = () => {
        console.log(`Add ${props.selectedCoin} At ${props.selectedCoinPrice} Your value will be: X`);
        
    }

	return(
		<div className='addCoinMenu'>
            <p onClick={hideCoinMenu}>X</p>
            <h1>Add Coin</h1>
            <SearchBar coins={props.coins} className="addCoinSearchBar" addCoin = {props.addCoin}/>
            <input type='text' placeholder='Amount' className="amountInput"/>
            <button  type='button' onClick = {props.addCoinFunction}>Add Coin</button>
        </div>
    )
}

export default AddCoinMenu;