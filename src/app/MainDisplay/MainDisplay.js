import React, { PropType } from 'react'
import Random from 'common/Random'

import BraveFactory from 'app/MainDisplay/BraveFactory'

import ChampionIcon from 'lol/champion/ChampionIcon'
import ItemIcon from 'lol/item/ItemIcon'

export default class MainDisplay extends React.Component {

  constructor(props) {
    super(props)
    this.makeBrave       = this.makeBrave.bind(this)
    this.makeItemIcon    = this.makeItemIcon.bind(this)
    this.braveFactory   = new BraveFactory(this.props)
  }

  componentWillMount() {
    return {
      brave: this.braveFactory.makeBrave()
    }
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

    var extras = []
    if (this.state.brave.extras.length) {
      extras = this.state.brave.extras.map(this.makeItemIcon)
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
        <button onClick={this.makeBrave}>BRAVERY!</button>

        <h3>{this.props.languageData.data.RecommendedItems}</h3>
        <div style={containerStyle}>
          {items}
        </div>
        {this.state.brave.extras.length ?
          <div>
            <h3>{this.props.languageData.data.Details_}</h3>
            <div style={containerStyle}>
              {extras}
            </div>
          </div>
          :null
        }

      </div>
    )
  }

}