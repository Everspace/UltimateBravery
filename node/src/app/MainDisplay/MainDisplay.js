import React, { PropType } from 'react'
import Random from 'common/Random'

import BraveFactory from 'app/MainDisplay/BraveFactory'

import ChampionIcon from 'lol/champion/ChampionIcon'
import SpriteImage from 'lol/common/SpriteImage'

export default class MainDisplay extends React.Component {

  constructor(props) {
    super(props)
    this.braveFactory   = new BraveFactory(this.props)
  }

  componentWillMount() {
    this.setState({
      brave: this.braveFactory.makeBrave()
    })
  }

  componentWillReceiveProps(nextProps) {
    this.braveFactory = new BraveFactory(nextProps);
    this.setState({
      brave: this.braveFactory.makeBrave()
    })
  }

  render() {

    let containerStyle = {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'left'
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
        <button
          onClick={()=>this.setState({brave: this.braveFactory.makeBrave()})}
        >BRAVERY!</button>
        <h3>{this.props.languageData.data.RecommendedItems}</h3>
        <div style={containerStyle}>
          {this.state.brave.items.map((item)=>{
            return <SpriteImage
                      name={item.name}
                      key={item.name}
                      image={item.image}
                      dd={this.props.dd}
                    />
          })}
        </div>
        {this.state.brave.extraItems.length ?
          <div>
            <h3>{this.props.languageData.data.Details_}</h3>
            <div style={containerStyle}>
              {this.state.brave.extraItems.map((id)=>{
                return <SpriteImage
                      name={item.name}
                      key={item.key}
                      image={item.image}
                      dd={this.props.dd}
                    />
              })}
            </div>
          </div>
          :null
        }

      </div>
    )
  }

}