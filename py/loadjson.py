import json
import os
from urllib.request import urlopen
from util import *
import tristana
import multiprocessing as mp
import argparse

parser = argparse.ArgumentParser(
    description='Fetch and fromat the json from Riot Game\'s Data Dragon'
)

parser.add_argument(
    '-u', '--update',
    help='the particular types of data to update',
    default=tristana.canUpdate,
    choices=tristana.canUpdate,
    type=str,
    nargs='*'
)

parser.add_argument(
    '-o', '--output_dir',
    help='output directory',
    default='json'
)

parser.add_argument(
    '-r', '--regions',
    help='considers the particular regions for updating',
    default=tristana.allRealms,
    choices=tristana.allRealms,
    type=str,
    nargs='*'
)

parser.add_argument(
    '-l', '--languages',
    help='considers the particular languages only for updating',
    type=str,
    nargs='*'
)

parser.add_argument(
    '-p', '--pretty',
    help='outputs the json with prettyprint',
    default=False,
    action='store_true'
)

args = parser.parse_args()

def updateRealmData():
    print('Updating realm data')
    for realm in tristana.allRealms:
        toJsonFile(
            request('https://ddragon.leagueoflegends.com/realms/%s.json' % realm.lower() ),
            os.path.join(args.output_dir, 'realm_%s.json' % realm.lower() )
        )
    print('Finished updating realm data')

if __name__ == '__main__':
    mp.freeze_support()

    thisServersRealm = 'NA'

    updateRealmData()

    validVersions = request('https://ddragon.leagueoflegends.com/api/versions.json')
    toJsonFile(validVersions, os.path.join(args.output_dir, 'versions.json'))

    supportedLang = request('https://ddragon.leagueoflegends.com/cdn/languages.json')
    toJsonFile(supportedLang, os.path.join(args.output_dir, 'languages.json'))

    langToDo = supportedLang
    if args.languages:
        langToDo = args.languages

    with mp.Pool(processes=32) as poolParty:
        combo = []
        realmData = request('https://ddragon.leagueoflegends.com/realms/{0}.json'.format(thisServersRealm.lower()))

        for language in langToDo:
            combo.append((thisServersRealm, realmData, language, args.output_dir, args.pretty))

        for thingToUpdate in args.update:
            print('Updating %s' % thingToUpdate)
            poolParty.starmap(
                getattr(tristana, 'get'+thingToUpdate),
                combo
            )

        print('Update complete')
    pass;
