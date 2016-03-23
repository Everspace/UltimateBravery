dd_available_realms = ['br', 'eune', 'euw', 'kr', 'lan', 'las', 'na', 'oce', 'tr', 'ru', 'jp'];
dd_version = localStorage.getItem('dd_version') || '6.5.1';
dd_language = localStorage.getItem('dd_language') || 'en_US';
dd_realm = localStorage.getItem('dd_realm') || 'na';
dd_cdn = localStorage.getItem('dd_cdn') || 'http://ddragon.leagueoflegends.com/cdn';

championData = null
itemData = null
languageData = null

$.when(
  $.getJSON(`json/${dd_language}/item.json`, (data => itemData = data)),
  $.getJSON(`json/${dd_language}/champion.json`, (data => championData = data)),
  $.getJSON(`json/${dd_language}/language.json`, (data => languageData = data))
).then( (data => console.log("All loaded!")) );
