import React from 'react';
import Autosuggest from 'react-autosuggest';
import PlusCoin from './Plus.js';
import { saveCoinData } from '../actions/addNew';

// Imagine you have a list of languages that you'd like to autosuggest.


// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = (value, languages) => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
    return inputLength === 0 ? [] : languages.filter(lang =>
    lang.name.toLowerCase().slice(0, inputLength) === inputValue
  );
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.name;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
  <div>
    {suggestion.name} 
  </div>
);

// <PlusCoin plusCoin={this.plusCoin} />
export default class searchBar extends React.Component {
  constructor() {
    super();

    // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.
    this.state = {
      value: '',
      suggestions: []
    };
  }

  plusCoin = () => {
    console.log('Plus Coin Clicked')
  };

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    console.log('suggestion:', this.props);
    
    this.setState({
      suggestions: getSuggestions(value, this.props.coins)
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onSuggestionSelected = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) =>{
        // this.props.dispatch(saveCoinData({coin: suggestionValue}));
        
        this.props.addCoinToEntry({coinData: suggestion}); //It shouldnt add coin on selection, but on a button press.
        console.log("onSuggestionSelected", suggestion.name, suggestion.price_usd);

  };

  render() {
    const { value, suggestions } = this.state;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: 'Search currency by name',
      value,
      id: 'searchInput',
      onChange: this.onChange
    };

    // Finally, render it!
    return (
      <Autosuggest
      onSuggestionSelected={this.onSuggestionSelected}
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
    );
  }
}