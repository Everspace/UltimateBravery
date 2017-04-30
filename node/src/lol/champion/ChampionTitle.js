import React from 'react'
import SpriteImage from 'lol/common/SpriteImage'
import ChampionIcon from 'lol/champion/ChampionIcon'
import './ChampionTitle.less'

export default class ChampionTitle extends React.Component {
  render () {
    return (
      <div className='ChampionTitle'>
        <div className='Text'>
          <h1>{this.props.champion.name}</h1>
          <h3>{this.props.champion.title}</h3>
        </div>
      </div>
    )
  }
}
