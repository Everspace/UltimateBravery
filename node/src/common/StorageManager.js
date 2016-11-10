export default class StorageManager {
  static loadObject(location) {
    var object = {}
    let data = localStorage.getItem(`UltimateBravery_${location}`)

    if(data) {
      object = JSON.parse(data);
    }

    return object
  }

  static loadObject(location, defaultValue) {
    var object = {}
    let data = localStorage.getItem(`UltimateBravery_${location}`)

    if(data) {
      object = JSON.parse(data);
    }

    //TODO: recurse
    for(let prop in defaultValue) {
      if(!object[prop]) {
        object[prop] = defaultValue[prop]
      }
    }

    return object
  }

  static save(location, object) {
    localStorage.setItem(
      `UltimateBravery_${location}`,
      object
    )
  }

  static saveObject(location, object) {
    localStorage.setItem(
      `UltimateBravery_${location}`,
      JSON.stringify(object)
    )
  }
}