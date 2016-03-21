//Data Dragon wrangler

//Redownload everything any of the following changes...
dd_available_realms = ['br', 'eune', 'euw', 'kr', 'lan', 'las', 'na', 'oce', 'tr', 'ru', 'jp'];
dd_version  = localStorage.getItem('dd_version') || '6.5.1';
dd_language = localStorage.getItem('dd_language') || 'en_US';
dd_realm    = localStorage.getItem('dd_realm') || 'na';
dd_cdn      = localStorage.getItem('dd_cdn') || 'http://ddragon.leagueoflegends.com/cdn';

itemData = $.getJSON(`./json/${dd_language}/item.json`)
championData = $.getJSON(`./json/${dd_language}/champion.json`)


var request = function(url) {
  //var invocation = new XMLHttpRequest(); // a new request
  //invocation.open("GET", url, false);
  //invocation.send();
  //return invocation.responseText
}

var requestJSON = function(url) {
  /*request(url)*/
  return $.getJSON(url)
   //JSON.parse(url );
}

var writeJSON = function(location, json) {
  return localStorage.setItem(location, JSON.stringify(json))
}

var readJSON = function(location) {
  //var stringBlob = localStorage.getItem(location);
  if(stringBlob) return JSON.parse(location);
  else return null;
}

var updateAll = function(language, realm) {
  updateChampionData(language, realm);
  updateItemData(language, realm);
  updateSummonerSpellData(language, realm);
  updateLanguageStrings(language, realm);
}

var updateItemData = function(language, realm) {
  minimumData = {}

}

var updateSummonerSpellData = function(language, realm) {
  minimumData = {}

}

var updateLanguageData = function(language, realm) {
  minimumData = {}

}

var updateChampionData = function(language, realm) {
  minimumData = {}

  //Get all the champions available
  allChampionRaw = requestJSON(`./json/${dd_language}/champion.json`)

  for(var championRaw in allChampionRaw.data) {
    targetChamp = championRaw.id
    champSource = requestJSON(`./json/${dd_language}/champion/${targetChamp}.json`);

    //Now to strip out unneeded info.
    minimumData[targetChamp] = {}
    champTarget = minimumData[targetChamp];

    //unique number ID
    champTarget.key = champSource.key; 

    //unique text ID (english name)
    champTarget.id  = champSource.id;  

    //Champion type tags like "Marksmen", has translation in languageStrings
    //Not used, but may be if I make "smart randoming" an option
    champTarget.tags = champSource.tags;

    //Localized info
    champTarget.name  = champSource.name;  
    champTarget.title = champSource.title; 
    champTarget.image = champSource.image;
    champTarget.skins = champSource.skins;

    //What their bar resource is (mana/rage/energy).
    //Not used, but may be if I make "smart randoming" an option
    champTarget.partype = champSource.partype; 

    //Spell wrangling
    champTarget.spells = [];

    for(var sourceSpell in champSource.spells) {
      targetSpell = {};

      //Champion.id + hotkey letter [Q,W,E,R]. Hilarious.
      spellTarget.id  = spellSource.id;  

      //Highest level it can go. 
      //Canadate maxers are ones with >=5 levels because Karma's ult has 4, and Udyr's 5.
      spellTarget.maxrank  = spellSource.maxrank;  

      //Localized name
      spellTarget.name  = spellSource.name;  
      spellTarget.image = spellSource.image;

      //AP/AD ratios
      //Not used, but may be if I make "smart randoming" an option
      champTarget.vars = champSource.vars;
    }
  }

  writeJSON('championData', minimumData);
}


var getLatest = function(language, realm) {
  if(!language) language = 'en_US';
  if(!realm) realm = 'na';

  dd_language = language;
  dd_realm = realm;

  realmInfo = requestJSON(`./json/realm_${dd_realm}.json`)

  if(dd_version === realmInfo.v) return null; //exit early since we're good here!

  dd_version = realmInfo.v
  dd_cdn = realmInfo.cdn

  updateChampionData(language, realm);
  updateItemData(language, realm);
  updateSummonerSpellData(language, realm);
  updateLanguageData(language, realm);

  localStorage.setItem('dd_version', dd_version);
}

//getLatest(dd_language, dd_realm);

//Item minimums:
/*
{
  "data": {
    "1001": {
      "name": "Boots of Speed",
      "group": "BootsNormal",
      "colloq": ";",
      "into": [],
      "image": {
        "full": "1001.png",
        "sprite": "item0.png",
        "group": "item",
        "x": 0,
        "y": 0,
        "w": 48,
        "h": 48
      },
      "gold": {
        "total": 300,
      },
      "tags": [],
      "maps": {
        "1": false,
        "8": true,
        "10": true,
        "11": true,
        "12": true,
        "14": false
      }
    }
  }
}*/