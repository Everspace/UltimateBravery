// Manages
// - window.dd (datadragon info)
// - window.dat (json blob collection)
export default class DataDragon {
  // Begins the flow for rerouting the update. Returns a jquery promice that you can
  // .then(f()) off of.
  //
  // All other functions are just to help this one.
  //
  // Start request for the realm json
  // .then drop down ddragon info
  // .then for each of the points of data
  //   Start request for items
  //   requests.map($.when).then(()=>callback)
  static update (realm = null, language = null) {
    return new Promise((resolve, reject) => {
      realm = DataDragon.setRealm(realm)

      fetch(`json/realm_${realm}.json`)
        .catch((reason) => console.error(reason))

        .then((res) => res.json())
        .catch((reason) => console.error(reason))

        .then((realmJSON) => {
          DataDragon.updateDataDragon(realmJSON)
          DataDragon.setLanguage(language)

          window.dat = window.dat || {}
          return Promise.all(
            ['items', 'champions', 'languages'].map(DataDragon.requestData)
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
    return fetch(`json/${window.dd.language}/${dataPoint}.json`)
          .then((res) => { res.json() })
          .then((blob) => { window.dat[dataPoint] = blob })
  }

}
