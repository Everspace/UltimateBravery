// Manages
// - window.dd (datadragon info)
// - window.dat (json blob collection)
export default class DataDragon {

  // TODO: Perhaps grab this via a request?
  static dataPoints = [
    'champions',
    'items',
    'languages',
    'maps',
    'masteries',
    'summonerSpells'
  ]

  static update (realm = null, language = null) {
    return new Promise((resolve, reject) => {
      realm = DataDragon.setRealm(realm)

      DataDragon.getJSON(`./json/realm_${realm}.json`)
        .then((realmJSON) => {
          DataDragon.updateDataDragon(realmJSON)
          DataDragon.setLanguage(language)

          window.dat = window.dat || {}
          return Promise.all(
            DataDragon.dataPoints.map(DataDragon.requestData)
          )
        })

        .then(() => {
          console.log('DataDragon finished updating')
          resolve('DataDragon updated')
        })
        .catch((reason) => {
          reject(reason)
        })
    })
  }

  static setRealm (realm) {
    realm = realm || localStorage.getItem('dd_realm') || 'na'
    localStorage.setItem('dd_realm', realm)
    return realm
  }

  static updateDataDragon (payload) {
    window.dd = {
      cdn: payload.cdn,
      language: localStorage.getItem('dd_language'),
      version: payload.v
    }
  }

  static setLanguage (language) {
    language = language || localStorage.getItem('dd_language') || 'en_US'
    localStorage.setItem('dd_language', language)
    window.dd.language = language
  }

  static requestData (dataPoint) {
    return DataDragon.getJSON(`json/${window.dd.language}/${dataPoint}.json`)
          .then((blob) => { window.dat[dataPoint] = blob })
  }

  static getJSON (item) {
    return fetch(item)
          .catch(console.error)
          .then((res) => res.json())
          .catch(console.error)
  }

}
