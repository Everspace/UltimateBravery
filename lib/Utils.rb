require 'fileutils'
require 'rubygems/package'
require 'zlib'
require 'net/http'
require 'ruby-progressbar'

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
            File.open(out_path, "wb") do |file|
              file.puts entry.read
            end
          end
        end
      ensure
        tar_extract.close
      end
    else
      raise NotImplementedException
    end
  end

  def self.download_file(url, dest_name)
    uri = URI(url)
    opts = {
      use_ssl: uri.scheme == 'https',
      verify_mode: OpenSSL::SSL::VERIFY_NONE
    }
    Net::HTTP.start(uri.host, uri.port, **opts) do |http|
      request = Net::HTTP::Get.new uri

      http.request request do |response|
        size = response['content-length'].to_i
        bar = ProgressBar.create(
          title: File.basename(dest_name),
          total: size,
          format: '%j%% %t %e |%B|'
        )

        begin
          open dest_name, 'wb' do |file|
            response.read_body do |chunk|
              file.write chunk
              bar.progress  += chunk.size
            end
          end
        ensure
          filesize = File.stat(dest_name).size
          if filesize != size
            puts "File download of #{dest_name}"
            puts " was a different size: #{filesize}"
            puts " than expected:        #{size}"
            puts " so deleting it because it's probably bogus"
            FileUtils.rm dest_name
            raise "File failed to download"
          end
        end
      end
    end
  end

  def self.dump(dict, name)
    File.open("_dump_#{name}.yaml", 'w') do |f|
      f.write dict.to_yaml
    end
  end
end
