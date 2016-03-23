import React, { PropType } from 'react'
import ChampionIcon from '../lol/champion/ChampionIcon'

export default class ChampionPool extends React.Component {

  render() {
    let champions = this.props.champions

    console.log('%o', this.props.dataDragon)

    return (
      <div >{
        Object.keys(champions)
        .map(champion => <ChampionIcon key={champion} dataDragon={this.props.dataDragon} image={champions[champion].image}/>)}</div>
    );
  }
}
