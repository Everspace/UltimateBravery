import React, { PropType } from 'react'
import ChampionIcon from '../lol/champion/ChampionIcon'
import ItemIcon from '../lol/item/ItemIcon'

export default class MainDisplay extends React.Component {

    constructor(props) {
        super(props)
        this.roll = this.roll.bind(this);
    }

    roll(dataCollection) {
        let optionList = Object.keys(dataCollection)
        let choice = Math.floor(Math.random() * optionList.length)
        let item = dataCollection[optionList[choice]]
        return item
    }

    brave() {
        this.selection = {
            champion: this.roll(this.props.champions),
            summonerspells: [],
            items: [],
            masteries: {
                offense: 0,
                defense: 0,
                utility: 0,
                keystone: null
            }
        }
    }

    render() {

        let championData = this.roll(this.props.championData.data); //this.props.champions)
        let chosenItems = []

        let i = 5
        let attemptedItem = null
        while(i > 0) {
            attemptedItem = this.roll(this.props.itemData.data)
            if(!chosenItems.includes(attemptedItem)){
                chosenItems.push(attemptedItem);
                i--;
            }
        }

        return (
            <div className="MainDisplay">
                <ChampionIcon key={championData.key} image={championData.image} dd={this.props.dd} />
                {chosenItems.map(item => <ItemIcon key={item.key} image={item.image} dd={this.props.dd}/>)}
            </div>
        )
    }

}