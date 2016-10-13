class Tristana

  @@UPDATEABLE_THINGS = [
    :LanguageConverters,
    :Items,
    :Champions,
    :SummonerSpells,
    :Masteries
  ]

  @@DATA_REQUEST_STRING = '{0}/{1}/data/{2}/{3}.json'

  @realmData = {}
  @language = 'en_US'
  @options = {}

  def initialize(language, realmData, options)

  end

  def getChampions()
    groomed_data = {}

    url = DATA_REQUEST_STRING.format(cdn, ddver, lang, 'champion')
    base_all_champs = request(url)

    groomed_data = {}

    q = Queue.new(base_all_champs[:data].keys)
    threads = (0..4).each do
      Thread.new do
        while champ = q.pop(false)
          url = DATA_REQUEST_STRING(cdn, ddver, lang, "champions/#{champ}")
          data = base_all_champs[:data][champ] + request(url)[:data]
          groomed_data[champ] = groom(@@GROOMING_DICTIONARIES[:Champions], data)
        end
      end
    end
  end

  def request(url)
    JSON.parse(
      Httparty.request(url)
    )
  end

  def write(dict, path)
    Dir.mkdir_f File.oppositeOfBaseName path
    File.open(path, "w") { |file|
      file.puts JSON.dump(dict)
    }
    return path
  end

end