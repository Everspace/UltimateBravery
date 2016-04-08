import $ from 'jquery';
import React from 'react'
import ReactDOM from 'react-dom'
import MainDisplay from './MainDisplay'
import ChampionPool from './ChampionPool'
import StorageManager from '../common/StorageManager'
import ItemIcon from '../lol/item/ItemIcon'

class UltimateBravery {

  constructor() {
    this.updateDataDragon(null, null);
  }

  saveUser() {
    new StorageManager().saveObject('user', this.state.user)
  }

  loadUser() {
    let defaultUser = {
      championData: {},   //YOU HAVE NOTHING
      itemData: {},
      gameMode: 1,        //Is summoner's rift
      summonerLevel: 30,
      firstVisit: true
    }

    if(user.firstVisit) {
      for(let key in this.state.championData.data) {
        user.championData[key] = true
        console.log(key)
      }
      //user.firstVisit = false
    }

    let user = new StorageManager().loadObject('user', defaultUser)

    return user
  }

  toggleChampion(champion) {
    let state = this.state.user
    if(state.championData[champion]) {
      state.championData[champion] = false
    } else {
      state.championData[champion] = true
    }
    this.saveUser()
    this.render()
  }

  render() {
    let style = {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center'
    }

    ReactDOM.render(
      <div>
        <MainDisplay
          user={this.state.user}
          championData={this.championData}
          itemData={this.itemData}
          userData={this.userData}
          dd={this.dd}
        />
        <br/>
        <ChampionPool
          userChampionData={this.state.user.championData}
          championData={this.championData}
          toggleChampion={this.toggleChampion.bind(this)}
          dd={this.dd}
        />
      </div>,
      document.getElementById('app')
    );
  }

  updateDataDragon(realm, language) {
    let selectedRealm = realm || localStorage.getItem('dd_realm') || 'na';
    localStorage.setItem('dd_realm', selectedRealm);
    let realmData = null;
    let reallyThis = this

    var dd = {}
    var itemData = {}
    var championData = {}
    var languageData = {}

    $.getJSON(`json/realm_${selectedRealm}.json`, (data => realmData = data))
     .then(()=>{
        let selectedLanguage = language || realmData.l || localStorage.getItem('dd_language') || 'en_US'
        localStorage.setItem('dd_language', selectedLanguage)

        dd = {
          available_realms: ['br', 'eune', 'euw', 'kr', 'lan', 'las', 'na', 'oce', 'tr', 'ru', 'jp'],
          cdn: realmData.cdn,
          version: realmData.dd,
          language: selectedLanguage,
          version: realmData.v
        }
    }).then(() => {
      let itemUpdated = $.getJSON(
        `json/${dd.language}/item.json`,
        (data => itemData = data)
      );
      let championUpdated = $.getJSON(
        `json/${dd.language}/champion.json`,
        (data => championData = data)
      );
      let languageUpdated = $.getJSON(
        `json/${dd.language}/language.json`,
        (data => languageData = data)
      );

      $.when(itemUpdated, championUpdated, languageUpdated)
       .then(() => {
          reallyThis.setState({
            dd: dd,
            itemData: itemData,
            championData: championData,
            languageData: languageData,
            user: reallyThis.loadUser()
          })
       });
    });
  }
}

export default UltimateBravery;
