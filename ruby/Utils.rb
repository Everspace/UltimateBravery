require 'fileutils'
class Utils
  def self.write(dict, path, pretty = false)
    FileUtils.mkdir_p File.dirname(path)
    File.open(path, "w") do |file|
      text = if pretty then JSON.pretty_generate(dict) else JSON.dump(dict) end
      file.puts text
    end
  end

  def self.dump(dict, name)
    File.open("#{name}.yaml", 'w') do |f|
      f.write dict.to_yaml
    end
  end
end