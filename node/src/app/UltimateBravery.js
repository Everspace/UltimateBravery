import $ from 'jquery';
import React from 'react'
import MainDisplay from 'app/MainDisplay/MainDisplay'
import ChampionPool from './ChampionPool'
import DataDragon from './DataDragon'
import StorageManager from 'common/StorageManager'

export default class UltimateBravery extends React.Component {

  // changeLanguage(newLanguage)
  //    this.changeState({window: <PlzWait />}
  //    DataDragon.new(this.realm, newLanguage, this.onLanguageUpdate)
  // onLanguageUpdate(ddrag)
  //    this.changeState({window: <BraveryWindow />})

  constructor() {
    super()
    this.loadUser = this.loadUser.bind(this)
    this.saveUser = this.saveUser.bind(this)
    this.modifyUser = this.modifyUser.bind(this)
    this.dataDragonUpdated = this.dataDragonUpdated.bind(this)
    this.init = this.init.bind(this)
  }

  componentDidMount() {
    DataDragon.update(null, null, this.init)
  }

  init() {
    this.setState({
      user: this.loadUser(),
      champions: window.dat.champions,
      languages: window.dat.languages,
      items: window.dat.items,
      dd: window.dd
    })

  }

  saveUser() {
    if(this.state && this.state.user) {
      StorageManager.saveObject('user', this.state.user)
    }
  }

  loadUser() {
    console.log("loading user")
    let defaultUser = {
      championData: {},   //YOU HAVE NOTHING
      itemData: {},
      lolMap: '11',        //Is current summoner's rift
      summonerLevel: 30
    }

    let user = StorageManager.loadObject('user', defaultUser)
    console.log(user)
    user.championData = window.dat.champions.ubrave.ids.reduce((mem,id)=>{
        mem[id] = (user.championData[id] === null || user.championData[id] === undefined)
        return mem
      },{})

    return user
  }

  setChampionData(state) {
    this.modifyUser('championData', state)
  }

  setSelectedMap(state) {
    this.modifyUser('lolMap', state)
  }

  modifyUser(key, value) {
    let tempState = this.state.user
    tempState[key] = value
    this.setState({user: tempState})
    this.saveUser()
  }

  dataDragonUpdated() {
    console.log("DataDragon updated, refangling state")
    this.setState({
      items: window.dat.items,
      champions: window.dat.champions,
      languages: window.dat.languages,
      dd: window.dd
    });
  }

  render() {
    let style = {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center'
    }

    if(!window.dat) {
      return null
    }

    return (
      <div>
        <select
          defaultValue={'11'}
          onChange={(event)=>this.setSelectedMap(event.target.value)}
        >
          {window.dat.items.ubrave.available_maps.map((mapID)=>{
            mapID = (mapID === '11') ? '1' : mapID
            return <option value={mapID} key={`Map${mapID}`}>
              {window.dat.languages.data[`Map${mapID}`]}
            </option>
          })}
        </select>
        <select
          defaultValue={window.dd.language}
          onChange={(event)=>DataDragon.update(null, event.target.value, this.dataDragonUpdated)}
        >
          {['en_US', 'ja_JP', 'es_MX'].map((langID)=>{
            return <option value={langID} key={langID}>
              {langID}
            </option>
          })}
        </select>
        <MainDisplay
          user={this.state.user}
          championData={this.state.champions}
          itemData={this.state.items}
          userData={this.state.user}
          languageData={this.state.languages}
          dd={this.state.dd}
        />
        <br/>
        <ChampionPool
          userChampionData={this.state.user.championData}
          championData={this.state.champions}
          setChampionData={this.setChampionData.bind(this)}
          dd={this.state.dd}
        />
      </div>
    )
  }
}
