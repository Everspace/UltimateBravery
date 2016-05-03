import Random from 'common/Random'

/**
* A class to hold functions that match the champion.id
*
* This allows each champion to have a chance to say
* what is special and unique about them, and modify the roll before
* it is rendered.
*
* Each function is of the form "static void ChampionId(braveFactory)"
*
* BraveFactory assumes that no shoes will be added, if
* this is called. Add a shoe if that makes sense for the champion.
*/
export default class ChampionRandomizers {

  static Viktor(braveFactory) {
    //Add a perfect hex-core to our chosen items
    braveFactory.addItemById('3198')
    braveFactory.completeBravery()
  }

  static Gangplank(braveFactory) {
    let serpentItems = Random.shuffle(['3901','3902','3903'])
    for(let index in serpentItems) {
      braveFactory.addExtraItemById(serpentItems[index])
    }

    braveFactory.completeBravery()
  }

  static Cassiopeia(braveFactory) {
    braveFactory.fillWithItems()
    braveFactory.completeBravery()
  }
}