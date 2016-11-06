import React from 'react'
import SpriteImage from 'lol/common/SpriteImage'

export default class DebugItems extends React.Component{
  render() {
    let items = this.props.itemData.ubrave.maps[this.props.user.lolMap].map((itemID)=>{
      let itemData = this.props.itemData.data[itemID]
      return(
        <div style={{padding:0, width:'50%'}} key={itemID}>
          <SpriteImage
            {...itemData}
            dd={this.props.dd}
            style={{
              display: 'inline-block',
              verticalAlign: 'middle'
            }}
          />
          <p style={{
              margin: '1em',
              display: 'inline-block'
            }}>{itemID}: {itemData.name} {
              (itemData.requiredChampion) ? `(${itemData.requiredChampion})` : null}
              </p>
        </div>
      )
    })

    let style = {
      display: 'flex',
      flexWrap: 'wrap'
    }

    return(
      <div style={style}>
        {items}
      </div>
    )
  }
}

