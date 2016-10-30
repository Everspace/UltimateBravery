require_relative './Utils'

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

    item_create_maps_structure items
    item_sanitize_groups items
    item_create_champion_unique_structure items
    return items
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