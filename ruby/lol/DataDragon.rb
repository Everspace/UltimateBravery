require 'httparty'
require 'json'

class DataDragon

  #very specifically not https location for fetching realm.json
  DDRAGON_URL = "http://ddragon.leagueoflegends.com"

  #cdn = cdn url
  #dd = datadragon version
  #l = language code (en_US)
  #from the realm.json
  #used for every request ever
  URL_FORMAT = "%{cdn}/%{dd}/data/%{l}/%{item}.json"

  #DDragon definition about the realm for reuse.
  @realm_info = {}

  @@realm_infos = {}

  #Method to get data so that we're not repeatedly fetching data all the time.
  def self.cache_realm_info(realm)
    realm_info_url = "#{DDRAGON_URL}/realms/#{realm.downcase}.json"
    r = HTTParty.get realm_info_url
    @@realm_infos[realm] = JSON.parse(r.body, symbolize_names: true)
    @@realm_infos[realm]
  end

  #You should do realm based on your current IP, not nessisarily
  #Where you're going.
  def initialize(realm = 'NA', language)
    @realm_info = if @@realm_infos[realm] then @@realm_infos[realm] else DataDragon.cache_realm_info realm end
    set_language! language if language
  end

  def set_language!(lang)
    @realm_info[:l] = lang
  end

  def get(item)
    JSON.parse(
      HTTParty.get(URL_FORMAT % @realm_info.merge({item: item})).body
    )
  end

end