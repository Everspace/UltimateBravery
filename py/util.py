import json
import os
from urllib.request import urlopen
import codecs

'''
Convienience methods.
'''

'''
Load a json from a url.
'''
def request(url):
    print(url)
    return json.loads(
        urlopen(url).read().decode('utf-8-sig') #Decode with -sig to get rid of BOM
    )

'''
Groom ensures that the sorce dict adheirs to only a set of keys specified
in the allowed dict.

This trims our information down by a substantial ammount.
(I don't really need to know scaling for skills)
'''
def groom(sourceDict, allowedDict):
    newDict = {}
    for key in allowedDict.keys():
        if not key in sourceDict:
            #Things not being in the sourceDict is ok
            pass
        else:
            #If the the allowedDict[key] points to a dict, we want to recurse down.
            if type(allowedDict[key]) is dict:
                #Spells are stored in a list, but I want to specify what is ok in them via a Dict of Dicts.
                if type(sourceDict[key]) is list:
                    newList = []
                    for item in sourceDict[key]:
                        newList.append(
                            groom(item, allowedDict[key])
                        )
                    newDict[key] = newList
                else:
                    newDict[key] = groom(sourceDict[key], allowedDict[key])
            else:
                newDict[key] = sourceDict[key]
    return newDict

'''
Allows me do the nice syntax of

    mkdir('fun', 'subdirectory/farts')

to ensure a path is there
'''
def mkdir(*path):
    p = os.path.join(*path)
    os.makedirs(p , exist_ok=True)
    return p

'''
Puts the json in the file or else it gets the hose again

can pretty it up if I want it
'''
def toJsonFile(jsonObj, filePath, pretty=True):
    mkdir(os.path.split(filePath)[0])
    jsonString = None
    if(pretty):
        jsonString = json.dumps(
            jsonObj,
            ensure_ascii=False,
            sort_keys=True,
            indent=2,
            separators=(',', ': ')
        )
    else:
        jsonString = json.dumps(
            jsonObj,
            ensure_ascii=False,
            sort_keys=True,
            separators=(',', ':')
        )

    with codecs.open(filePath, mode='w', encoding='utf-8') as blob:
        blob.write(jsonString)

    return filePath
