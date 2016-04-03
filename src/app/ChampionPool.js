import React, { PropType } from 'react'
import ChampionIcon from '../lol/champion/ChampionIcon'
import './ChampionPool.css'

export default class ChampionPool extends React.Component {

  render() {
    let champions = this.props.champions

    let icons = Object.keys(champions)
        .map(champion =>
          <ChampionIcon
           key={champions[champion].key}
           champion={champions[champion]}
           dataDragon={this.props.dataDragon}
          />
        )

    return (
        <div className='ChampionPool'>
        {icons}
        </div>
    );
  }
}
