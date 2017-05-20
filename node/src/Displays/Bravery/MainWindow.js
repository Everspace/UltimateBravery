import React from 'react'
import { connect } from 'react-redux'
import * as actions from './actions'
import './MainWindow.less'

import DropdownSelector from 'common/DropdownSelector'
import { SpriteImage } from 'lol/Sprite'

let objToLis = obj => Object.keys(obj).map(key => <li>{key}: {obj[key].toString()}</li>)

class MainWindow extends React.Component {
  constructor () {
    super()

    this.state = {
      map: '11'
    }
  }

  componentDidMount () {
    this.brave()
  }

  brave = () => {
    let okChamps = Object.keys(this.props.champions)
      .filter(champID => this.props.champions[champID])

    this.props.newBravery(this.state.map, okChamps)
  }

  render () {
    console.log(this.props.bravery)
    return (
      <div className={`Bravery ${this.props.className}`}>
        <DropdownSelector
          items={Object.keys(window.dat.items.map)}
          languageData={window.dat.languages.data}
          transformKey={key => key === '11' ? 'Map1' : `Map${key}`}
          defaultValue={this.state.map}
          events={{
            onChange: (event) => {
              this.setState({map: event.target.value})
              this.brave()
            }
          }}
        />
        <br />
        <button onClick={this.brave}>New Bravery!</button>
        <ol>
          {objToLis(this.props.bravery)}
          <h3>{window.dat.languages.data.RecommendedItems}</h3>
          <div className='SpriteRow'>
            {(this.props.bravery.itemList ?
              this.props.bravery.itemList
              .map(itemID => window.dat.items.data[itemID])
              .map(item => <SpriteImage className='Item' image={item.image} name={item.name} />)
              : null
            )}
          </div>
          <ol>
            {(this.props.bravery.itemList ?
              this.props.bravery.itemList
              .map(itemID => window.dat.items.data[itemID].name)
              .map(itemName => <li>{itemName}</li>)
              : null
            )}
          </ol>
        </ol>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    bravery: state.bravery,
    champions: state.champions
  }
}

export default connect(
  mapStateToProps, actions
)(MainWindow)


