//A util to do some pre-processing on a champion's items.
//Each function is of the format:
// ID(brave, props)
// - brave being the brave object for the current game/roll
// - props which is an object that contains itemData, championData, and userData
//   to source our selection from.
export default class ChampionRandomizers {

  static roll(thing) {
        if(thing instanceof Array) {
            let index = Math.floor(Math.random() * thing.length)
            return thing[index]
        } else {
            let list = Object.keys(thing)
            let id = ChampionRandomizers.roll(list)
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

  static getShoe(itemData) {
      let id = ChampionRandomizers.roll(itemData.lists.boots)
      let boot = itemData.data[id]
      return boot
  }

  /*---------------------

      Champions

  -----------------------*/

  static Viktor(brave, props) {

    brave.items.push(ChampionRandomizers.getShoe(props.itemData))

    //Add a perfect hex-core to our chosen items
    brave.items.push(props.itemData.data['3198'])

    return brave
  }

  static Gangplank(brave, props) {

    brave.items.push(ChampionRandomizers.getShoe(props.itemData))

    let serpentItems = ChampionRandomizers.shuffle(['3901','3902','3903'])
    brave.extras = Array.from(serpentItems, (id) => props.itemData.data[id])
    return brave
  }

}