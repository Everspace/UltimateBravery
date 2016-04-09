import React, { PropType } from 'react'
import ChampionIcon from '../lol/champion/ChampionIcon'
import './ChampionPool.css'
import '../common/Common.css'

export default class ChampionPool extends React.Component {

  setAllChampions(status) {
    let championData = this.props.userChampionData
    let champions = this.props.championData.data

    for(let champ in champions) {
      championData[champ] = status
    }

    this.props.setChampionData(championData)
  }

  toggleChampion(champion) {
    let championData = this.props.userChampionData
    if(championData[champion]) {
      championData[champion] = false
    } else {
      championData[champion] = true
    }

    this.props.setChampionData(championData)
  }

  render() {
    let champions = this.props.championData.data

    let icons = new Array()

    for(let champ in champions) {
      let data = champions[champ]

      icons.push(
        <ChampionIcon
          onClick={() => this.toggleChampion(champ)}
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
        <div className='Pusher'>
          <button onClick={() => this.setAllChampions(true)}  >ENABLE ALL</button>
          <button onClick={() => this.setAllChampions(false)} >DISABLE ALL</button>
        </div>
      </div>
    );
  }
}
