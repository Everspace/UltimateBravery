import { css } from "styled-components"

let generateGuard = (guard, ...args) =>
  (...args) =>
    css`${guard} {
      ${css(...args)}
    }`

export const mobileSwitch = {
  mobile: generateGuard("@media screen and (-webkit-min-device-pixel-ratio: 1.3)"),
  desktop: generateGuard("@media screen and (-webkit-min-device-pixel-ratio: 1.3)")
}

// export const mobileSwitch = ({onDesktop, onMobile}) => {
//   console.assert(onMobile, "onMobile needs to be present")
//   let compiled = ``
//   if (onMobile) {
//     compiled = css({
//       strings: [
//         compiled,
//         `
//         @media screen and (-webkit-min-device-pixel-ratio: 1.3) {
//           ${css(onMobile)}
//         }
//         `
//       ]
//     })
//   }

//   if (onDesktop) {
//     compiled = css({
//       strings: [
//         compiled,
//         `
//         @media screen and (-webkit-min-device-pixel-ratio: 1.0) {
//           ${css(onDesktop)}
//         }
//         `
//       ]
//     })
//   }

//   return compiled
// }

//  Apply the following style only if
//  the device is capable of it;
//  Thanks http://www.javascriptkit.com/dhtmltutors/sticky-hover-issue-solutions.shtml
export const hoverGuard = {
  notHoverable: generateGuard("@media (hover: none)"),
  hoverable: generateGuard("@media (hover:hover)")
}
