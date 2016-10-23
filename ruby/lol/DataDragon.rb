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
  @realm_info

  #Method to get data so that we're not repeatedly fetching data all the time.
  def self.get_realm_info(realm = 'NA')
    realm_info_url = "#{DDRAGON_URL}/realms/#{realm.downcase}.json"
    r = HTTParty.get realm_info_url
    JSON.parse(r.body, symbolize_names: true)
  end

  #You should do realm based on your current IP, not nessisarily
  #Where you're going.
  def initialize(realm_info: {}, language: 'en_US')
    raise ArgumentException, 'No realm_info provided!' unless realm_info || !realm_info.empty?
    @realm_info = realm_info
    set_language language
  end

  def set_language(lang)
    @realm_info[:l] = lang
  end

  def get(item)
    JSON.parse(
      HTTParty.get(URL_FORMAT % @realm_info.merge({item: item})).body
    )
  end

end