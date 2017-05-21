import React from 'react'
import './MainWindow.less'

import * as items from 'lol/Items'
import DropdownSelector from 'common/DropdownSelector'
import { DebugItem } from './ItemDisplays'

class MainWindow extends React.Component {
  constructor () {
    super()

    this.state = {
      map: '11',
      showGroups: []
    }
  }

  toggleFilter = (groupID) => {
    if (this.state.showGroups.indexOf(groupID) === -1) {
      this.setState({showGroups: [...this.state.showGroups, groupID]})
    } else {
      let newGroups = this.state.showGroups.filter(group => group !== groupID)
      this.setState({showGroups: newGroups})
    }
  }

  toggleButton = (group) => {
    let isShown = this.state.showGroups.indexOf(group) !== -1
    let style = isShown ? null : {color: 'grey'}
    return <button
      onClick={() => this.toggleFilter(group)}
      style={style}
    >{group}</button>
  }

  render () {
    return (
      <div className={`DebugItems ${this.props.className}`} >
        <div className='Options'>
          <DropdownSelector
            items={items.allItemGroups()}
            languageData={window.dat.languages.data}
            transformKey={key => key === '11' ? 'Map1' : `Map${key}`}
            defaultValue={this.state.map}
            events={{
              onChange: (event) => {
                this.setState({map: event.target.value})
              }
            }}
          />
          <br />
          <h4>Only show:</h4>
          <div>{
            items.allItemGroups().map(this.toggleButton)
          }</div>
        </div>
        <div className='ItemHolder'>
          {
            (this.state.showGroups.length === 0
              ? items.allInMap(this.state.map)
              : this.state.showGroups
                .map(items.allInGroup)
                .reduce((items, itemsInGroup) => {
                  return [...items, ...itemsInGroup]
                }, [])
                .filter((item, index, ary) => ary.indexOf(item) === index) // uniq, not very fast
                .filter(items.filterForGroup(this.state.map))
            )
            .map((itemID, index) => <DebugItem itemID={itemID} key={index} />)
          }
        </div>
      </div>
    )
  }
}

export default MainWindow
