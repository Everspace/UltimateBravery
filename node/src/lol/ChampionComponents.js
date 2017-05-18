import React, { PropTypes } from 'react'
import { SpriteImage } from 'lol/Sprite'
import './ChampionComponents.less'

let champ = (id) => window.dat.champions.data[id]

export const SpriteIcon = ({id, className, onClick}) =>
  <SpriteImage
    className={className ? `ChampionIcon ${className}` : 'ChampionIcon'}
    onClick={onClick}
    image={champ(id).image}
  />

SpriteIcon.propTypes = {
  id: PropTypes.string.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func
}

export const Title = ({id}) =>
  <div className='ChampionTitle'>
    <div className='Text'>
      <h1>{champ(id).name}</h1>
      <h3>{champ(id).title}</h3>
    </div>
  </div>
