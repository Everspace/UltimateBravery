import React, { PropType } from 'react'
import ChampionIcon from '../lol/champion/ChampionIcon'
import ItemIcon from '../lol/item/ItemIcon'

export default class UltimateBravery extends React.Component {

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

    render() {
        let items = this.props.items
        let dd = this.props.dataDragon
        let championData = this.roll(this.props.champions)
        console.log(championData)
        console.log(this.roll(items))
        let chosenItems = Array.from({length: 5}, (v,k) => this.roll(items))
        console.log(chosenItems)
        return (
            <div class="UltimateBravery">
                <ChampionIcon
                    key={championData.key}
                    champion={championData}
                    dataDragon={this.props.dataDragon}
                />
                {chosenItems.map(item =>
                    <ItemIcon
                    key={item.key}
                    item={item}
                    dataDragon={this.props.dataDragon}
                    />
                )}

            </div>
        )
    }

}