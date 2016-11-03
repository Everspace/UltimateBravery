import Brave from 'app/MainDisplay/Brave'
import Random from 'common/Random'
import ChampionRandomizers from 'app/MainDisplay/ChampionRandomizers'

//A class to wrap the construction of braves that doesn't really
//make sense to be in the Brave data holder.
//Not an implementation of the factory pattern (I think).
export default class BraveFactory {

  constructor(props) {
    this.maxItems = 6
    //Recieve the MainDisplay's props
    this.props = props;
    //Start clean
    this.maxItemPerGroup = {}

    //Bind methods
    this.completeBravery = this.completeBravery.bind(this)
    this.fillWithItems = this.fillWithItems.bind(this)

    this.addShoe = this.addShoe.bind(this)

    this.addItem = this.addItem.bind(this)
    this.addItemById = this.addItemById.bind(this)
  }

  addShoe() {
    this.addItemById(
      Random.roll(this.props.itemData.ubrave.boots)
    )
  }

  /**
  * Add the item by it's string id ('3014').
  */
  addItemById(id) {
    this.addItem(this.props.itemData.data[id])
  }

  /**
  * Add an item object, checking to see if we can, and not if we can't.
  */
  addItem(attemptedItem) {
    if(typeof attemptedItem !== 'object'){
      console.log("idiot")
    }
    let groupAllowed = true

    if(attemptedItem.group) {
      groupAllowed = this.maxItemPerGroup[attemptedItem.group] > 0
    }

    if(groupAllowed && !this.brave.items.includes(attemptedItem)){
      this.deductGroupItem(attemptedItem);
      this.brave.items.push(attemptedItem);
      return true
    }

    return false;
  }

  /**
  * Add an item to the extraItems of the brave
  */
  addExtraItemById(id) {
    console.log(`Adding #{id}`)
    this.brave.extraItems.push(
      this.props.itemData.data[id]
    )
  }

  /**
  * Do everything to fill up the rest of the Brave object
  * ADDS SHOES
  */
  completeBravery() {

    let hasShoes = this.brave.items.find(
      (id)=> this.props.itemData.ubrave.boots.includes(id)
    )
    if(!hasShoes){
      console.log("No shoes")
    }

    if(!hasShoes && this.brave.items.length < this.maxItems) {
      console.log("added shoe")
      this.addShoe()
    }

    this.fillWithItems();
  }

  deductGroupItem(item) {
    if(item.group) {
      this.maxItemPerGroup[item.group] -= 1
      if(this.maxItemPerGroup[item.group] < 0) {
        itemsPerGroup[item.group] = 0
      }
    }
  }

  makeBrave() {
    console.log("Making things brave!")
    //Initialize the allowed items for this run.
    this.maxItemPerGroup = Object.assign({}, this.props.groups)

    let allChamps  = this.props.championData.data
    let userChamps = this.props.user.championData
    let availableChamps = {}

    this.brave = new Brave()

    //Get a list of all the champion ids the user has listed.
    Object.keys(allChamps).map(
      (id) => { if(userChamps[id]) {availableChamps[id] = allChamps[id]} }
    )

    //In the case we have nothing...
    if(!Object.keys(availableChamps).length) {
      //Use everything!
      availableChamps = this.props.championData.data
    }

    //Pick a championID
    this.brave.champion = Random.roll(availableChamps);

    //If we have a randomizer tailored for that id, use it.
    let randomizerMethod = ChampionRandomizers[this.brave.champion.id]
    if(randomizerMethod) {
      randomizerMethod(this)
    } else {
      this.completeBravery();
    }

    return this.brave
  }

  fillWithItems() {

    if(this.brave.items.length >= this.maxItems) {
        //What are you doing here?!
        return this.brave
    }

    let selectedMap = this.props.user.lolMap
    //Each item contains a list of legal maps it has.
    //So all possible items are ones that are legal on this
    //map after we filter every generic item.
    let possibleItems = this.props.itemData.ubrave.maps[selectedMap]
      .filter(
        (id) => !this.props.itemData.ubrave.champion_unique.all.includes(id)
      )

    while(this.brave.items.length < this.maxItems) {
      this.addItemById(
        Random.roll(possibleItems)
      )
    }

    return this.brave
  }
}