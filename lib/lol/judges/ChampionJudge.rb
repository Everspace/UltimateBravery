require 'lol/judges/JudgeBase'

class ChampionJudge < JudgeBase
  MANAGES = :champions

  def default_config
    "./config/Champions.yaml"
  end

  def process()
    init_result

    @result['allChampions'] = @base['data'].keys

    add_groups
    determine_meleeness

    prep_result_with_metadata
    return @result
  end

  def init_result()
    @result = {}
    @result['data'] = {}
    @result['data'] = @base['data']
  end

  #Adds the following:
  #An isGroup property to the champion
  #a 'groups' proprety that lists the champions that are X and Y
  def add_groups()
    @result['groups'] = {}

    @result['allChampions'].each do |champ|
      groups = @config.dig(champ, 'group')
      next unless groups

      groups.each do |group|
        @result['data'][champ]["is#{group.capitalize}"] = true;
        @result['groups'][group] = [] unless @result['groups'][group]
        @result['groups'][group] |= [champ]
      end
    end
  end

  def determine_meleeness

    @result['allChampions'].each do |champ|
      attackrange =  @base['data'][champ]['stats']['attackrange']
      the_max = @config['General']['Max Melee Range']

      raise "'General:Max Melee Range' has to be in config" unless the_max

      @result['groups']['melee'] = [] unless @result['groups']['melee']
      @result['groups']['range'] = [] unless @result['groups']['range']

      #Here we only set the result to "true" because we may
      #have added the particular champ to the other if
      #they're able to switch (Nidlee/Elise)
      if attackrange <= the_max
        @result['data'][champ]["isMelee"] = true
        @result['groups']['melee'] |= [champ]
      else
        @result['data'][champ]["isRange"] = true
        @result['groups']['range'] |= [champ]
      end
    end

  end


end
