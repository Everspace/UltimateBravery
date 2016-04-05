import React from 'react'
import Icon from '../common/Icon';

export default class ItemIcon extends React.Component {

    render() {
        return <Icon
            image={this.props.image}
            dd={this.props.dd}
            addClass='ItemIcon'
        />;
    }
}
