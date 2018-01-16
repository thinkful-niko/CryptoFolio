import React from 'react'

const Table = (props) => (

      <table>
        <tbody>
          {props.coins.map((item, index) => {
            return (
              <tr key={index} onClick = { () => { props.addCoin('hi') } }>
                <td>{item.name}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

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