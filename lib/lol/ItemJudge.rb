require 'lol/Judge'

class ItemJudge < Judge

  def default_config
    puts "config from ItemJudge?"
    "./config/Item.yaml"
  end

  def process()
    init_result
    remove_bad_items
    groupify_items
    modify_data
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

    @result['_yet to do'] = @potential_items.map{|id| namify id}.sort
    @result['_garbage'] = @ignored_items.map{|id| namify id}.sort
    @result['_good shit'] = @used_items.map{|id| namify id}.sort
  end

  def modify_data
    #todo
  end

  def apply_group_info()
    @config['Group'].each do |name, data|
      @result['limits'][name] = data['limit'] if data['limit']
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
    group_enchantables
  end

  def group_explicit()
    @config['Group']
      .select {|group_name, data| data['items']}
      .each {|group_name, data|
        data['items'].each{|item_id|
          add_item(item_id: item_id, group: group_name)
        }
      }
  end

  def group_tagged()
    @config['Group']
      .select {|name, data| data['tags']}
      .each {|name, data|
        find_with_tags(*data['tags']).each{|item_id|
          add_item(item_id: item_id, group: name)
        }
      }
  end

  ###
  ## The enchantments typically don't have the stuff we typically look for,
  ## so we have to climb up from the base jungle/boot items.
  ## removing the ignored_items plus the selection of only end of build stuff from the to should
  ## grab only the enchantments
  def group_enchantables()
    @config['Group']
      .select {|name, data| data['enchantable']}
      .each {|name, data|
        perhaps_these = find_with_tags(*data['tags'])
        raise "The group \"#{name}\"'s tags did not result in items" if perhaps_these.empty?

        (perhaps_these - @ignored_items)
          .each {|base_item_id|
            @base.dig('data', base_item_id, 'into')
              .select {|id| item_end_of_build? id}
              .each {|enchantment_id|
                add_item(
                  item_id: enchantment_id,
                  group: name,
                  data: combine_with_enchantment(base_item_id, enchantment_id)
                )
              }
            remove_item base_item_id
        }
      }
  end

  #################################################
  # Filters
  #################################################

  def remove_bad_items()
    ignore_explicitly_removed_items
    ignore_item_with_rejected_property
  end

  def ignore_explicitly_removed_items()
    puts "*Removing excplicity ignored items"
    @config['Excluded IDs'].each {|id| remove_item id}
  end

  def ignore_item_with_rejected_property()
    puts "* Removing items with bad properties"
    # #Drop items that have groups or tags I think are stupid.
    @config['Rejected Properties'].each do |property_name, bad_things|
      puts "!- Removing based on #{property_name}"
      @potential_items
        .inject({}) {|memory, item_id|
          #turn items into hash of "item_id => property to inspect"
          memory[item_id] = @base.dig('data', item_id, property_name)
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
            bad_things.include? property
          end
        }
        .each {|id, words|
          puts "#{namify id} => #{words}"
        }
        .keys
        .each {|id| remove_item id}
    end
  end

  #################################################
  # Utils
  #################################################

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
    item_data = data || @base.dig('data', item_id)
    raise "#{item_id} did not exist in the base data when we went to add it to results" unless item_data
    @result['data'][item_id] = data if data

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
    @ignored_items << item_id

    #You can not hide from me in the groups either
    @result['group'].each {|_, list| list.delete item_id}

    #And your data is worthless.
    @result['data'].delete item_id
  end

  ###
  ##
  ##
  def namify(id)
    @result.dig('data', id, 'name') || @base.dig('data', id, 'name') || "wtf?!"
  end

  #################################################
  # Item testers
  #################################################

  def item_approprate?(item_id)
    #doesn't have an into, so doesn't build into anything
    return true if item_end_of_build? item_id
    return true if all_item_builds_valid?
  end

  def item_already_processed?(item_id)
    return (@used_items + @ignored_items).include? item_id
  end

  def item_end_of_build?(item_id)
    return true if @base.dig('data', item_id, 'into').empty?
  end



  # def self.item_remove_unpurchasables(items)
  #   items['data'].reject!{|id, info| not info.dig('gold', 'purchasable') }
  # end

  #################################################
  # Item queries
  #################################################

  def find_with_tags(*tags)
    return tags if tags.to_a.empty?
    items = @base['data'].keys - @ignored_items
    items.keep_if {|item_id| not (@base['data'][item_id]['tags'] & tags).empty?}
    return items
  end

end