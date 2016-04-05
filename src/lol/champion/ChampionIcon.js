import React from 'react'
import Icon from '../common/Icon';
import './ChampionIcon.css'

export default class ChampionIcon extends React.Component  {

    render() {
        return <Icon
            image={this.props.image}
            dd={this.props.dd}
            addClass='ChampionIcon'
        />;
    }
}
