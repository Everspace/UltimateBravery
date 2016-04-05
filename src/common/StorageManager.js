export default class StorageManager {
  load(location) {

  }

  load(location, defaultValue) {

  }

  loadObject(location) {
    var object = {}
    let data = localStorage.getItem(`UltimateBravery_${location}`)

    if(data) {
      object = JSON.parse(data);
    }

    return object
  }

  loadObject(location, defaultValue) {
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

  save(location, object) {
    localStorage.setItem(
      `UltimateBravery_${location}`,
      object
    )
  }

  saveObject(location, object) {
    localStorage.setItem(
      `UltimateBravery_${location}`,
      JSON.stringify(object)
    )
  }
}