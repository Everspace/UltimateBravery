no = {
    'group': [
        'HealthPotion','ManaPotion',
        'DoransItems',
        'Flasks', 'FlaskGroup',
        'GreenWards','PinkWards',
        'TheBlackSpear', #Kalista plz

        #Bilgewater plz
        'BWMerc11',
        'BWMerc12',
        'BWMerc13',
        'BWMerc14',
        'BWMercDefense1',
        'BWMercDefense2',
        'BWMercDefense3',
        'BWMercOffense1',
        'BWMercOffense2',
        'BWMercOffense3',
        'BWMercUpgrade1',
        'BWMercUpgrade2',
        'BWMercUpgrade3'
    ],
    'tags': [
        'Consumable'
    ]
}

excludedItemIDs = [
    #The raw enchantments
    '3240', '3241', '3242', '3243',
    '3671', '3672', '3673', '3674',
    #Cull
    '1083'
]

def logDiscard(willLog, item, reason='just because'):
    if(willLog):
        print('Discarded %s because %s' % (item['name'], reason))

def judge(itemDict, debug=False):

    approvedItems = dict()

    for item in itemDict:
        isGross = False

        if item in excludedItemIDs:
            logDiscard(debug, itemDict[item], 'I excluded exactly this item')
            continue

        for prop in no:
            if prop in itemDict[item]:
                if type(itemDict[item][prop]) is list:
                    theForbiddenThings = set(itemDict[item][prop]).intersection(no[prop])
                    if theForbiddenThings:
                        logDiscard(
                            debug,
                            itemDict[item],
                            'It was part of a group(s) I didn\'t like %s' % itemDict[item][prop]
                        )
                        isGross = True

                else:
                    if itemDict[item][prop] in no[prop]:
                        logDiscard(debug, itemDict[item], 'It has a property I don\'t like %s' % no[prop])
                        isGross = True

        if not itemDict[item]['gold']['purchasable']:
            logDiscard(debug, itemDict[item], 'It was not purchasable')
            isGross = True;

        if isGross:
            continue

        if not itemDict[item]['into']:
            approvedItems[item] = itemDict[item]
            continue
        else:
            item2 = itemDict[item]['into'][0]
            if not item2 in itemDict:
                print('Weird: {0} referenced non existant {1}'.format(item, item2))
                logDiscard(debug, itemDict[item], 'It was weird')
                continue

            if item in itemDict[item2]['into']:
                #is sidegrade
                approvedItems[item] = itemDict[item]
                continue
            elif not itemDict[item2]['gold']['purchasable']:
                #It transforms on you
                approvedItems[item] = itemDict[item]
                continue
            else:
                logDiscard(debug, itemDict[item], 'It builds into something')
                continue

    return approvedItems
