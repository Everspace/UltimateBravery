require 'lol/judges/JudgeBase'

class MapJudge < JudgeBase
  MANAGES = :maps

  def default_config
    "./config/Maps.yaml"
  end

  def namify(id)
    @base['data'][id]['MapName']
  end

  def process()
    @result = {}
    @result['data'] = {}
    @base['data'].each do |mapID, mapInfo|
      @result['data'][mapID] = mapInfo unless @config['Maps to drop'].include? mapID
    end

    @result['allMaps'] = @result['data'].keys
      .sort {|a,b| namify(a) <=> namify(b) } #Sort maps by "name" for the language in particular

    @result['defaultMap'] = @config['Default Map']

    prep_result_with_metadata

    return @result
  end

end
