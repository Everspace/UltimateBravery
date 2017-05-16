import React from 'react'
import { connect } from 'react-redux'

import ChampionIcon from 'lol/champion/ChampionIcon'
import './ChampionPool.less'

import SearchBar from './SearchBar'
import * as actions from './actions'

// this.props.champions

const mapStateToProps = (state) => {
  return {
    champions: state.champions
  }
}

class MainWindow extends React.Component {
  constructor () {
    super()
    this.state = {
      filter: ''
    }
  }

  roles = [
    'Assassin',
    'Fighter',
    'Marksman',
    'Mage',
    'Support',
    'Tank'
  ]

  idToName = window.dat.champions.allChampions.reduce((memory, id) => {
    memory[id] = window.dat.champions.data[id].name.toLowerCase()
    return memory
  }, {})

  onTextUpdate = (event) => {
    this.setState({
      filter: new RegExp(`\\b${event.target.value}`, 'i')
    })
  }

  searchFilterChampions = (id) => {
    return this.idToName[id].search(this.state.filter) > -1
  }

  makeRoleButton = (role) => {
    let properties = {
      key: role,
      value: role,
      onClick: () => this.props.enableChampionRole(role)
    }

    return (<button {...properties}>
      {window.dat.languages.data[role]}
    </button>)
  }

  makeChampionButton = (id) => {
    let button = <ChampionIcon
      key={id}
      onClick={() => this.props.toggleChampion(id)}
      have={this.props.champions[id]}
      image={window.dat.champions.data[id].image}
      dd={window.dd}
    />
    return button
  }

  render () {
    return (
      <div className='ChampionPool'>
        <SearchBar onTextUpdate={this.onTextUpdate} />
        <div>
          <button
            key='enableAll'
            onClick={() => this.props.setManyChampions('all', true)}
          >ENABLE ALL!</button>
          <button
            key='disableAll'
            onClick={() => this.props.setManyChampions('all', false)}
          >DISABLE ALL!</button>
        </div>
        <div className='Roles'>
          {this.roles.map(this.makeRoleButton)}
        </div>
        <div className='Champions'>
          {
            window.dat.champions.allChampions
            .sort((a, b) => this.idToName[a].localeCompare(this.idToName[b]))
            .filter(this.searchFilterChampions)
            .map(this.makeChampionButton)
          }
        </div>
        <div key='pusher' className='Pusher' />
      </div>
    )
  }
}

export default connect(
  mapStateToProps, actions
)(MainWindow)
