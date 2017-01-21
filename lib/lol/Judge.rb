class Judge
  @base = {}
  @result = {}
  @config = nil

  ###
  ## Location for config for type of Judge.
  ##
  ## Change for each subclass
  def default_config
    nil
  end

  def initialize(data_blob, config=nil)
    @base = data_blob.dup.freeze
    puts @default_config
    @config = YAML::load_file(config || default_config)
  end

	def process()
    raise NotImplementedExecption
  end
end
