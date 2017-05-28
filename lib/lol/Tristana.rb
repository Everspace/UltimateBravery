require 'lol/DataDragon'
require 'lol/Groomer'

class Tristana

  def self.UPDATEABLE_THINGS
    [
      :languages,
      :items,
      :champions,
      :maps,
      :summonerSpells,
      :masteries
    ].freeze
  end

  attr_reader :groomer
  attr_reader :data_dragon

  def initialize(
    language: 'en_US',
    realm: 'NA',
    config_directory: './config'
  )
    @groomer = Groomer.new "#{config_directory}/Grooming.yaml"
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

  def get_maps
    @data_dragon.get('map')
  end

  def get_summonerSpells
    @data_dragon.get('summoner')
  end

  def get_masteries
    @data_dragon.get('mastery')
  end

end
