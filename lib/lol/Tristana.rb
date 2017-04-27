require 'Utils'
require 'lol/DataDragon'
require 'lol/Groomer'

require 'yaml'
require 'benchmark'

class Tristana

  @@UPDATEABLE_THINGS = [
    :languages,
    :items,
    :champions
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
    @data_dragon.get('language')
  end

  def get_champions
    @data_dragon.get('championFull')
  end

  def get_items
    @data_dragon.get('item')
  end

end
