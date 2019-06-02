require 'lol/judges/JudgeBase'

class SummonerSpellJudge < JudgeBase
  MANAGES = :summonerSpells

  def default_config
    "./config/SummonerSpells.yaml"
  end

  def process()
    @result = {}
    @result['data'] = @base['data'].clone
    modify
    prep_result_with_metadata
    return @result
  end

  def modify
    to_remove = []
    @result['map'] = {}
    @result['data'].each do |spell_key, spell_info|
      all_maps = spell_info['modes']
        .collect {|mode| @config['Mode to Map'][mode]}
        .compact
        .uniq
      unless all_maps.empty?
        all_maps.each do |map_id|
          @result['map'][map_id] = [] if @result['map'][map_id].nil?
          @result['map'][map_id] << spell_key
        end
      else
        to_remove << spell_key
      end
    end

    to_remove.each {|map_id| @result['data'].delete map_id}
  end

end
