import React from 'react'
import SpriteImage from 'lol/common/SpriteImage';
import './ChampionIcon.css'

export default class ChampionIcon extends React.Component  {
  render() {
    let classes = 'ChampionIcon'

    if(!this.props.have) {
      classes += ' Disabled'
    }

    return <SpriteImage
      className={classes}
      onClick={this.props.onClick}
      image={this.props.image}
      dd={this.props.dd}
    />;
  }
}
