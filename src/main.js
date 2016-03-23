// Libraries
import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

// Things to do
import ChampionPool from './app/ChampionPool'

var dd = {
	available_realms: ['br', 'eune', 'euw', 'kr', 'lan', 'las', 'na', 'oce', 'tr', 'ru', 'jp'],
	version: localStorage.getItem('dd_version') || '6.5.1',
	language: localStorage.getItem('dd_language') || 'en_US',
	realm: localStorage.getItem('dd_realm') || 'na',
	cdn: localStorage.getItem('dd_cdn') || 'http://ddragon.leagueoflegends.com/cdn'
}

console.log(dd)

// ID of the DOM element to mount app on
const DOM_APP_EL_ID = 'app';

let championData = null
let itemData = null
let languageData = null

$.when(
  $.getJSON(`json/${dd.language}/item.json`,     (data => itemData = data)),
  $.getJSON(`json/${dd.language}/champion.json`, (data => championData = data)),
  $.getJSON(`json/${dd.language}/language.json`, (data => languageData = data))
).then(function(x) {
	console.log("%o", dd);

	ReactDOM.render(
		<ChampionPool champions={championData.data} dataDragon={dd} />, 
		document.getElementById(DOM_APP_EL_ID)
	);
});