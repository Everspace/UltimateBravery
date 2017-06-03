import React from "react"

import items from "lol/Items"
import { DebugItem } from "./ItemDisplays"
import { GlassPanel } from "common/components/Panels"
import { DropdownSelector, Button } from "common/components/Inputs"
import { AppWindowContent } from "common/components/FlexboxAppWindow"

const DebugItems = AppWindowContent

const OptionsPanel = GlassPanel.extend`
  margin: 1em;
  padding: 1em;
  flex: 1;
`

const ItemsPanel = GlassPanel.extend`
  display: flex;
  flex-wrap: wrap;
  flex: 1;
`

class MainWindow extends React.Component {
  constructor () {
    super()

    this.state = {
      map: "11",
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
    let style = isShown ? null : {color: "grey"}
    return <Button
      key={group}
      onClick={() => this.toggleFilter(group)}
      style={style}
    >{group}</Button>
  }

  render () {
    let theItems = this.state.showGroups.length === 0 ?
      items.allInMap(this.state.map)
      : this.state.showGroups
          .map(items.allInGroup)
          .reduce((mem, next) => [...mem, ...next], [])
          .filter((item, index, ary) => ary.indexOf(item) === index) // uniq, not very good
          .filter(items.filterForMap(this.state.map))

    theItems = theItems.map((itemID, index) => <DebugItem itemID={itemID} key={index} />)

    return (
      <DebugItems>
        <OptionsPanel>
          <DropdownSelector
            items={items.allMaps()}
            namify={key => window.dat.languages.data[key === "11" ? "Map1" : `Map${key}`]}
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
        </OptionsPanel>
        <ItemsPanel>
          {theItems}
        </ItemsPanel>
      </DebugItems>
    )
  }
}

export default MainWindow
