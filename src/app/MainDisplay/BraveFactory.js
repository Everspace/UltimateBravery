import Brave from 'app/MainDisplay/Brave'
import ChampionRandomizers from 'app/MainDisplay/ChampionRandomizers'

//A class to wrap the construction of braves that doesn't really
//make sense to be in the Brave data holder.
//Not an implementation of the factory pattern (I think).
export default class BraveFactory {

  constructor(props) {

  }

  getShoe(itemData) {
    let id = Random.roll(itemData.lists.boots)
    let boot = itemData.data[id]
    return boot
  }

  deductGroupItem(itemsPerGroup, item) {
    if(item.group) {
      itemsPerGroup[item.group] -= 1
      if(itemsPerGroup[item.group] < 0) {
        itemsPerGroup[item.group] = 0
      }
    }

    return itemsPerGroup
  }

  makeBrave() {
    let allChamps  = this.props.championData.data
    let userChamps = this.props.user.championData
    let availableChamps = {}
    this.brave = new Brave()

    Object.keys(allChamps).map(
      (id) => { if(userChamps[id]) {availableChamps[id] = allChamps[id]} }
    )

    //In the case we have nothing...
    if(!Object.keys(availableChamps).length) {
      availableChamps = this.props.championData.data
    }

    let brave = {
      champion: Random.roll(availableChamps)
    }

    //If we have a randomizer tailored for that id, use it.
    if(ChampionRandomizers[brave.champion.id]) {
        brave = ChampionRandomizers[brave.champion.id](brave, this.props, this.fillWithItems)
    } else {
        brave.items.push(ChampionRandomizers.getShoe(this.props.itemData))
    }

    brave = this.fillWithItems(brave)
  }


  fillWithItems(brave, props) {
    let maxItems = 5
    let chosenItems = brave.items

    if(chosenItems.length >= maxItems) {
        //What are you doing here?!
        return brave
    }

    let maxItemPerGroup = Object.assign({}, this.props.itemData.itemsPerGroup)

    //Lets find out what we can do now...
    for(let index in chosenItems) {
      maxItemPerGroup = this.deductGroupItem(maxItemPerGroup, chosenItems[index])
    }

    let selectedMap = this.props.user.lolMap
    let possibleItems = this.props.itemData.lists.generics
      .filter(
        (id)=> this.props.itemData.data[id].maps[selectedMap]
      )

    while(chosenItems.length < maxItems) {
        let id = Random.roll(possibleItems)
        let attemptedItem = this.props.itemData.data[id]
        var groupAllowed = true

        if(attemptedItem.group) {
          groupAllowed = maxItemPerGroup[attemptedItem.group] > 0
        }

        if( groupAllowed && !chosenItems.includes(attemptedItem)){
          maxItemPerGroup = this.deductGroupItem(maxItemPerGroup, attemptedItem);
          chosenItems.push(attemptedItem);
        }
    }

    brave.items = chosenItems

    return brave
  }
}