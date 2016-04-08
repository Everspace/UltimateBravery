import React from 'react'
import Icon from '../common/Icon';
import './ChampionIcon.css'

export default class ChampionIcon extends React.Component  {

    render() {
      let classes = 'ChampionIcon'

      if(!this.props.have) {
        classes += ' Disabled'
      }

      return <Icon
          onClick={this.props.onClick}
          image={this.props.image}
          dd={this.props.dd}
          addClass={classes}
      />;
    }
}
