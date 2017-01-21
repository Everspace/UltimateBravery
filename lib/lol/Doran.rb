require 'Utils'

# Crunches data blobs after they have been groomed
# and raised by Tristana.
#
# All additional data is accessable under the key 'ubrave'
#
# item_blob.ubrave.maps for example
class Doran

  @@REFINEABLE_THINGS = [
    #:language_converters,
    :items,
    :champions,
    #:summoner_spells,
    #:masteries
  ].freeze

  @@NAMESPACE_KEY = 'ubrave'.freeze

  def self.REFINEABLE_THINGS
    @@REFINEABLE_THINGS
  end

  # ===============================================
  # Champions
  # ===============================================

  def self.refine_champions(champions)
    champions[@@NAMESPACE_KEY] = {}
    champions_create_sorted_champs_list champions
    champions_create_conversion_tables champions
    return champions
  end

  # Adds ['ids']
  #
  # Its a list of champ ids (MonkeyKing) that is sorted by localized name rather than
  # the key itself.
  def self.champions_create_sorted_champs_list(champions)
    ids = champions['data'].keys
    ids.sort {|a, b| champions['data'][a]['name'] <=> champions['data'][b]['name'] }
    champions[@@NAMESPACE_KEY]['ids'] = ids
    return champions
  end

  #
  # Adds ['convert']['name'] and ['convert']['id'] to allow for quicker flipflopping.
  #
  def self.champions_create_conversion_tables(champions)
    id_to_name = champions['data'].keys.inject({}) do |map, id|
      map[id] = champions['data'][id]['name']
      map
    end

    name_to_id = id_to_name.inject({}) do |map, key_value|
      id, champ_name = key_value
      map[champ_name] = id
      map
    end

    champions[@@NAMESPACE_KEY]['convert'] = {}
    champions[@@NAMESPACE_KEY]['convert']['id'] = id_to_name
    champions[@@NAMESPACE_KEY]['convert']['name'] = name_to_id

    return champions
  end

  # ===============================================
  # Items
  # ===============================================

  def self.refine_items(items)
    items[@@NAMESPACE_KEY] = {}

    items.delete "basic"
    items.delete "tree"

    items_remove_via_config items
    item_remove_inapproprate_items_from items

    item_create_maps_structure items
    item_sanitize_groups items
    item_create_champion_unique_structure items
    item_create_shoes_list items
    return items
  end

  #omg, ['shoes']
  def self.item_create_shoes_list(items)
    items[@@NAMESPACE_KEY]['boots'] = items['data'].inject([]) do |a, key_value|
      id, info = key_value
      a << id if info['tags'].include? 'Boots'
      a
    end
  end

  def self.items_remove_via_config(items, config='./config/Item.yaml')
    item_info_dict = YAML::load_file "#{config_directory}/Item.yaml"

    items_remove_explicitly_removed items, item_info_dict
    item_remove_with_rejected_properties items, item_info_dict
  end

  def self.items_remove_explicitly_removed(items, item_info_dict)
    #Remove things we said are not ok
    item_info_dict['Excluded IDs'].each{|id| items['data'].delete id}
  end

  def self.item_remove_unpurchasables(items)
    items['data'].reject!{|id, info| not info.dig('gold', 'purchasable') }
  end

  def self.item_remove_with_rejected_properties(items, item_info_dict)
    #take snapshot of keys to iterate while we muck with the poor thing.
    ids = items['data'].keys.dup

    #Drop items that have groups or tags I think are stupid.
    ids.each do |id|
      item_info_dict['Rejected Properties'].each do |rejected_property, rejected_info|
        item_property = items['data'].dig(id, rejected_property)
        case item_property
        when Array
          items['data'].delete id unless (item_property & rejected_info).empty?
        when nil
          #pass
        else
          items['data'].delete id if rejected_info.include? item_property
        end
      end
    end
  end

  #Remove items from certain maps using the config file
  #Used for Quickcharge versions of Rod of Ages and such when
  # Summoner's Rift (slow) gets a mode like Seige (fast).
  def self.item_remove_items_from_map(items, item_info_dict)
    item_info_dict['Remove from Map'].each do |item_id, maps|
      maps.each do |mapID|
        items['data'][item_id]['maps'][mapID] = false
      end
    end if item_info_dict['Remove from Map']
  end

  def self.item_cleanup_into_category(items)
    #clean up the "into" category with only things that exist
    items['data'].each do |key, info|
      info['into'].keep_if {|id| idata.has_key? id}
    end
  end

  def self.item_approprate?(item_id)
    #doesn't have an into, so doesn't build into anything
    return true if is_item_end_of_build? item_id
    return true if all_item_builds_valid?
  end

  def self.item_end_of_build?(item_id)
    return true if items.dig('data', item_id, 'into').empty?
  end

  def self.item_exists?(item_id)
    return not items.dig('data', item_id).nil?
  end

  def item_is_swappable?(item_id, possible_id)
    other_item_builds = items.dig('data', possible_id, 'into')
    return false if other_item_builds.empty?
    return other_item_builds.contains? item_id
  end

  def self.all_item_builds_valid?(item_id)
    #perform cleanup before we inspect
    info['into'].keep_if {|item| item_exists? item}

    #If we scrubbed all the other items this builds into already for
    #other reasons (transformations, other exclusions), this is probably fine
    return true if info['into'].empty?



    info['into'].each do |possible_id|
      #Move along if we've deleted this item already
      return false unless item_exists? possible_id

      #If this thing can swap between for instance, Titanic and Ravenous Hydra,
      #or all the different shoes, it's fine.
      return true if item_is_swappable?(item_id, possible_id)


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
    end
  end

  #
  # Handles removing items that are not "full build only" from items['data']
  #
  def self.remove_inapproprate_items_from(items)
    items_remove_via_config items

    ids = idata.keys.dup

    #handle things that build into themselves?
    ids.each do |id|
      if is_item_approprate? id then
        next
      else
        items['data'].delete id
      end
    end

    items
  end

  #
  # Adds ['maps']['map_id'] = [list of items]
  # to items to allow a quick way to get all the valid items.
  #
  # Adds 'available_maps' which gives us what maps actually exist and have items.
  def self.item_create_maps_structure(items)
    struct = items['data'].inject({}) do |map, keyvalue|
      id, info = keyvalue

      info['maps'].each do |map_id, is_valid|
        map[map_id] = [] if map[map_id].nil?
        map[map_id] << id if is_valid
      end

      info['maps'].each {|map_id, is_valid|
        map[map_id].sort
        map.delete map_id if map[map_id].empty?
      }

      map
    end

    items[@@NAMESPACE_KEY]['maps'] = struct
    items[@@NAMESPACE_KEY]['available_maps'] = struct.keys

    return items
  end

  #
  # Adds ['champion_unique'][id] = [list of items for only that champion]
  # Adds ['champion_unique']['all'] = [whole shebang]
  #
  # do a disjoint between this and the map listing before picking general items
  # in case you know Gangplank can't buy stuff for his ult, or they get a different thing
  # on a different map.

  def self.item_create_champion_unique_structure(items)
    champ_item_map = {}
    champ_items = []
    items['data'].each do |id, info|
      possible_id = info["requiredChampion"]

      if possible_id
        champ_item_map[possible_id] = [] unless champ_item_map[possible_id]
        champ_item_map[possible_id] << id
        champ_items << id
      end
    end

    champ_item_map['all'] = champ_items
    items[@@NAMESPACE_KEY]['champion_unique'] = champ_item_map

    return items
  end

  #
  # Modifies item_blob['groups'] into a single hash of 'group_id' => number_allowed
  #

  def self.item_sanitize_groups(items)
    items['groups'] = items['groups'].inject({}) do |mem, obj|
      mem[obj['id']] = obj["MaxGroupOwnable"].to_i
      mem
    end

    return items
  end

end