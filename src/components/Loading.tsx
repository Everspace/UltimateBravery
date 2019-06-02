import React from "react"
import { FetchHookStatus } from "lib/hooks"

type LoadingProps = Partial<Record<FetchHookStatus, any>> & {
  state: FetchHookStatus
}

type Loading = React.FC<LoadingProps>

const Loading: Loading = ({ success, failed, loading, state }) => {
  switch (state) {
    case "success":
      return success
    case "failed":
      return failed || <>failed</>
    case "loading":
      return loading || <>loading...</>
  }
}

export default Loading
