import React from 'react'
import './DropdownSelector.less'

class DropdownSelector extends React.Component {

  constructor () {
    super()
    this.makeOption = this.makeOption.bind(this)
  }

  makeOption (id) {
    let key = (this.props.transformKey) ? this.props.transformKey(id) : id
    let text = (this.props.languageData) ? this.props.languageData[key] : key
    return (
      <option value={id} key={id}>
        {text}
      </option>
    )
  }

  render () {
    return (
      <select className='DropdownSelector'
        defaultValue={(this.props.defaultValue) ? this.props.defaultValue : this.props.items[0]}
        {...this.props.events}
      >
        {this.props.items.map(this.makeOption)}
      </select>
    )
  }
}

DropdownSelector.propTypes = {
  // What to render
  items: React.PropTypes.array.isRequired,
  // Converts the key given to a new key for use
  // if localized
  transformKey: React.PropTypes.func,
  // If provided languageData, will localize
  languageData: React.PropTypes.object,
  // Default default is item at index[0]
  defaultValue: React.PropTypes.any,
  // onChange and things map.
  events: React.PropTypes.objectOf(React.PropTypes.func)
}

export default DropdownSelector
