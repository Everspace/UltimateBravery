##
# Handles taking a prior specification of data
# and 'grooms' incoming dictionaries to only
# have the keys specified.
#
# Saves a lot of space/bandwidth especially for things we don't care
# about like lore, or spell burndowns.
class Groomer

  @grooming_dictionary = {}

  def initialize(file = './Grooming.yaml')
    load_dictionary_file file
  end

  def load_dictionary_file(file)
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
    @grooming_dictionary = dict
  end

  ##
  # Takes a DataDragon blob and grooms it's ['data'] key, which is
  # what we want to do 99% of the time
  def groom_blob(datadragon_blob)
    data_compilation = datadragon_blob.dup

    #unpack the data we care about from the goop
    data = datadragon_blob['data']
    type = datadragon_blob['type']

    data.each do |key, value|
      case value
      when Hash #recurse down
        data_compilation['data'][key] = groom(value, @grooming_dictionary[type])
      else
        data_compilation['data'][key] = value if @grooming_dictionary[type].has_key? key
      end
    end

    return data_compilation
  end

  def groom(source_hash, allowed_hash)
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
            temp_array << groom(item, allowed_hash[key])
          end
          final_hash[key] = temp_array
        else #the source_hash[key] is a hash as well
          #so groom it as well before adding
          final_hash[key] = groom(source_hash[key], allowed_hash[key])
        end
      else
        final_hash[key] = source_hash[key]
      end
    end

    #got to the end without recursing!!
    return final_hash
  end
end