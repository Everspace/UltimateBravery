declare namespace cdragon {
  type ItemJson = Item[]
  type mapStringId = string

  type ItemID = number

  interface Item {
    id: ItemID
    name: string
    description: string
    active: boolean
    inStore: boolean
    from: ItemID[]
    to: ItemID[]
    categories: string[]
    mapStringIdInclusions: mapStringId[]
    maxStacks: 1
    modeNameInclusions: ddragon.ModeName[]
    requiredChampion: ddragon.ChampionID
    requiredAlly: ddragon.ChampionID
    requiredBuffCurrencyName: string
    requiredBuffCurrencyCost: string
    /**
     * 0 if not a transform item.
     */
    specialRecipe: ItemID
    isEnchantment: false
    price: number
    priceTotal: number
    iconPath: string
  }
}
