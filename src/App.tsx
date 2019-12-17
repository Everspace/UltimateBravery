/** @jsx jsx */
import { jsx } from "@emotion/core"
import DebugItemGrid from "components/debug/ItemGrid"
import { useRef } from "react"
import { useFetchJson } from "lib/hooks"

const Container: React.FC = () => {
  const mapRef = useRef<HTMLSelectElement>(null)
  const data = useFetchJson("./data")
  return (
    <nav>
      <select ref={mapRef}>Me I'm a select</select>
      <option />
    </nav>
  )
}

const App: React.FC = () => {
  return (
    <div className="App">
      <DebugItemGrid />
    </div>
  )
}

export default App
