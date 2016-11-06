import React, { PropType } from 'react'
import ChampionIcon from 'lol/champion/ChampionIcon'
import './ChampionPool.js.css'

export default class ChampionPool extends React.Component {

  setAllChampions(status) {
    this.props.setChampionData(
      this.props.championData.ubrave.ids.reduce((obj, id)=>{
        obj[id] = status
        return obj
      }, {})
    )
  }

  toggleChampion(champion) {
    let obj = Object.create(this.props.user.championData)
    obj[champion] = !this.props.user.championData[champion]
    this.props.setChampionData(obj)
  }

  render() {
    return (
      <div>
        <div className='ChampionPool'>
          {this.props.championData.ubrave.ids.map((id)=>{
            return <ChampionIcon
              key={id}
              onClick={() => this.toggleChampion(id)}
              have={this.props.user.championData[id]}
              image={this.props.championData.data[id].image}
              dd={this.props.dd}
            />
          })}
          <div key="pusher" className='Pusher'></div>
        </div>
        <button key="enableAll" onClick={() => this.setAllChampions(true)}  >ENABLE ALL</button>
        <button key="disableAll" onClick={() => this.setAllChampions(false)} >DISABLE ALL</button>
      </div>
    );
  }
}
