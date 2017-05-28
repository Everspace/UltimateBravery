import React, { PropType } from "react"
import ChampionIcon from "lol/champion/ChampionIcon"
import "./ChampionPool.less"

export default class ChampionPool extends React.Component {

  constructor () {
    super()
    this.textUpdate = this.textUpdate.bind(this)
    this.state = {
      filter: ""
    }
  }

  setAllChampions (status) {
    this.props.setChampionData(
      this.props.championData.ubrave.ids.reduce((obj, id) => {
        obj[id] = status
        return obj
      }, {})
    )
  }

  setManyChampions (champions, state) {
    this.props.setChampionData(
      this.props.championData.ubrave.ids.reduce((obj, id) => {
        if (champions.indexOf(id) > -1) {
          obj[id] = state
        }
        return obj
      }, {})
    )
  }

  setChampion (champion, state) {
    console.log(`Setting ${champion} to ${state}`)
    let obj = Object.create(this.props.user.championData)
    obj[champion] = state
    this.props.setChampionData(obj)
  }

  toggleChampion (champion) {
    this.setChampion(champion, !this.props.user.championData[champion])
  }

  activateOnlyRole (role) {
    this.setManyChampions(
      this.props.championData.ubrave.ids.filter((id) => {
        return this.props.championData.data[id].tags.indexOf(role) > -1
      }),
      true
    )
  }

  textUpdate (event) {
    this.setState({
      filter: new RegExp(`\\b${event.target.value}`, "i")})
  }

  render () {
    let roles = [
      "Assassin",
      "Fighter",
      "Marksman",
      "Mage",
      "Support",
      "Tank"
    ]

    return (
      <div>
        <div>
          <input
            // inputmode={(this.props.languageData.language === 'ja_JP')?kana:latin}
            placeholder='🔎'
            type='text'
            autoCorrect='off'
            spellCheck={false}
            onChange={this.textUpdate}
            onKeyUp={this.textUpdate}
            ref='Search'
          />
          <button onClick={() => { this.textUpdate({target: {value: ""}}); this.refs.Search.value = "" }}>X</button>
        </div>
        <div>
          {roles.map((type) => {
            return <button
              key={type}
              value={type}
              onClick={() => this.activateOnlyRole(type)}
        >{this.props.languageData.data[type]}</button>
          })}
          <button key='enableAll' onClick={() => this.setAllChampions(true)} >ENABLE ALL</button>
          <button key='disableAll' onClick={() => this.setAllChampions(false)} >DISABLE ALL</button>
        </div>
        <div className='ChampionPool'>
          {this.props.championData.ubrave.ids.filter((id) => {
            let champName = this.props.championData.ubrave.convert.id[id].toLowerCase()
            return champName.search(this.state.filter) > -1
          }).map((id) => {
            return <ChampionIcon
              key={id}
              onClick={() => this.toggleChampion(id)}
              have={this.props.user.championData[id]}
              image={this.props.championData.data[id].image}
              dd={this.props.dd}
            />
          })}
          <div key='pusher' className='Pusher' />
        </div>
      </div>
    )
  }
}
