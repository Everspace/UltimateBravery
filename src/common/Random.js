
export default class Random {

  static roll(thing) {
        if(thing instanceof Array) {
            let index = Math.floor(Math.random() * thing.length)
            return thing[index]
        } else {
            let list = Object.keys(thing)
            let id = Random.roll(list)
            return thing[id]
        }
    }

  static shuffle(list) {
    let newList = []
    for (var i in list) {
      //Flip a coin and see if it goes to the front or back.
      if (Math.random() < 0.5) {
        newList.push(list[i])
      } else {
        newList.unshift(list[i])
      }
    }
    return newList
  }

}