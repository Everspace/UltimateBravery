declare namespace ddragon {
  type ItemID = string

  type ChampionID = string

  interface ItemJson {}

  type MapID = "1" | "8" | "10" | "12"

  interface Item {
    name?: ""
    rune?: { isrune: false; tier: 1; type: "red" }
    gold?: { base: 0; total: 0; sell: 0; purchasable: false }
    group?: ""
    description?: ""
    colloq?: ";"
    plaintext?: ""
    consumed?: false
    stacks?: 1
    depth?: 1
    consumeOnFull?: false
    from?: ItemID[]
    into?: ItemID[]
    /**
     * It's an ItemID but a number
     */
    specialRecipe?: number
    inStore?: true
    hideFromAll?: false

    requiredChampion?: ChampionID
    requiredAlly?: ChampionID

    maps: Record<MapID, boolean>
    stats: {
      FlatHPPoolMod?: number
      rFlatHPModPerLevel?: number
      FlatMPPoolMod?: number
      rFlatMPModPerLevel?: number
      PercentHPPoolMod?: number
      PercentMPPoolMod?: number
      FlatHPRegenMod?: number
      rFlatHPRegenModPerLevel?: number
      PercentHPRegenMod?: number
      FlatMPRegenMod?: number
      rFlatMPRegenModPerLevel?: number
      PercentMPRegenMod?: number
      FlatArmorMod?: number
      rFlatArmorModPerLevel?: number
      PercentArmorMod?: number
      rFlatArmorPenetrationMod?: number
      rFlatArmorPenetrationModPerLevel?: number
      rPercentArmorPenetrationMod?: number
      rPercentArmorPenetrationModPerLevel?: number
      FlatPhysicalDamageMod?: number
      rFlatPhysicalDamageModPerLevel?: number
      PercentPhysicalDamageMod?: number
      FlatMagicDamageMod?: number
      rFlatMagicDamageModPerLevel?: number
      PercentMagicDamageMod?: number
      FlatMovementSpeedMod?: number
      rFlatMovementSpeedModPerLevel?: number
      PercentMovementSpeedMod?: number
      rPercentMovementSpeedModPerLevel?: number
      FlatAttackSpeedMod?: number
      PercentAttackSpeedMod?: number
      rPercentAttackSpeedModPerLevel?: number
      rFlatDodgeMod?: number
      rFlatDodgeModPerLevel?: number
      PercentDodgeMod?: number
      FlatCritChanceMod?: number
      rFlatCritChanceModPerLevel?: number
      PercentCritChanceMod?: number
      FlatCritDamageMod?: number
      rFlatCritDamageModPerLevel?: number
      PercentCritDamageMod?: number
      FlatBlockMod?: number
      PercentBlockMod?: number
      FlatSpellBlockMod?: number
      rFlatSpellBlockModPerLevel?: number
      PercentSpellBlockMod?: number
      FlatEXPBonus?: number
      PercentEXPBonus?: number
      rPercentCooldownMod?: number
      rPercentCooldownModPerLevel?: number
      rFlatTimeDeadMod?: number
      rFlatTimeDeadModPerLevel?: number
      rPercentTimeDeadMod?: number
      rPercentTimeDeadModPerLevel?: number
      rFlatGoldPer10Mod?: number
      rFlatMagicPenetrationMod?: number
      rFlatMagicPenetrationModPerLevel?: number
      rPercentMagicPenetrationMod?: number
      rPercentMagicPenetrationModPerLevel?: number
      FlatEnergyRegenMod?: number
      rFlatEnergyRegenModPerLevel?: number
      FlatEnergyPoolMod?: number
      rFlatEnergyModPerLevel?: number
      PercentLifeStealMod?: number
      PercentSpellVampMod?: number
    }
    effect?: {
      Effect1Amount?: string
      Effect2Amount?: string
      Effect3Amount?: string
      Effect4Amount?: string
      Effect5Amount?: string
      Effect6Amount?: string
      Effect7Amount?: string
      Effect8Amount?: string
    }
    tags: string[]
  }

  type ModeName =
    | "ASCENSION"
    | "ODIN"
    | "CLASSIC"
    | "ARSR"
    | "ASSASSINATE"
    | "DOOMBOTSTEEMO"
    | "ONEFORALL"
    | "SIEGE"
    | "SNOWURF"
    | "TUTORIAL"
    | "URF"
    | "ARAM"
    | "FIRSTBLOOD"
    | "KINGPORO"
    | "STARGUARDIAN"
    | "PROJECT"
    | "TUTORIAL_MODULE_2"
    | "TUTORIAL_MODULE_3"
    | "PRACTICETOOL"
    | "GAMEMODEX"
    | "ODYSSEY"

  interface Item {
    id: ItemID
  }
}
