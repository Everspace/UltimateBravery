require_relative './lol/DataDragon'
require_relative './lol/Groomer'
require_relative './Utils'

require 'yaml'
require 'benchmark'
require 'threadparty'

class Tristana


  @@UPDATEABLE_THINGS = [
    #:language_converters,
    #:items,
    :champions
    #:summoner_spells,
    #:masteries
  ].freeze

  def self.UPDATEABLE_THINGS
    @@UPDATEABLE_THINGS
  end

  attr_accessor :groomer
  attr_accessor :is_pretty
  attr_accessor :languages_to_fetch
  attr_accessor :output_dir
  attr_accessor :realm_info

  def initialize(
    realm: 'NA',
    is_pretty: false,
    languages:,
    config_directory: './config',
    output_dir: './output'
  )

    @groomer = Groomer.new "#{config_directory}/Grooming.yaml"
    @is_pretty = is_pretty
    @languages_to_fetch = if languages then languages else
        YAML::load_file("#{config_directory}/Languages.yaml")
      end
    @output_dir = output_dir
    @realm_info = DataDragon.get_realm_info realm

  end

  def get_champions
    groomed_data = {}
    dd_options = {realm_info: @realm_info}
    trist = self
    ThreadParty.new do
      ProcessQueue do
        queue trist.languages_to_fetch
        perform do |lang|
          o = dd_options.merge({language: lang})
          dd = DataDragon.new(**o)

          #We grab the 'all champion' json just to get
          #the names of all champions, and then get the specifics
          #afterwards
          base_champ_data = dd.get('champion')

          champ_data = ThreadParty.new do
            ProcessQueue do
              queue base_champ_data['data'].keys
              perform do |champ_id|
                trist.groomer.groom_blob dd.get("champion/#{champ_id}")
              end
            end
          end

          data = Tristana.mergify(champ_data.iteratively)

          Utils.write(
            data,
            "#{trist.output_dir}/#{lang}/champion.json",
            trist.is_pretty
          )
        end
      end
    end.iteratively
  end

  def self.mergify(raw_blobs)
    data_compilation = raw_blobs.first
    raw_blobs.each do |blob|
      data_compilation['data'] = data_compilation['data'].merge!(blob['data'])
    end
    return data_compilation
  end
end
