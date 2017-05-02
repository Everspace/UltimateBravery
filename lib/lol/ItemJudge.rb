require 'lol/Judge'

class ItemJudge < Judge

  def default_config
    "./config/Item.yaml"
  end

  def process()
    init_result
    modify_data

    remove_bad_items
    groupify_items
    debug_namify_items if @debug
    #funally, add all the items that have been chosen (but don't overwrite what's already happened)
    @used_items.each {|item_id|
      @result['data'][item_id] = @base['data'][item_id] unless @result['data'][item_id]
    }

    prep_result_with_metadata

    return @result
  end

  def init_result()
    @result = {}
    @result['data'] = {}
    @result['group'] = {}

    #List of items yet to be evaluated
    @potential_items = @base['data'].keys
    #List of items that ARE evaluated to be NICE THINGS TO BE BRAVE WITH
    @used_items = []
    #List of icky things that we know are BUTTS and HORRIBLE.
    #Sourced from 'Rejected Properties' and 'Excluded IDs'
    @ignored_items = []
  end

  def debug_namify_items
    @result['group'].each do |_, list|
      list.map! {|id| namify id }.sort!
    end

    @result['zzzyet to do'] = @potential_items.map{|id| namify id}.sort
    @result['zzzgarbage']   = @ignored_items.map{|id| namify id}.sort
    @result['zzzgood shit'] = @used_items.map{|id| namify id}.sort
  end


  #################################################
  # Modifications
  #################################################

  def modify_data
    set_group_limits
    remove_items_from_maps
    rename_enchantables
  end

  ###
  ## Add the limits area for a list of item groups that we can't have more
  ## than 'n'-of, like 1 hydra item or 1 jungle item.
  def set_group_limits
    @result['limits'] = {}
    @config['Group'].each do |name, data|
      @result['limits'][name] = data['limit'] if data['limit']
    end
  end

  ###
  ## Kill certain items on certain maps.
  ##
  ## I'M LOOKING AT YOU MANAMUNE (QUICK CHARGE) ON SUMMONER'S RIFT!
  def remove_items_from_maps
    log "INFO: Removing certain items from certain maps"
    @config['Remove from Map'].each do |item_id, maps|
      log "#{namify item_id} removing from maps: #{maps}"
      @result['data'][item_id] = get_item(item_id).dup
      maps.each do |map|
        @result['data'][item_id]['maps'][map] = false
      end
    end
  end

  ###
  ## Turns stuff into something like 'Base Item -> Enchantment: Thingy'
  ## so you can search if you're not familiar with the basename.
  def rename_enchantables
    @config['Enchantables'].each do |item_id|
      get_item(item_id)['into'].each do |enchantment|
        result = combine_with_enchantment item_id, enchantment
        @result['data'][enchantment] = result
      end
    end
  end

  ###
  ## Adjust the enchantment's data based on the source item's data.
  ##
  ## Stuff like "name" in case you don't know what every item's name is.
  def combine_with_enchantment(source_item_id, enchantment_id)
    source_data = @base.dig('data', source_item_id)
    target_data = @base.dig('data', enchantment_id)

    r = target_data.dup
    #Nice name that states the build path too
    r['name'] = "#{source_data['name']} → #{target_data['name']}"
    #Hoist tags up to enchantment.
    r['tags'] = (source_data['tags'] + target_data['tags'].to_a).uniq

    #TODO: gold values and stuff?

    return r
  end


  #################################################
  # Filters
  #################################################

  def remove_bad_items()
    ignore_explicitly_removed_items
    ignore_item_with_rejected_property
    filter_items
  end

  ###
  ## Drop items that are specified in the config
  ##
  def ignore_explicitly_removed_items()
    log "INFO: Removing excplicity ignored items"
    @config['Excluded IDs'].each {|id| remove_item id}
  end

  ###
  ## Use the config to drop whole categories of items
  ## in a generic way
  def ignore_item_with_rejected_property()
    log "INFO:  Removing items with bad properties"
    # #Drop items that have groups or tags I think are stupid.
    @config['Rejected Properties'].each do |property_name, bad_things|
      log "INFO: Removing based on #{property_name}"
      @potential_items
        .inject({}) {|memory, item_id|
          #turn items into hash of "item_id => property to inspect"
          memory[item_id] = get_item(item_id)[property_name]
          memory
        }.select {|item_id, property|
          case property
          when Array
            #If it's an array type (like a list of tags) we don't want any
            #of the forbidden tags in our item's tags.
            not (property & bad_things).empty?
          when nil
            false #couldn't find the thing, so don't include it.
          else
            #If badthings is an arrayish thing
            if bad_things.respond_to? :include?
              bad_things.include? property
            else #just compare the two things god damn it
              bad_things == property
            end
          end
        }
        .each {|id, words|
          log "Because '#{namify id}' has #{property_name} #{words & bad_things}"
        }
        .keys
        .each {|id| remove_item id}
    end
  end

  ###
  ## Kill everything that doesn't meet our arbitrary criteria.
  ##
  def filter_items
    #dup to avoid modifying while traversing
    @potential_items.dup.each do |item_id|
      remove_item item_id unless item_approprate? item_id
    end

    @potential_items.dup.each do |item_id|
      add_item(item_id: item_id)
    end
  end

  #################################################
  # Grouping
  #################################################
  #NOTE: Grouping an item is also implicitly adding it

  ###
  ## Puts the items in the baskets or else it gets the hose again.
  ##
  ## Also takes stuff from the 'Group' config, and puts it
  ## in the 'group' and 'limit' subobject of the exported JSON.
  def groupify_items()
    group_explicit
    group_tagged
  end

  def group_explicit()
    @config['Group']
      .each {|group_name, data|
        next unless data['items']
        data['items'].each {|item_id|
          add_item(item_id: item_id, group: group_name)
        }
      }
  end

  def group_tagged()
    @config['Group']
      .each {|name, data|
        next unless data['tags']
        find_with_tags(*data['tags']).each {|item_id|
          add_item(item_id: item_id, group: name)
        }
      }
  end

  #################################################
  # Utils
  #################################################

  ###
  ## Convienience method for
  ##
  def add_item_id(item_id)
    add_item(item_id: item_id)
  end

  ###
  ## Adds an item to @result. Does checking for group and stuff too.
  ##
  def add_item(item_id:, group:nil, data:nil)
    item_data = data || get_item(item_id)
    raise "#{item_id} did not exist in the base data when we went to add it to results" unless item_data

    #Let's not re-add items
    unless item_already_processed? item_id
      @ignored_items.delete item_id
      @potential_items.delete item_id
      @used_items |= [item_id]
    end

    #Allow for data fanagaling if provided
    if data
      @result['data'][item_id] = data
    else
      #Add the base to the result, unless there's something already there
      @result['data'][item_id] = @base['data'][item_id] unless @result['data'][item_id]
    end

    #group-on, apply directly to result
    add_to_group(item_id, group) if group

    add_to_maps(item_id)
    add_to_champion_unique(item_id)
  end

  ##
  # Builds up the maps key for easy randomization.
  def add_to_maps(item_id)
    item = get_item(item_id)
    @result['map'] = {} unless @result.has_key? 'map'
    item['maps'].each do |map_id, is_valid|
      add_to_map(item_id, map_id) if is_valid
    end
  end

  ##
  # Checks null/empty and stuff before putting it into the map key
  def add_to_map(item_id, map_id)
    @result['map'] = {} unless @result.dig('map')
    @result['map'][map_id] = [] unless @result.dig('map', map_id)
    @result['map'][map_id] |= [item_id]
  end
  
  ##
  # Adds to a list of champion unique items. Will deal with them
  # on a champ by champ basis.
  def add_to_champion_unique(item_id)
    item = get_item(item_id)
    if item.has_key? ['requiredChampion']
      @result['championUnique'] = [] unless @result.dig('championUnique')
      @result['championUnique'] |= [item_id]      
    end
  end

  def add_to_group(item_id, group)
    #Let's keep a quick list of what IDs are part of what groups
    @result['group'][group] = [] unless @result['group'][group]
    @result['group'][group] |= [item_id]

    #and also add it to the item's properties for easy going backwards
    @result['data'][item_id]['groups'] = [] unless @result['data'][item_id]['groups']
    @result['data'][item_id]['groups'] |= [group]
  end

  ###
  ## Scours the item from the @result
  ##
  def remove_item(item_id)
    log "Removing #{namify item_id}"
    #I've deemed this item unworthy
    @potential_items.delete item_id
    @used_items.delete item_id
    @ignored_items |= [item_id]

    #You can not hide from me in the groups either
    ['group', 'map', 'championUnique'].each do |place|
      @result[place].each {|_, list| list.delete item_id} if @result.has_key? place
    end

    #And your data is worthless.
    @result['data'].delete item_id
  end

  ###
  ## Turns ID into name.
  ##
  def namify(id)
    item = get_item(id)
    raise "#{id} doesn't exist?" unless item
    n = get_item(id)['name'] || "#{id} is nameless?!"
    "#{n} (#{id})"
  end

  #################################################
  # Item testers
  #################################################

  def item_approprate?(item_id)
    if item_has_a_valid_map(item_id) && all_item_builds_valid?(item_id)
      return item_end_of_build?(item_id)
    else
      return false
    end
  end

  def item_has_a_valid_map(item_id)
    has_a_map = get_item(item_id)['maps']
    .values
    .inject(false) {|mem, is_valid| mem || is_valid}
    unless has_a_map
      log "#{namify item_id} isn't valid on any map!"
      return false
    else
      return true
    end
  end

  def item_already_processed?(item_id)
    return (@used_items + @ignored_items).include? item_id
  end

  ###
  ## If it's at the end of it's build, it's ok
  ##
  def item_end_of_build?(item_id)
    item = get_item(item_id)
    #If this turns into something, then this is the end of the line
    return true unless item['into']
    return true if item['into'].empty?
    item['into'].each do |possible_id|
      if item_is_from_transforming? possible_id
        return true
      else
        return false
      end
    end
    #into is empty or something
    return true
  end

  def all_item_builds_valid?(item_id)
    item = get_item(item_id)
    return true unless item['into'] #No build paths is vaild?
    item['into'].each do |possible_id|
      #Move along if we've deleted this item already
      return false if @ignored_items.include? possible_id
      #usually if 1 is swappable everything is just peechy-keen
      return true if item_is_swappable?(item_id, possible_id)
    end
  end

  ###
  ## Find out if this is Muramana
  ##
  def item_is_from_transforming?(item_id)
    item = get_item(item_id)
    return false unless item #garbage items
    return true unless item.dig('gold', 'purchasable')
  end

  ###
  ## If this thing can swap between for instance, Titanic and Ravenous Hydra,
  ## or all the different shoes, it's fine.
  ##
  ## There aren't any items that aren't "the end of the line" that are swappable.
  def item_is_swappable?(item_id, possible_id)
    other_item = get_item(possible_id)
    return false unless other_item #Item is dead
    return false unless other_item['into'] #Item doesn't go into stuff
    return false if other_item['into'].empty?
    return other_item['into'].include? item_id
  end

  ###
  ## Returns a list of item ids that match the list of tags given 
  ##
  def find_with_tags(*tags)
    return tags if tags.to_a.empty?
    items = all_data.keys - @ignored_items
    items.keep_if {|item_id| not (get_item(item_id)['tags'] & tags).empty?}
    return items
  end

  ###
  ## Gets an item by ID, looking at result first then base.
  ##
  def get_item(id)
    return @result.dig('data', id) || @base.dig('data', id)
  end

  ###
  ## Provides a "complete" object by combining @result and @base.
  ##
  def all_data
    @base['data'].merge @result['data']
  end
end
