//A util to do some pre-processing on a champion's items.
//Each function is of the format:
// ID(brave, props)
// - brave being the brave object for the current game/roll
// - props which is an object that contains itemData, championData, and userData
//   to source our selection from.
import Random from 'common/Random'

export default class ChampionRandomizers {

  static getShoe(itemData) {
    let id = Random.roll(itemData.lists.boots)
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

    let serpentItems = Random.shuffle(['3901','3902','3903'])
    brave.extras = Array.from(serpentItems, (id) => props.itemData.data[id])
    return brave
  }

}