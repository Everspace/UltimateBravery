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
    @@realm_infos[realm] = @@realm_infos[realm] || get_generic("realms/#{realm.downcase}.json")
    @@realm_infos[realm]
  end

  #Get a sybolized version of whatever you want
  def self.get_generic(item)
    url = "#{DDRAGON_URL}/#{item}"
    get_blob(url, json: {symbolize_names: true})
  end

  def self.get_blob(url, **options)
    #Defaulting to no args
    options = {
      http:{},
      json:{}
    }.merge(options)
    begin
      JSON.parse(
        HTTParty.get(url, **options[:http]).body,
        **options[:json]
      )
    rescue
      raise "ERROR: failed to get and parse #{url}"
    end
  end

  #
  def self.get_languages
    get_blob("#{DDRAGON_URL}/cdn/languages.json")
  end

  #You should do realm based on your current IP, not nessisarily
  #Where you're going.
  def initialize(realm = 'NA', language)
    @realm_info = (@@realm_infos[realm] || DataDragon.cache_realm_info(realm)).dup
    set_language! language if language
  end

  def set_language!(lang)
    @realm_info[:l] = lang
  end

  def get(item)
    DataDragon.get_blob(URL_FORMAT % @realm_info.merge({item: item}))
  end
end