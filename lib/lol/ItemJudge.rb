require 'lol/Judge'

class ItemJudge < Judge

  def default_config
    puts "config from ItemJudge?"
    "./config/Item.yaml"
  end

  def process()
    init_result
    modify_data

    remove_bad_items
    #groupify_items
    debug_namify_items
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
    puts @config['Remove from Map']
    @config['Remove from Map'].each do |item_id, maps|
      puts "#{namify item_id} has bad map_ids"
      puts maps
      @result['data'][item_id] = get_item(item_id).dup
      puts @result['data'].keys.to_s
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
    r['tags'] = (source_data['tags'] + ['target_data']).uniq

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
    puts "*Removing excplicity ignored items"
    @config['Excluded IDs'].each {|id| remove_item id}
  end

  ###
  ## Use the config to drop whole categories of items
  ## in a generic way
  def ignore_item_with_rejected_property()
    puts "* Removing items with bad properties"
    # #Drop items that have groups or tags I think are stupid.
    @config['Rejected Properties'].each do |property_name, bad_things|
      puts "- Removing based on #{property_name}"
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
          puts "Because '#{namify id}' has #{property_name} #{words & bad_things}"
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
  ## Specifically takes stuff from the 'Group' config, and puts it
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
  def add_item(item_id)
    add_item(item_id: item_id)
  end

  ###
  ## Adds an item to @result. Does checking for group and stuff too.
  ##
  def add_item(item_id:, group:nil, data:nil)
    #Let's be horribly biased to ignoring items
    return nil if item_already_processed? item_id

    item_data = data || get_item(item_id)
    raise "#{item_id} did not exist in the base data when we went to add it to results" unless item_data
    @result['data'][item_id] = data if data

    @ignored_items.delete item_id
    @potential_items.delete item_id
    @used_items << item_id

    if group then
      @result['group'][group] = [] unless @result['group'][group]
      @result['group'][group] << item_id
    end
  end

  ###
  ## Scours the item from the @result
  ##
  def remove_item(item_id)
    puts "Removing #{namify item_id}"
    #I've deemed this item unworthy
    @potential_items.delete item_id
    @used_items.delete item_id
    @ignored_items << item_id

    #You can not hide from me in the groups either
    @result['group'].each {|_, list| list.delete item_id}

    #And your data is worthless.
    @result['data'].delete item_id
  end

  ###
  ## Turns ID into name.
  ##
  def namify(id)
    n = get_item(id)['name'] || "#{id} is nameless?!"
    "#{n} (#{id})"
  end

  #################################################
  # Item testers
  #################################################

  def item_approprate?(item_id)
    if all_item_builds_valid?(item_id)
      return item_end_of_build?(item_id)
    else
      return false
    end
  end

  def item_already_processed?(item_id)
    return (@used_items + @ignored_items).include? item_id
  end

  ###
  ## If it's at the end of it's build, it's ok
  ##
  def item_end_of_build?(item_id)
    #If this turns into something, then this is the end of the line
    return true unless get_item(item_id)['into']
    return true if get_item(item_id)['into'].empty?
    get_item(item_id)['into'].each do |possible_id|
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
    get_item(item_id)['into'].each do |possible_id|
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
    return false unless get_item(item_id) #garbage items
    return true unless get_item(item_id).dig('gold', 'purchasable')
  end

  ###
  ## If this thing can swap between for instance, Titanic and Ravenous Hydra,
  ## or all the different shoes, it's fine.
  ##
  ## There aren't any items that aren't "the end of the line" that are swappable.
  def item_is_swappable?(item_id, possible_id)
    other_item = get_item(possible_id)
    return false unless other_item #Item is dead
    return false if other_item['into'].empty?
    return other_item['into'].include? item_id
  end

























  # def self.item_remove_unpurchasables(items)
  #   items['data'].reject!{|id, info| not info.dig('gold', 'purchasable') }
  # end

  #################################################
  # Item queries
  #################################################

  def find_with_tags(*tags)
    return tags if tags.to_a.empty?
    items = all_data.keys - @ignored_items
    items.keep_if {|item_id| not (get_item(item_id)['tags'] & tags).empty?}
    return items
  end

  def get_item(id)
    return @result.dig('data', id) || @base.dig('data', id)
  end

  def all_data
    @base['data'].merge @result['data']
  end

end