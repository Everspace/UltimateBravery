class JudgeBase
  @base = {}
  @result = {}
  @config = nil
  @debug = false

  ###
  ## Matches the "Tristana::CONFIGURABLE_THINGS" that this corrisponds to.
  MANAGES = nil

  ###
  ## Location for config for type of Judge.
  ##
  ## Change for each subclass
  def default_config
    nil
  end

  ###
  ##
  ##
  ##
  class << self
    def manages
      nil
    end
  end


  #Discard text if not debug
  def log(*things)
    puts things.join(' ') if @debug
  end

  def initialize(data_blob, config:nil, debug:false)
    @debug = debug
    @base = data_blob.dup.freeze
    @config = YAML::load_file(config || default_config)
  end

	def process()
    raise NotImplementedExecption
  end

  def prep_result_with_metadata
    ['type', 'version'].each {|attribute|
      @result[attribute] = @base[attribute]
    }
  end
end