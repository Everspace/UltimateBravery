import $ from 'jquery';
import React from 'react'
import MainDisplay from './MainDisplay'
import ChampionPool from './ChampionPool'
import StorageManager from 'common/StorageManager'
import ItemIcon from 'lol/item/ItemIcon'

export default class UltimateBravery extends React.Component {

  constructor() {
    super()
    this.loadUser = this.loadUser.bind(this)
    this.saveUser = this.saveUser.bind(this)
    this.updateDataDragon = this.updateDataDragon.bind(this)
    this.modifyUser = this.modifyUser.bind(this)
  }

  componentWillMount(){
    this.updateDataDragon();
  }

  saveUser() {
    if(this.state && this.state.user) {
      StorageManager.saveObject('user', this.state.user)
    }
  }

  loadUser() {
    let defaultUser = {
      championData: {},   //YOU HAVE NOTHING
      itemData: {},
      lolMap: '11',        //Is current summoner's rift
      summonerLevel: 30
    }

    let user = StorageManager.loadObject('user', defaultUser)

    for(let key in this.state.championData.data) {
      let hasChampion = user.championData[key]
      //If it's not there, let's say it is there.
      if(hasChampion === null || hasChampion === undefined) {
        user.championData[key] = true
      }
    }

    this.setState({user: user})
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

  render() {
    let style = {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center'
    }

    if(!this.state) {
      return null
    }

    let availableMaps = []
    for(let index in this.state.maps) {
      let key = 'Map' + this.state.maps[index]
      let id = this.state.maps[index]
      availableMaps.push(
        <option value={id} key={key}>
          {this.state.languageData.data[key]}
        </option>
      )

    }

    return (
      <div>
        <select defaultValue={this.state.user.lolMap}
          onChange={(event)=>this.setSelectedMap(event.target.value)}
        >{availableMaps}</select>

        <MainDisplay
          user={this.state.user}
          championData={this.state.championData}
          itemData={this.state.itemData}
          userData={this.state.userData}
          languageData={this.state.languageData}
          dd={this.state.dd}
        />
        <br/>
        <ChampionPool
          userChampionData={this.state.user.championData}
          championData={this.state.championData}
          setChampionData={this.setChampionData.bind(this)}
          dd={this.state.dd}
        />
      </div>
    )
  }

  //Resets the object's state by default if not provided a callback
  updateDataDragon(realm=null, language=null, requestedCallback=null) {
    let selectedRealm = realm || localStorage.getItem('dd_realm') || 'na';
    localStorage.setItem('dd_realm', selectedRealm);
    let realmData = null;

    var callback
    //Default response is to load the user's info
    if(requestedCallback) {
      callback = requestedCallback
    } else {
      //Rest the state, and fire-up the user
      callback = (payload) => {
        this.state = payload;

        //Setup available maps
        let maps = Object.keys(this.state.languageData.data)
          .filter((key)=>key.startsWith('Map'))
          .map((key)=>key.replace('Map',''))


        this.state.maps = maps

        this.loadUser()
      }
    }

    //Will set state at the end
    let dataHolder = {}

    //Save the user's info before we go and diddle with it.
    this.saveUser();

    $.getJSON(`json/realm_${selectedRealm}.json`, (data => realmData = data))
     .then(()=> {
        let selectedLanguage = language || localStorage.getItem('dd_language') || realmData.l ||  'en_US'
        localStorage.setItem('dd_language', selectedLanguage)

        let dd = {
          available_realms: ['br', 'eune', 'euw', 'kr', 'lan', 'las', 'na', 'oce', 'tr', 'ru', 'jp'],
          cdn: realmData.cdn,
          version: realmData.dd,
          language: selectedLanguage,
          version: realmData.v
        }

        dataHolder.dd = dd
      })
     .then(()=> {
        //List all the jsons we're going to get
        let dataPoints = ['item', 'champion', 'language']
        //Set up a list of the requests.
        let differedItems = []
        //And have them stick their juices here
        //in the format {${datum}Data: jsonHarvest}

        for (let index in dataPoints) {
          let differ = $.getJSON(
            `json/${dataHolder.dd.language}/${dataPoints[index]}.json`,
            (data=> dataHolder[`${dataPoints[index]}Data`] = data)
          )

          differedItems.push(differ)
        }

        //Then wait for all the stuff we'll gather then execute the callback
        $.when.apply($, differedItems).then(()=> callback(dataHolder))
      });
  }
}
