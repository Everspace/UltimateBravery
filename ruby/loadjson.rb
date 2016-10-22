require 'threadparty'
require './lol/DataDragon'
require './Tristana'
require './Utils'

dd = DataDragon.new(realm_info: DataDragon.get_realm_info)
Utils.dump dd.get('language'), 'lang'

t = Tristana.new languages: ['en_US']
t.get_champions