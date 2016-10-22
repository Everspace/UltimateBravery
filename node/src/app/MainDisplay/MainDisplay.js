import React, { PropType } from 'react'
import Random from 'common/Random'

import BraveFactory from 'app/MainDisplay/BraveFactory'

import ChampionIcon from 'lol/champion/ChampionIcon'
import ItemIcon from 'lol/item/ItemIcon'

export default class MainDisplay extends React.Component {

  constructor(props) {
    super(props)
    this.makeItemIcon   = this.makeItemIcon.bind(this)
    this.braveFactory   = new BraveFactory(this.props)
  }

  componentWillMount() {
    this.setState({
      brave: this.braveFactory.makeBrave()
    })
  }

  componentWillReceiveProps(nextProps) {
    this.braveFactory = new BraveFactory(nextProps);
  }

  makeItemIcon(item) {
    return <ItemIcon key={item.key} image={item.image} dd={this.props.dd}/>
  }

  render() {

    let containerStyle = {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'left'
    }

    let items = this.state.brave.items.map(this.makeItemIcon)

    var extraItems = []
    if (this.state.brave.extraItems.length) {
      extraItems = this.state.brave.extraItems.map(this.makeItemIcon)
    }

    return (
      <div className="MainDisplay">
        <h3>{this.state.brave.champion.name}</h3>
        <ChampionIcon
          key={this.state.brave.champion.key}
          image={this.state.brave.champion.image}
          dd={this.props.dd}
          have={true}
        />
        <button onClick={()=>this.setState({brave: this.braveFactory.makeBrave()})}>BRAVERY!</button>

        <h3>{this.props.languageData.data.RecommendedItems}</h3>
        <div style={containerStyle}>
          {items}
        </div>
        {this.state.brave.extraItems.length ?
          <div>
            <h3>{this.props.languageData.data.Details_}</h3>
            <div style={containerStyle}>
              {extraItems}
            </div>
          </div>
          :null
        }

      </div>
    )
  }

}