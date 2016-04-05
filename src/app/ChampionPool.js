import React, { PropType } from 'react'
import ChampionIcon from '../lol/champion/ChampionIcon'
import './ChampionPool.css'

export default class ChampionPool extends React.Component {

  render() {
    let champions = this.props.championData.data

    let icons = new Array()

    for(let champ in champions) {
      let data = champions[champ]
      let SAYMYNAME = () => { console.log(champ) }
      icons.push(
        <ChampionIcon
          onClick={SAYMYNAME}
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
