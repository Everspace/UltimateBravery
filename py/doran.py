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

def judge(itemDict):

    approvedItems = dict()

    for item in itemDict:
        isGross = False

        if item in excludedItemIDs:
            continue

        for prop in no:
            if prop in itemDict[item]:
                if type(itemDict[item][prop]) is list:
                    theForbiddenThings = set(itemDict[item][prop]).intersection(no[prop])
                    if theForbiddenThings:
                        isGross = True

                else:
                    if itemDict[item][prop] in no[prop]:
                        isGross = True

        if not itemDict[item]['gold']['purchasable']:
            isGross = True;

        if isGross:
            print('Gross: ' + itemDict[item]['name'])
            continue

        if not itemDict[item]['into']:
            approvedItems[item] = itemDict[item]
            continue
        else:
            item2 = itemDict[item]['into'][0]
            if not item2 in itemDict:
                print('Weird: {0} {1} referenced {2}'.format(item, itemDict[item]['name'], item2))
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
                continue

    return approvedItems
