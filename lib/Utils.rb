require 'fileutils'
require 'rubygems/package'
require 'zlib'
require 'httparty'

class Utils
  def self.write(dict, path, pretty = false)
    FileUtils.mkdir_p File.dirname(path)
    File.open(path, "w") do |file|
      text = if pretty then JSON.pretty_generate(dict) else JSON.dump(dict) end
      file.puts text
    end
  end

  def self.unpack(file, dest)
    case File.basename(file)
    when /.tgz$/, /.tar.gz$/
      begin
        tar_extract = Gem::Package::TarReader.new(
          Zlib::GzipReader.open(file)
        )
        tar_extract.each do |entry|
          if entry.file?
            out_path = File.join(dest, entry.full_name[2..-1]) #drop ./
            FileUtils.mkdir_p File.dirname(out_path)
            File.open(out_path, "w") do |file|
              file.puts entry.read
            end
          end
        end
      ensure
        tar_extract.close
      end
    default
      raise NotImplementedException
    end
  end

  def self.download_file(url, dest_name)
    File.open(dest_name, "wb") do |file|
      file.puts HttpParty.get(url).body
    end
  end

  def self.dump(dict, name)
    File.open("_dump_#{name}.yaml", 'w') do |f|
      f.write dict.to_yaml
    end
  end
end

require 'fileutils'