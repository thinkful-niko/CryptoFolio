import React from 'react'

const Table = (props) => (

<div>
          {props.coins.map((item, index) => {
            return (
              <tr key={index}>
                <td>{item.name} {item.coinAmount} {item.price_usd}</td>
              </tr>
            );
          })}
</div>

)

export default Table

{/*<div>
    <table>
        <tbody>
              <tr>
              	{{
				    return (
				      <ul>
				        {this.props.coins.map(item => (
				          <li key={item.id}>{item.text}</li>
				        ))}
				      </ul>
				})}
                <th>Coin</th>
                <th>Holdings</th> 
                <th>Price</th>
                <th>Value</th>
              </tr>
        </tbody>
    </table>
  </div>*/}