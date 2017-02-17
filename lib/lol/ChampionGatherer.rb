class ChampionGatherer

  #Mooshes the "All champion" data with the
  #individual champion data to get complete data
  def gather_champions()
    data_dragon = DataDragon.new(realm, language)

    #We grab the 'all champion' json just to get
    #the names of all champions, and then get the specifics
    #afterwards
    champ_data = data_dragon.get('champion')

    #data =
    ThreadParty.new do
      ProcessQueue do
        queue base_champ_data['data'].keys
        perform do |champ_id|
          data_dragon.get("champion/#{champ_id}")
        end
      end
    end.iteratively.reduce do |compiled, blob|
      data_compiled = compiled['data']
      data_blob = blob['data']
      compiled['data'] = data_compiled.merge data_blob
      compiled
    end
    #return data
  end

  #Appends new data to a champion based on their attrubtes.
  def add_attributes(champion_data)

    champion_data = add_explicit_config_attributes champ_data
  end

  #==================================
  #methods for adding new attributes
  #==================================

  def add_


  def add_explicit_config_attributes(champion_data)
  end



end
