import React from 'react'
import Icon from '../common/Icon';

export default class ChampionIcon extends React.Component  {

    render() {
        return <Icon
            image={this.props.champion.image}
            dataDragon={this.props.dataDragon}
            class='ChampionIcon'
        />;
    }
}
