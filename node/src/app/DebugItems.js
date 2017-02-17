import React from 'react'
import SpriteImage from 'lol/common/SpriteImage'

export default class DebugItems extends React.Component{

  constructor() {
    super()
    this.generateItem = this.generateItem.bind(this)
    this.state = {loading: true}
  }

  componentDidMount() {
    fetch(`${window.dd.cdn}/${window.dd.version}/data/${window.dd.language}/item.json`)
      .then(response => response.json())
      .then(json => {
        this.setState({
          json: json,
          loading: false
        })
      })
  }

  generateItem(itemID) {
    let itemData = this.state.json.data[itemID]
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
          }}><pre>- '{itemID}' #{itemData.name} {
            (itemData.requiredChampion) ? `(${itemData.requiredChampion})` : null
          }</pre>
            </p>
      </div>
    )
  }

  render() {
    if (this.state.loading) {
      return(<p>Please wait...</p>)
    } else {
      let items = Object.keys(this.state.json.data)
        .filter((itemID)=> this.state.json.data[itemID].maps[this.props.user.lolMap])
        .map(this.generateItem)

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
}

