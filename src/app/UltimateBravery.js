import $ from 'jquery';
import React from 'react'
import ReactDOM from 'react-dom'
import MainDisplay from './MainDisplay'
import ChampionPool from './ChampionPool'

class UltimateBravery {

    constructor() {
        this.render = this.render.bind(this);
        this.rerender = this.rerender.bind(this);
        this.updateDataDragon = this.updateDataDragon.bind(this);

        if(global.UltimateBravery) {
            console.alert('Something has gone horribly awry')
        } else {
            global.UltimateBravery = this
        }

        this.championData = {};
        this.itemData = {};
        this.languageData = {};
        this.dd = {};
        this.user = {
            championData: {},
            gameMode: 1,        //Is summoner's rift
            summonerLevel: 30
        }

        this.userSummonerlevel = localStorage.getItem('userSummonerLevel') || 30;
        localStorage.setItem('userSummonerlevel', this.userSummonerlevel);

        this.updateDataDragon(null, null);
    }

    render() {
        ReactDOM.render(
            <div>
                <MainDisplay />
                <ChampionPool />
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

        $.getJSON(`json/realm_${selectedRealm}.json`, (data => realmData = data))
         .then(function(x) {
            let selectedLanguage = language || realmData.l || localStorage.getItem('dd_language') || 'en_US'
            localStorage.setItem('dd_language', selectedLanguage)

            //I mean this instead of the jquery this ehivh is different.
            global.UltimateBravery.dd = {
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
