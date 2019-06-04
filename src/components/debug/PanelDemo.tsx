import React from "react"
import { Panel } from "components/Panel"

export const PanelDemo: React.FC<{}> = () => (
  <Panel>
    0
    <Panel>
      1
      <Panel>
        2
        <Panel>
          3<Panel>4</Panel>
        </Panel>
      </Panel>
    </Panel>
  </Panel>
)
