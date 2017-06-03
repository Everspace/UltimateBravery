import React from "react"
import { connect } from "react-redux"
import * as actions from "./actions"

import { DropdownSelector, Button } from "common/components/Inputs"
import items, { ItemSprite } from "lol/Items"
import { GlassPanel } from "common/components/Panels"
import { FlexRow } from "common/components/Flex"
import { AppWindowContent } from "common/components/FlexboxAppWindow"
const MainWindowPanel = GlassPanel.extend`
  margin: 3em;

  & ul {
    margin: 1em
    padding: 3em
  }
`

let objToLis = obj => Object.keys(obj).map(key => <li key={key}>{key}: {obj[key].toString()}</li>)

class MainWindow extends React.Component {
  constructor () {
    super()

    this.state = {
      map: "11"
    }
  }

  componentWillMount () {
    this.brave()
  }

  brave = () => {
    let okChamps = Object.keys(this.props.champions)
      .filter(champID => this.props.champions[champID])

    this.props.newBravery(this.state.map, okChamps)
  }

  render () {
    return (
      <AppWindowContent>
        <MainWindowPanel>
          <DropdownSelector
            items={items.allMaps()}
            namify={key => window.dat.languages.data[key === "11" ? "Map1" : `Map${key}`]}
            defaultValue={this.state.map}
            events={{
              onChange: (event) => {
                this.setState({map: event.target.value})
                this.brave()
              }
            }}
          />
          <br />
          <Button onClick={this.brave}>New Bravery!</Button>
          <GlassPanel>
            <ul>
              {objToLis(this.props.bravery)}
              <h3>{window.dat.languages.data.RecommendedItems}</h3>
              <FlexRow>
                {(this.props.bravery.itemList ?
                  this.props.bravery.itemList
                  .map(items.idToObj)
                  .map(i => <ItemSprite key={i.name} className='Item' image={i.image} name={i.name} />)
                  : null
                )}
              </FlexRow>
              <ol>
                {
                  this.props.bravery.itemList ?
                  this.props.bravery.itemList
                  .map(items.idToName)
                  .map(itemName => <li key={itemName}>{itemName}</li>)
                  : null
                }
              </ol>
            </ul>
          </GlassPanel>
        </MainWindowPanel>
      </AppWindowContent>
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
