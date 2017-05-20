import React from 'react'
import './MainWindow.less'

import DropdownSelector from 'common/DropdownSelector'
import { DebugItem } from './ItemDisplays'


let subtractUsing = function (badThings) {
  return (targetArray) => targetArray.filter(x => badThings.indexOf(x) === -1)
}

class MainWindow extends React.Component {
  constructor () {
    super()
    this.removeGroup = Object.keys(window.dat.items.group)
      .reduce((mem, groupName) => {
        mem[groupName] = subtractUsing(window.dat.items.group[groupName])
        return mem
      }, {})
    this.state = {
      map: '11',
      filters: []
    }
  }

  toggleFilter = (groupID) => {
    if (this.state.filters.indexOf(groupID) === -1) {
      this.setState({filters: [...this.state.filters, groupID]})
    } else {
      let newFilters = this.state.filters.filter(group => group !== groupID)
      this.setState({filters: newFilters})
    }
  }

  render () {
    console.log(this.state.filters)
    return (
      <div className={`DebugItems ${this.props.className}`} >
        <DropdownSelector
          items={Object.keys(window.dat.items.map)}
          languageData={window.dat.languages.data}
          transformKey={key => key === '11' ? 'Map1' : `Map${key}`}
          defaultValue={this.state.map}
          events={{
            onChange: (event) => {
              this.setState({map: event.target.value})
            }
          }}
        /> <br />
        <div>
          {
            Object.keys(this.removeGroup).map(
              (group) => {
                let isFiltered = this.state.filters.indexOf(group) !== -1
                let style = isFiltered ? {color: 'grey'} : null
                return <button
                  onClick={() => this.toggleFilter(group)}
                  style={style}
                >{group}</button>
            })
          }
        </div>
        <br />
        <div className='ItemHolder'>
          {
            this.state.filters.reduce(
              (items, badGroup) => this.removeGroup[badGroup](items),
              window.dat.items.map[this.state.map]
            )
            .map(itemID => <DebugItem itemID={itemID} />)
          }
        </div>
      </div>
    )
  }
}

export default MainWindow
