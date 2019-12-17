import https from "https"
import fs from "fs"
import { downloadToDisk, wget } from "./common"

const ddragonOptions: https.RequestOptions = {
  host: "ddragon.leagueoflegends.com",
  agent: false,
}

export const getDDragonVersion = async () => {
  return await getDDragon("/api/versions.json")
    .then(JSON.parse)
    .then((arr: Array<string>) => arr[0])
}

export async function getDDragon(path: string): Promise<any> {
  ddragonOptions.path = path
  return wget(ddragonOptions)
}

export const downloadLatestDDragon = async () => {
  const version = await getDDragonVersion()
  const filename = `dragontail-${version}.tgz`
  const dest = `tmp/${filename}`
  if (fs.existsSync(dest)) {
    console.log(`Already have ${filename}`)
    return dest
  } else {
    await downloadToDisk(
      `https://ddragon.leagueoflegends.com/cdn/${filename}`,
      dest,
    )
    console.log(`Downloaded ${filename}`)
    return dest
  }
}
