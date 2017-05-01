require 'httparty'
require 'json'

class DataDragon

  #very specifically not https location for fetching realm.json
  def self.DDRAGON_URL
    "https://ddragon.leagueoflegends.com"
  end

  #cdn = cdn url
  #dd = datadragon version
  #l = language code (en_US)
  #from the realm.json
  #used for every request ever
  URL_FORMAT = "%{cdn}/%{dd}/data/%{l}/%{item}.json"

  # temp/cache/%{dd}/... the rest?
  def self.CACHE_DIR
    "temp/cache"
  end

  #DDragon definition about the realm for reuse.
  @realm_info = {}

  @@versions = []
  @@realm_infos = {}

  #Method to get data so that we're not repeatedly fetching data all the time.
  def self.realm_info(realm)
    @@realm_infos[realm] ||= get_generic("realms/#{realm.downcase}.json")
  end

  def self.versions
    if @@versions.empty?
      @@versions |= get_generic("api/versions.json")
    else
      @@versions
    end
  end

  #Get a sybolized version of whatever you want
  def self.get_generic(item)
    url = "#{DataDragon.DDRAGON_URL}/#{item}"
    get_blob(url, json: {symbolize_names: true})
  end

  #Anything with a cdn in the url could be in the dragontail if it exists
  def self.should_be_cached?(url)
    url.include?('cdn/')
  end

  #Turns a cacheable url into a file path
  def self.url_to_cache_location(url)
    path = url.partition("/cdn/").last #drop ddragon url
    File.join(DataDragon.CACHE_DIR, path)
  end

  #Ailiases a url request to the cache directory if it's there
  #TODO: perhaps notifying if I'm going to be using a cache?
  def self.get(url, **perhaps_html_options)
    cache_path = url_to_cache_location url
    if should_be_cached?(url) && File.exist?(cache_path)
      #I should attempt to load from the file before requesting
      File.open(cache_path) {|f| f.read }
    else
      perhaps_html_options.merge!({verify: false})
      HTTParty.get(url, **perhaps_html_options).body
    end
  end

  def self.get_blob(url, **options)
    #Defaulting to no args
    options = {
      http:{},
      json:{}
    }.merge(options)

    begin
      JSON.parse(
        get(url, **options[:http]),
        **options[:json]
      )
    rescue
      raise "ERROR: failed to get and parse #{url}"
    end
  end

  #
  def self.get_languages
    get_blob("#{DataDragon.DDRAGON_URL}/cdn/languages.json")
  end

  #You should do realm based on your current IP, not nessisarily
  #Where you're going.
  def initialize(realm = 'NA', language)
    @realm_info = DataDragon.realm_info(realm).dup
    set_language! language if language
  end

  def set_language!(lang)
    @realm_info[:l] = lang
  end

  def get(item)
    DataDragon.get_blob(URL_FORMAT % @realm_info.merge({item: item}))
  end
end