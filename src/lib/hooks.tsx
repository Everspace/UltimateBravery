import { useState, useEffect } from "react"

export type FetchHookStatus = "loading" | "success" | "failed"
export interface FetchState<T> {
  status: FetchHookStatus
  payload?: T
  reason?: any
}
type FetchHook = <T extends any>(
  input: RequestInfo,
  init?: RequestInit,
) => FetchState<T>

export const useFetchJson: FetchHook = <T extends any>(
  input: RequestInfo,
  init?: RequestInit,
) => {
  const [state, setState] = useState<FetchState<T>>({
    status: "loading",
  })

  useEffect(() => {
    const doThing = async () => {
      try {
        const response = await fetch(input, init)
        const json = await response.json()
        setState({ status: "success", payload: json })
      } catch (failure) {
        console.log(failure)
        setState({ status: "failed", reason: failure })
      }
    }
    doThing()
  }, [input, init])

  return state
}
