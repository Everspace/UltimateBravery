import Random from 'common/Random'

//A class to hold functions that match the champion.id

//This allows each champion to have a chance to say
//what is special and unique about them, and modify the roll before
//it is rendered.

//Each function is of the form "id(braveFactory)",
//where braveFactory is an object of BraveFactory
export default class ChampionRandomizers {

  static Viktor(braveFactory) {
    //TODO: make braveFactory conform to this sort of callPatern
    braveFactory.addShoe()

    //Add a perfect hex-core to our chosen items
    braveFactory.addItems('3198')
  }

  static Gangplank(braveFactory) {
    braveFactory.addShoe()

    let serpentItems = Random.shuffle(['3901','3902','3903'])
    braveFactory.addExtraItems(serpentItems)
  }

}