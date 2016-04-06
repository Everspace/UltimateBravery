import React, { PropType } from 'react'
import ChampionIcon from '../lol/champion/ChampionIcon'
import ItemIcon from '../lol/item/ItemIcon'
import ChampionRandomizers from './ChampionRandomizers'

export default class MainDisplay extends React.Component {

    state = {
        brave: this.makeBrave()
    }

    constructor(props) {
        super(props)
        this.roll = this.roll.bind(this);
        this.fillWithItems = this.fillWithItems.bind(this)
        this.fillWithMastery = this.fillWithMastery.bind(this)
        this.makeBrave = this.makeBrave.bind(this)
        this.getShoe = this.getShoe.bind(this)
        console.log(this)
    }

    roll(thing) {
        if(thing instanceof Array) {
            let index = Math.floor(Math.random() * thing.length)
            return thing[index]
        } else {
            let list = Object.keys(thing)
            let id = this.roll(list)
            return thing[id]
        }
    }

    getShoe() {
        let id = this.roll(this.props.itemData.lists.boots)
        let boot = this.props.itemData.data[id]
        return boot
    }

    fillWithItems(brave) {
        console.log(brave)
        let maxItems = 5
        let chosenItems = brave.items

        if(chosenItems.length >= maxItems) {
            //What are you doing here?!
            return brave
        }

        while(chosenItems.length < maxItems) {
            let id = this.roll(this.props.itemData.lists.generics)
            let attemptedItem = this.props.itemData.data[id]

            if(!chosenItems.includes(attemptedItem)){
                chosenItems.push(attemptedItem);
            }
        }

        brave.items = chosenItems

        return brave
    }

    fillWithMastery(brave) {

    }

    makeBrave() {
        let brave = {
            champion: this.roll(this.props.championData.data),
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

        //If ywe have a
        if(ChampionRandomizers[brave.champion.id]) {
            brave = ChampionRandomizers[brave.champion.id](brave, this.props, this.getShoe)
        } else {
            brave.items.push(this.getShoe())
        }

        brave = this.fillWithItems(brave)

        return brave
    }

    render() {

        let style = {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center'
        }

        return (
            <div>
                <div className="MainDisplay" style={style}>
                    <ChampionIcon key={this.state.brave.champion.key} image={this.state.brave.champion.image} dd={this.props.dd} />
                    {this.state.brave.items.map(
                        item => <ItemIcon key={item.key} image={item.image} dd={this.props.dd}/>
                    )}

                    <button onClick={() => this.setState({brave: this.makeBrave()})}>BRAVERY!</button>

                    {this.state.brave.extras.map(
                        item => <ItemIcon key={item.key} image={item.image} dd={this.props.dd}/>
                    )}
                    </div>
            </div>
        )
    }

}