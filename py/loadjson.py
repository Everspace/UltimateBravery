import json
import os
from urllib.request import urlopen
from util import *
import tristana
import multiprocessing as mp

def updateRealmData():
    print('Updating realm data')
    for realm in tristana.allRealms:
        toJsonFile(
            request('https://ddragon.leagueoflegends.com/realms/%s.json' % realm.lower() ),
            os.path.join(tristana.jsonDir, 'realm_%s.json' % realm.lower() )
        )
    print('Finished updating realm data')

def needUpdate():

    #if not passedComplexCheck:
    #   updateRealmData()
    #
    updateRealmData()
    return True
    #else:
    #   return False

def getAllTheThings():

    validVersions = request('https://ddragon.leagueoflegends.com/api/versions.json')
    toJsonFile(validVersions, os.path.join(tristana.jsonDir, 'versions.json'))

    supportedLang = ['en_US'] #request('https://ddragon.leagueoflegends.com/cdn/languages.json')
    toJsonFile(supportedLang, os.path.join(tristana.jsonDir, 'languages.json'))

    with mp.Pool(processes=4) as poolParty:
        combo = []
        realmData = request('https://ddragon.leagueoflegends.com/realms/{0}.json'.format(thisServersRealm.lower()))
        for language in supportedLang:
            combo.append((thisServersRealm, realmData, language))

        #print('Updating languages')
        #poolParty.starmap(tristana.getLanguageConverters, combo)
        print('Updating items')
        poolParty.starmap(tristana.getItems, combo)
        #print('Updating Champions')
        #poolParty.starmap(tristana.getChampions, combo)
        #print('Update complete')
    pass;

if __name__ == '__main__':
    mp.freeze_support()

    thisServersRealm = 'NA'

    if needUpdate():
        getAllTheThings();
