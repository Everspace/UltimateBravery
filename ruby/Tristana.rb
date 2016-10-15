require_relative './lol/DataDragon'
require 'yaml'
require 'threadparty'

class Tristana

  @@UPDATEABLE_THINGS = [
    :LanguageConverters,
    :Items,
    :Champions,
    :SummonerSpells,
    :Masteries
  ]

  @realm_info = {}

  def initialize()
    @realm_info = DataDragon.get_realm_info
  end

  def self.grooming_dictionary(file:'./Grooming.yaml')
    dict = YAML::load_file(file)

    #substitute "spell" or "image" placeholders
    #for other keys. I really hope this doesn't get
    #super recursive at some point in the future
    dict.each do |category, grooming_dictionary|
      grooming_dictionary.each do |key, value|
        if dict.has_key? value
          dict[category][key] = dict[value]
        end
      end
    end
    return dict
  end

  def get_champions()
    groomed_data = {}
    p 'Getting champions'
    dd_options = {realm_info: @realm_info}

    ThreadParty.new do
      ProcessQueue do
        queue ['en_US'] #YAML::load_file('./Languages.yaml')
        perform do |lang|
          o = dd_options.merge({language: lang})
          dd = DataDragon.new(**o)

          #We grab the 'all champion' json just to get
          #the names of all champions, and then get the specifics
          #afterwards
          base_champ_data = dd.get('champion')

          champ_data = ThreadParty.new do
            ProcessQueue do
              queue base_champ_data['data'].keys
              perform do |champ_id|
                Tristana.groom_blob dd.get("champion/#{champ_id}")
              end
            end
          end

          data = Tristana.mergify champ_data.iteratively

          {lang => data}
        end
      end
    end.iteratively
  end

  def self.mergify(raw_blobs)
    data_compilation = raw_blobs.first
    raw_blobs.each do |blob|
      data_compilation['data'] = data_compilation['data'].merge! blob['data']
    end
    return data_compilation
  end

  def self.groom_blob(datadragon_blob)
    data_compilation = datadragon_blob.dup

    #unpack the data we care about from the goop
    data = datadragon_blob['data']
    type = datadragon_blob['type']

    data.each do |key, values|
      data_compilation['data'][key] = Tristana.groom values, Tristana.grooming_dictionary[type]
    end

    return data_compilation
  end

  def self.groom(source_hash, allowed_hash)
    final_hash = {}

    allowed_hash.keys.each do |key|
      next unless source_hash.has_key? key
      case allowed_hash[key]
      when Hash #if the allowed_hash is a complex type..
        case source_hash[key]
        when Array #if the source_hash is a array of things...
          #we need to iterate and groom each item in array
          temp_array = Array.new
          source_hash[key].each do |item|
            temp_array << Tristana.groom(item, allowed_hash[key])
          end
          final_hash[key] = temp_array
        else #the source_hash[key] is a hash as well
          #so groom it as well before adding
          final_hash[key] = Tristana.groom(source_hash[key], allowed_hash[key])
        end
      else
        final_hash[key] = source_hash[key]
      end
    end

    #got to the end without recursing!!
    return final_hash
  end

  def write(dict, path)
    Dir.mkdir_f File.oppositeOfBaseName path
    File.open(path, "w") do |file|
      file.puts JSON.dump(dict)
    end
  end

  def self.dump(dict, name)
    File.open("#{name}.yaml", 'w') do |f|
      f.write dict.to_yaml
    end
  end
end
