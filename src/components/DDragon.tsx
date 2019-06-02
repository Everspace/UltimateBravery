import { createContext } from "react"

type DDragonContext = {
  /**
   * Version string that is set before the application loads.
   */
  version: string
}

export const DDragonContext = createContext<DDragonContext>({
  version: "",
})

export const DDragonCDN = "http://ddragon.leagueoflegends.com/cdn"
