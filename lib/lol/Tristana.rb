require 'Utils'
require 'lol/DataDragon'
require 'lol/Groomer'

require 'yaml'
require 'benchmark'
require 'threadparty'

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

  def initialize(
    language: 'en_US',
    realm: 'NA',
    config_directory: './config'
  )
    @groomer = Groomer.new "#{config_directory}/Grooming.yaml"
    @item_info_dict = YAML::load_file "#{config_directory}/Item.yaml"
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
    items = @groomer.groom_blob @data_dragon.get('item')

    remove_inapproprate_items_from items

    #While we're here, lets axe groups where we've removed items from
    items['groups'].reject! { |blob| item_info_dict['Rejected Properties']['group'].include? blob['id'] }

    items
  end

  #
  # Handles removing items that are not "full build only" from items['data']
  #
  def remove_inapproprate_items_from(items)
    idata = items['data']
    #Remove things we said are not ok
    item_info_dict['Excluded IDs'].each{|id| idata.delete id}

    #Things that can't be baught are things we aren't interested in
    idata.reject!{|id, info| not info.dig('gold', 'purchasable') }

    #take snapshot of keys to iterate while we muck with the poor thing.
    ids = idata.keys.dup

    #Drop items that have groups or tags I think are stupid.
    ids.each do |id|
      item_info_dict['Rejected Properties'].each do |rejected_property, rejected_info|
        item_property = idata.dig(id, rejected_property)
        case item_property
        when Array
          idata.delete id unless (item_property & rejected_info).empty?
        when nil
          #pass
        else
          idata.delete id if rejected_info.include? item_property
        end
      end
    end

    #clean up the "into" category with only things that exist
    idata.each do |key, info|
      info['into'].keep_if {|id| idata.has_key? id}
    end

    #remove items from certain maps
    item_info_dict['Remove from Map'].each do |itemID, maps|
      maps.each do |mapID|
        idata[itemID]['maps'][mapID] = false
      end
    end

    ids = idata.keys.dup

    #handle things that build into themselves?
    ids.each do |id|
      info = idata.dig(id)

      #doesn't have an into, so doesn't build into anything
      next if info['into'].empty?

      info['into'].each do |possible_id|
        possible_info = idata.dig(possible_id)

        #Move along if we've deleted this item already
        unless possible_info
          idata.delete id
          next
        end

        #it's a sidegrade, so valid
        next if idata.dig(possible_id, 'into').include? id

        #Anything that builds into stuff that we don't like is also
        #something we're not interested in?
        unless items['data'].has_key? possible_id
          idata.delete id
          next
        end

        #This item is a result of transformation.
        if idata.dig(possible_id, 'gold', 'purchasable')
          idata.delete id
          next
        end

        idata.delete id
      end
    end
    items['data'] = idata
    items
  end


end
