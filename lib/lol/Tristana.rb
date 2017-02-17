require 'Utils'
require 'lol/DataDragon'
require 'lol/Groomer'

require 'yaml'
require 'benchmark'
require 'threadparty'

class Tristana

  @@UPDATEABLE_THINGS = [
    #:languages,
    :items,
    #:champions
    #:summoner_spells,
    #:masteries
  ].freeze

  def self.UPDATEABLE_THINGS
    @@UPDATEABLE_THINGS
  end

  attr_reader :groomer
  attr_reader :output_directory
  attr_reader :data_dragon
  attr_reader :item_info_dict
  attr_reader :champion_info_dict

  def initialize(
    language: 'en_US',
    realm: 'NA',
    config_directory: './config'
  )
    @groomer = Groomer.new "#{config_directory}/Grooming.yaml"
    @item_info_dict = YAML::load_file "#{config_directory}/Item.yaml"
    @champion_info_dict = YAML::load_file "#{config_directory}/Champions.yaml"
    @output_directory = output_directory
    @data_dragon = DataDragon.new realm, language
  end

  def get_languages
    @groomer.groom_blob @data_dragon.get('language')
  end

  def get_champions
    data_dragon = @data_dragon
    groomer = @groomer

    #We grab the 'all champion' json just to get
    #the names of all champions, and then get the specifics
    #afterwards
    base_champ_data = data_dragon.get('champion')
    data = ThreadParty.new do
      ProcessQueue do
        queue base_champ_data['data'].keys
        perform do |champ_id|
          groomer.groom_blob data_dragon.get("champion/#{champ_id}")
        end
      end
    end.iteratively.reduce do |compiled, blob|
      data_compiled = compiled['data']
      data_blob = blob['data']
      compiled['data'] = data_compiled.merge data_blob
      compiled
    end

    return data
  end

  def get_items
    @data_dragon.get('item')
  end

end
