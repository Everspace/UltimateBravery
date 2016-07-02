import React, { PropType } from 'react'
import ChampionIcon from 'lol/champion/ChampionIcon'
import './ChampionPool.js.css'

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

  makePoolIcons() {
    let champions = Object.keys(this.props.championData.data)
      .map(key => this.props.championData.data[key])
      .sort((a, b) => a.name.localeCompare(b.name))

    let icons = new Array()
    for(let id in champions) {
      icons.push(
        <ChampionIcon
          onClick={() => this.toggleChampion(id)}
          have={this.props.userChampionData[id]}
          image={champions[id].image}
          key={id}
          dd={this.props.dd}
        />
      )
    }

    return icons
  }

  render() {

    return (
      <div>
        <div className='ChampionPool'>
          {this.makePoolIcons()}
          <div key="pusher" className='Pusher'></div>
        </div>
        <button key="enableAll" onClick={() => this.setAllChampions(true)}  >ENABLE ALL</button>
        <button key="disableAll" onClick={() => this.setAllChampions(false)} >DISABLE ALL</button>
      </div>
    );
  }
}
