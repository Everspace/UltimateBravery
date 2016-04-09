from util import *
import doran
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
    'partype': None,
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
    'requiredChampion': None,
    'depth': None,
    'image': imageObject,
    'gold': {
        'purchasable': None,
        'total': None
    },
    'tags': None,
    'maps': None
}

itemInfoPruned = ['tree', 'basic']

def getItems(realm, realmData, language):
    cdn = realmData['cdn'] #content delivery network
    dd = realmData['dd'] #datadragon version
    l = language
    dest = mkdir(jsonDir, language)

    print('Starting item fetch %s : %s' % (realm, l))
    requestedAllItemData = request(dataRequestString.format(cdn, dd, l, 'item'))

    #Filter out useless items like Faerie Charm and BFS
    actualItems = doran.judge(requestedAllItemData['data'])
    requestedAllItemData['data'] = actualItems

    groomedAllItemData = {}
    for item in requestedAllItemData['data']:
        processedItem = groom(requestedAllItemData['data'][item], itemAcceptedData)
        #Add the 'id' and 'key' so it spreads nicely over stuff.
        processedItem['id'] = item
        processedItem['key'] = item
        groomedAllItemData[item] = processedItem

    requestedAllItemData['data'] = groomedAllItemData
    for thing in itemInfoPruned:
        requestedAllItemData.pop(thing, None)

    #Make some lists for convienience
    #Can only belong to 1 of these
    boots = list()
    generic = list()
    jungleItems = list()
    champUnique = list()
    trinkets = list()

    for item in actualItems:
        #If we are champion unique, seperate
        if 'requiredChampion' in actualItems[item]:
            champUnique.append(item)
        #else lets analyze the group
        elif 'group' in actualItems[item]:
            #All the enchantments are of the form "Boots_____"
            if actualItems[item]['group'].startswith('Boots'):
                boots.append(item)

            elif actualItems[item]['group'] == 'JungleItems':
                jungleItems.append(item)

            elif actualItems[item]['group'] == 'RelicBase':
                trinkets.append(item)

            #So boring
            else:
                generic.append(item)

        #So boring
        else:
            generic.append(item)

    requestedAllItemData['lists'] = {
        'boots': boots,
        'generics': generic,
        'jungleItems': jungleItems,
        'champUniques': champUnique,
        'trinkets': trinkets
    }

    #Convert groups list to groups dict
    #newGroups[oldGroups[index].id] = oldGroups[index].MaxGroupOwnable
    #groups -> itemsPerGroup
    itemsPerGroup = dict()
    oldGroups = requestedAllItemData['groups']
    for group in oldGroups:
        if not group['id'] in doran.no['group']:
            itemsPerGroup[group['id']] = group['MaxGroupOwnable']

    requestedAllItemData['itemsPerGroup'] = itemsPerGroup
    del requestedAllItemData['groups']


    toJsonFile(requestedAllItemData, os.path.join(jsonDir, language, 'item.json'))

    print('Completed item fetch %s : %s' % (realm, l))

usedKeys = [
    #The word for "Champion" or "Item"
    'categoryChampion',
    'categoryItem',
    'categoryMastery',
    'categorySummoner',
    'Abilities',
    'Gold',
    'Level',

    #Categories? 'Details:'
    'Details_',
    'Rank_',
    'Require_',

    #I'm terrible at reccomending things
    'recommended_essential',

    #Available maps
    'Map10', 'Map1', 'Map12', 'Map8',

    #Languages
    'native_bg',
    'native_cs',
    'native_de',
    'native_el',
    'native_en',
    'native_es',
    'native_fr',
    'native_hu',
    'native_id',
    'native_it',
    'native_ja',
    'native_ko',
    'native_nl',
    'native_pl',
    'native_pt',
    'native_ro',
    'native_ru',
    'native_th',
    'native_tr',
    'native_vn',
    'native_zh',
    'native_zh_CN',
    'native_zh_MY',
    'native_zh_TW',
    'native_﻿ar'
]

#Remap this to that in requestedData['data']
keyTranslation = {
    'Map1': 'Map11' #New summoner rift is map 11. But lang still says 1.
}

def getLanguageConverters(realm, realmData, language):
    cdn = realmData['cdn'] #content delivery network
    dd = realmData['dd'] #datadragon version
    l = language

    print('Starting language converter fetch %s : %s' % (realm, l))
    requestedData = request(dataRequestString.format(cdn, dd, l, 'language'))

    newData = dict()
    for key in usedKeys:
        newData[key] = requestedData['data'][key]
    requestedData['data'] = newData

    #Put data where it's supposed to be
    for key in keyTranslation:
        targetKey = keyTranslation[key]
        requestedData['data'][targetKey] = requestedData['data'][key]

    for key in keyTranslation:
        del requestedData['data'][key]

    toJsonFile(
        requestedData,
        os.path.join(jsonDir, language, 'language.json')
    )
    print('Completed language converter fetch %s : %s' % (realm, l))
