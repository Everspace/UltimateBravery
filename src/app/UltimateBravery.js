import $ from 'jquery';
import React from 'react'
import ReactDOM from 'react-dom'
import MainDisplay from './MainDisplay'
import ChampionPool from './ChampionPool'
import StorageManager from '../common/StorageManager'
import ItemIcon from '../lol/item/ItemIcon'

class UltimateBravery {

    constructor() {
        this.render = this.render.bind(this);
        this.rerender = this.rerender.bind(this);
        this.updateDataDragon = this.updateDataDragon.bind(this);
        this.saveUser = this.saveUser.bind(this);
        this.loadUser = this.loadUser.bind(this);

        this.championData = {};
        this.itemData = {};
        this.languageData = {};
        this.dd = {}
        this.user = this.loadUser();
        this.updateDataDragon(null, null);
    }

    saveUser() {
      new StorageManager().saveObject('user', this.user)
    }

    loadUser() {
      let defaultUser = {
          championData: {},   //YOU HAVE NOTHING
          itemData: {},
          gameMode: 1,        //Is summoner's rift
          summonerLevel: 30
      }
      let user = new StorageManager().loadObject('user', defaultUser)
      return user
    }

    toggleChampion(champion) {

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
            championData={this.championData}
            itemData={this.itemData}
            userData={this.userData}
            dd={this.dd}
          />
          <br/>
          <ChampionPool
            userChampions={this.user.championData}
          championData={this.championData}
          dd={this.dd}
          />

          <h3>ALL THE ITEMS</h3>
          <div style={style}>
            {Object.keys(this.itemData.data).map( (item) =>
              <ItemIcon key={this.itemData.data[item].key} image={this.itemData.data[item].image} dd={this.dd}/>
            )}
          </div>
          <h3>BOOTS</h3>
          <div style={style}>
            {this.itemData.lists.boots.map( (item) =>
              <ItemIcon key={this.itemData.data[item].key} image={this.itemData.data[item].image} dd={this.dd}/>
            )}
          </div>
          <h3>ANYBODY (Any map)</h3>
          <div style={style}>
            {this.itemData.lists.generics.map( (item) =>
              <ItemIcon key={this.itemData.data[item].key} image={this.itemData.data[item].image} dd={this.dd}/>
            )}
          </div>
          <h3>JANGLE (Not implemented yet)</h3>
          <div style={style}>
            {this.itemData.lists.jungleItems.map( (item) =>
              <ItemIcon key={this.itemData.data[item].key} image={this.itemData.data[item].image} dd={this.dd}/>
            )}
          </div>
        </div>,
        document.getElementById('app')
      );
    }

    rerender() {

      let itemUpdated = $.getJSON(
          `json/${this.dd.language}/item.json`,
          (data => this.itemData = data)
      );
      let championUpdated = $.getJSON(
          `json/${this.dd.language}/champion.json`,
          (data => this.championData = data)
      );
      let languageUpdated = $.getJSON(
          `json/${this.dd.language}/language.json`,
          (data => this.languageData = data)
      );

      $.when(itemUpdated, championUpdated, languageUpdated).then(this.render);
    }

    updateDataDragon(realm, language) {
        let selectedRealm = realm || localStorage.getItem('dd_realm') || 'na';
        localStorage.setItem('dd_realm', selectedRealm);
        let realmData = null;

        let reallyThis = this

        $.getJSON(`json/realm_${selectedRealm}.json`, (data => realmData = data))
         .then(function(x) {
            let selectedLanguage = language || realmData.l || localStorage.getItem('dd_language') || 'en_US'
            localStorage.setItem('dd_language', selectedLanguage)

            reallyThis.dd = {
                available_realms: ['br', 'eune', 'euw', 'kr', 'lan', 'las', 'na', 'oce', 'tr', 'ru', 'jp'],
                cdn: realmData.cdn,
                version: realmData.dd,
                language: selectedLanguage,
                version: realmData.v
            };
        }).then(this.rerender);
    }
}

export default UltimateBravery;
