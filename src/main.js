// Libraries
import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

// Things to do
import ChampionPool from './app/ChampionPool'


// ID of the DOM element to mount app on
const DOM_APP_EL_ID = 'app';

let championData = null
let itemData = null
let languageData = null
let realmData = null
let dd = null

$.getJSON(`json/realm_${localStorage.getItem('dd_realm') || 'na'}.json`, (data => realmData = data))
 .then(function(x) {
	dd = {
		available_realms: ['br', 'eune', 'euw', 'kr', 'lan', 'las', 'na', 'oce', 'tr', 'ru', 'jp'],
		cdn: realmData.cdn,
		version: realmData.dd,
		language: localStorage.getItem('dd_language') || realmData.l,
		version: realmData.v
	};
 })
 .then(function(x) {
	$.when(
		$.getJSON(`json/${dd.language}/item.json`,     (data => itemData = data)),
		$.getJSON(`json/${dd.language}/champion.json`, (data => championData = data)),
		$.getJSON(`json/${dd.language}/language.json`, (data => languageData = data))
	)
	.then(function(x) {
		ReactDOM.render(
			<ChampionPool champions={championData.data} dataDragon={dd} />,
			document.getElementById(DOM_APP_EL_ID)
		);
	});
 });
