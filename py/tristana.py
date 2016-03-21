from util import *
from sys import argv
import os

'''
The (data)dragon tamer.

Here we define different attributes, like what realms are available,
and how to massage the data once we aquire it.
'''

#BR = Brazil
#LA N/S = Latin America North/South
#TR = Turkey
allRealms = ['NA', 'BR', 'EUNE', 'EUW', 'KR', 'LAN', 'LAS', 'OCE', 'TR', 'RU', 'JP']
jsonDir = mkdir(os.curdir, 'json')
dataRequestString = '{0}/{1}/data/{2}/{3}.json'

imageObject = {
    'full': None,
    'sprite': None,
    'group': None,
    'x': None,
    'y': None,
    'w': None,
    'h': None
}

champAcceptedData = {
    'id': None,
    'key': None,
    'name': None,
    'title': None,
    'image': imageObject,
    'skins': None,
    'tags': None,
    'spells': { #An array
        'id': None,
        'name': None,
        'maxrank': None,
        'image': imageObject
    }
}

def getChampions(realm, realmData, language):
    cdn = realmData['cdn'] #content delivery network
    dd = realmData['dd'] #datadragon version
    l = language
    print('Starting champion fetch %s : %s' % (realm, l))

    requestedAllChampData = request(dataRequestString.format(cdn, dd, l, 'champion'))
    groomedAllChampData = {}

    for champion in requestedAllChampData['data']:
        champData = request(dataRequestString.format(cdn, dd, l, 'champion/%s' % champion))['data'][champion]
        groomedAllChampData[champion] = groom(champData, champAcceptedData)

    requestedAllChampData['data'] = groomedAllChampData
    toJsonFile(requestedAllChampData, os.path.join(jsonDir, language, 'champion.json'))

    print('Completed champion fetch %s : %s' % (realm, l))

itemAcceptedData = {
    'name': None,
    'group': None,
    'colloq': None,
    'into': None,
    'image': imageObject,
    'gold': {
        'total': None
    },
    'tags': None,
    'maps': None
}

def getItems(realm, realmData, language):
    cdn = realmData['cdn'] #content delivery network
    dd = realmData['dd'] #datadragon version
    l = language
    dest = mkdir(jsonDir, language)

    print('Starting item fetch %s : %s' % (realm, l))
    requestedAllItemData = request(dataRequestString.format(cdn, dd, l, 'item'))

    groomedAllItemData = {}
    for item in requestedAllItemData['data']:
        groomedAllItemData[item] = groom(requestedAllItemData['data'][item], itemAcceptedData)

    requestedAllItemData['data'] = groomedAllItemData
    toJsonFile(requestedAllItemData, os.path.join(jsonDir, language, 'item.json'))

    print('Completed item fetch %s : %s' % (realm, l))

def getLanguageConverters(realm, realmData, language):
    cdn = realmData['cdn'] #content delivery network
    dd = realmData['dd'] #datadragon version
    l = language

    print('Starting language converter fetch %s : %s' % (realm, l))
    toJsonFile(
        request(dataRequestString.format(cdn, dd, l, 'language')), 
        os.path.join(jsonDir, language, 'language.json')
    )
    print('Completed language converter fetch %s : %s' % (realm, l))
