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

  #You should do realm based on your current IP, not nessisarily
  #Where you're going.
  def initialize(realm='NA')
    realm_info_url = "#{DDRAGON_URL}/realms/#{realm.downcase}.json"
    p realm_info_url
    r = HTTParty.get(realm_info_url)
    @realm_info = JSON.parse(r.body, symbolize_names: true)
  end

  def set_language(lang)
    @realm_info[:l] = lang
  end

  def get(item)
    p URL_FORMAT % @realm_info.merge({item: item})
    JSON.parse(
      HTTParty.get(URL_FORMAT % @realm_info.merge({item: item})).body
    )
  end

end