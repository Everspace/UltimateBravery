import React, { PropType } from 'react'
import Random from 'common/Random'
import ChampionIcon from 'lol/champion/ChampionIcon'
import ItemIcon from 'lol/item/ItemIcon'
import ChampionRandomizers from 'app/ChampionRandomizers'

export default class MainDisplay extends React.Component {

  constructor(props) {
      super(props)
      this.fillWithItems   = this.fillWithItems.bind(this)
      this.fillWithMastery = this.fillWithMastery.bind(this)
      this.makeBrave       = this.makeBrave.bind(this)
      this.makeItemIcon    = this.makeItemIcon.bind(this)
      this.deductGroupItem = this.deductGroupItem.bind(this)
  }

  componentWillMount() {
      this.makeBrave()
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

  fillWithItems(brave) {
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

  fillWithMastery(brave) {

  }

  makeBrave() {
      let allChamps  = this.props.championData.data
      let userChamps = this.props.user.championData
      let availableChamps = {}

      Object.keys(allChamps).map(
          (id) => { if(userChamps[id]) {availableChamps[id] = allChamps[id]} }
      )

      //In the case we have nothing...
      if(!Object.keys(availableChamps).length) {
          availableChamps = this.props.championData.data
      }

      let brave = {
          champion: Random.roll(availableChamps),
          summonerspells: [],
          items: [],
          masteries: {
              offense: 0,
              defense: 0,
              utility: 0,
              keystone: null
          },

          extras: [] //Like Gangplank's special stuff
      }

      //If we have a randomizer tailored for that id, use it.
      if(ChampionRandomizers[brave.champion.id]) {
          brave = ChampionRandomizers[brave.champion.id](brave, this.props, this.fillWithItems)
      } else {
          brave.items.push(ChampionRandomizers.getShoe(this.props.itemData))
      }

      brave = this.fillWithItems(brave)

      this.setState({brave: brave})
  }

  makeItemIcon(item) {
    return <ItemIcon key={item.key} image={item.image} dd={this.props.dd}/>
  }

  render() {

    let containerStyle = {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'left'
    }

    let items = this.state.brave.items.map(this.makeItemIcon)

    var extras = []
    if (this.state.brave.extras.length) {
      extras = this.state.brave.extras.map(this.makeItemIcon)
    }

    return (
      <div className="MainDisplay">
        <h3>{this.state.brave.champion.name}</h3>
        <ChampionIcon
          key={this.state.brave.champion.key}
          image={this.state.brave.champion.image}
          dd={this.props.dd}
          have={true}
        />
        <button onClick={this.makeBrave}>BRAVERY!</button>

        <h3>{this.props.languageData.data.RecommendedItems}</h3>
        <div style={containerStyle}>
          {items}
        </div>
        {this.state.brave.extras.length ?
          <div>
            <h3>{this.props.languageData.data.Details_}</h3>
            <div style={containerStyle}>
              {extras}
            </div>
          </div>
          :null
        }

      </div>
    )
  }

}