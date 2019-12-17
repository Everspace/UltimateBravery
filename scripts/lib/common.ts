import https from "https"
import fs from "fs"
import path from "path"
import tar from "tar"

export const itemIn = <T>(item: T, arr: Array<T>): boolean => {
  return arr.indexOf(item) > -1
}

export const arraysIntersect = <T>(
  arr1: Array<T>,
  arr2: Array<T>,
): T | undefined => {
  return arr1.find(item => {
    return arr2.indexOf(item) >= 0
  })
}

export const mkdirpForFile = (p: string) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(path.resolve(path.dirname(p)), { recursive: true }, err => {
      if (err) {
        reject(err)
      }
      resolve()
    })
  })
}

export const mkdirpForFileSync = (p: string) => {
  fs.mkdirSync(path.resolve(path.dirname(p)), { recursive: true })
}

export const mkdirpSync = (p: string) => {
  fs.mkdirSync(path.resolve(p), { recursive: true })
}

export const wget = (url: string | https.RequestOptions): Promise<string> => {
  return new Promise((resolve, reject) => {
    https
      .get(url, response => {
        let statusCode = response.statusCode || -1
        if (statusCode < 0) {
          reject(
            new Error(
              `Request didn't even return a status code! ${JSON.stringify(
                response,
              )}`,
            ),
          )
        }
        if (statusCode < 200 || statusCode > 299) {
          reject(
            new Error(
              `Failure to get ${url}, responded with ${statusCode}: ${
                response.statusMessage
              }`,
            ),
          )
        }
        const body: any[] = []
        response.on("data", chunk => body.push(chunk))
        response.on("end", () => resolve(body.join("")))
      })
      .on("error", reject)
      .end()
  })
}

export const downloadToDisk = async (url: string, destination: string) => {
  return new Promise(async (resolve, reject) => {
    await mkdirpForFile(destination)
    const file = fs.createWriteStream(destination)
    https
      .get(url, response => {
        response.pipe(file)
        file.on("finish", () => {
          file.close()
          resolve(destination)
        })
      })
      .on("error", err => {
        fs.unlink(destination, err2 =>
          reject(`While handling: ${err}\nencountered ${err2}`),
        )
        reject(err)
      })
      .end()
  })
}

export const saveJson = async (
  obj: any,
  destination: string,
  pretty = false,
) => {
  console.log("Saving", destination)
  return new Promise<[string, string]>(async (resolve, reject) => {
    await mkdirpForFile(destination)
    const payload = JSON.stringify(obj, undefined, pretty ? 2 : undefined)
    fs.writeFile(destination, payload, err => {
      if (err) {
        reject(err)
      }
      resolve([destination, payload])
    })
  })
}

export const untar = async (source: string, dest?: string) => {
  dest =
    dest ||
    path.join(path.dirname(source), path.basename(source, path.extname(source)))
  source = path.resolve(source)
  dest = path.resolve(dest)

  if (fs.existsSync(dest)) {
    console.log(`Folder already exists, skipping extraction to ${dest}`)
    return dest
  }

  console.log(`Extracting ${source} to ${dest}`)
  mkdirpSync(dest)

  return new Promise((resolve, reject) => {
    const tarOpts: tar.ExtractOptions = {
      strip: 1,
      path: source,
      cwd: dest,
    }
    fs.createReadStream(source)
      .pipe(tar.x(tarOpts))
      .on("finish", () => {
        console.log(`Finished extracting ${source} to ${dest}`)
        resolve(dest)
      })
      .on("error", reject)
  })
}
