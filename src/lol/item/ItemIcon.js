import React from 'react'
import Icon from '../common/Icon';

export default class ItemIcon extends React.Component {

    render() {
        return <Icon
            image={this.props.item.image}
            dataDragon={this.props.dataDragon}
            class='ItemIcon'
        />;
    }
}
