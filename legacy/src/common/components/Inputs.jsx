import React from "react"
import styled from "styled-components"

export const Element = styled.div`
  color: ${props => props.theme.colorTextBase};
  background: ${props => props.theme.colorBase};

  border: 1px solid;
  border-top-color: ${props => props.theme.colorBorderIntrestHigh};
  border-image: linear-gradient(to bottom,
      ${props => props.theme.colorBorderIntrestHigh} 0%,
      ${props => props.theme.colorBorderIntrestBase} 100%
  ) 1;

  font-size: 1em;

  padding: 0.5em;
  margin: 0.1em;

  &:focus {
    outline: none;
    box-shadow: none;
  }
`

/* */
let NormalizedOption = styled.option`
  &:focus {
    outline: none;
    box-shadow: none;
  }
`
let DropdownSelectorOption = ({id, text}) =>
  <NormalizedOption value={id} key={id}>
    {text}
  </NormalizedOption>

export const Select = Element.withComponent("select")
export const Button = Element.withComponent("button")
export const Input = Element.withComponent("input")

export const DropdownSelector = ({items, defaultValue, events, namify}) => {

  let options = items.map(key =>
    <DropdownSelectorOption key={key} id={key} text={namify ? namify(key) : key} />)
  defaultValue = defaultValue || items[0]

  return <Select defaultValue={defaultValue} {...events}>
    {options}
  </Select>
}

DropdownSelector.propTypes = {
  // What to render
  items: React.PropTypes.array.isRequired,
  // Converts the key to a text element if given
  namify: React.PropTypes.func,
  // If provided languageData, will localize
  languageData: React.PropTypes.object,
  // Default default is item at index[0]
  defaultValue: React.PropTypes.any,
  // onChange and things map.
  events: React.PropTypes.objectOf(React.PropTypes.func)
}
