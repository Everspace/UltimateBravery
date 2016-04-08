import React, { PropType } from 'react'
import ChampionIcon from '../lol/champion/ChampionIcon'
import './ChampionPool.css'

export default class ChampionPool extends React.Component {

  render() {
    let champions = this.props.championData.data

    let icons = new Array()

    for(let champ in champions) {
      let data = champions[champ]

      icons.push(
        <ChampionIcon
          onClick={() => this.props.toggleChampion(champ)}
          have={this.props.userChampionData[champ]}
          image={data.image}
          key={data.key}
          dd={this.props.dd}
        />
      )
    }

    return (
        <div className='ChampionPool'>
        {icons}
        </div>
    );
  }
}
