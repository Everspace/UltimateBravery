$LOAD_PATH.unshift File.expand_path('lib', File.dirname(__FILE__))

require 'Utils'
require 'lol/DataDragon'
require 'lol/ChampionJudge'
require 'lol/ItemJudge'
require 'lol/Tristana'

require 'rake/clean'
require 'pathname'

is_pretty = if ENV['pretty'] then true else false end
is_debug = if ENV['debug'] then true else false end

config_directory = File.expand_path(ENV['config_directory'] || './config')
output_directory = File.expand_path(ENV['output_directory'] || './build')
CLEAN << output_directory
CLOBBER << './temp'

node_dir = File.expand_path 'node'
dev_url = "http://localhost:9001/static/index.html"

#TODO: Handle being offline
all_languages = DataDragon.get_generic "cdn/languages.json"
all_realms = YAML::load_file("#{config_directory}/Realms.yaml")

task :default => :package

task :uglify_data do
  ENV['pretty'] = nil
  Rake::Task['dd:download:all'].invoke()
end

multitask :package => [:uglify_data, 'node:package'] do
  puts 'Copying artifacts around'
  cp_r "#{node_dir}/static/.", output_directory
  cp_r "#{node_dir}/build/.", output_directory
  puts 'Package should be complete'
end

#Push everything from /lib/tasks into approprate namespaces
Dir.glob('lib/tasks/**/*.rake').each do |full_path|
  path = File.dirname(full_path)
  filename = File.basename(full_path, '.*')
  paths = Pathname(path).each_filename.to_a
  
  namespace_path = (paths[2..-1] | [File.basename(filename)]).join(":")
  namespace namespace_path do
    load full_path
  end
end

namespace :dev do
  #Temp area for when doing dev work because webserver
  dev_json_dir = "#{node_dir}/static/json"
  CLEAN << dev_json_dir

  directory dev_json_dir do
    Rake::Task["dev:update:everything"].invoke()
  end

  desc "Prepares the local cache with the Dragontail so we're not jerks to the devs"
  task :init do
    latest_version = DataDragon.versions.first

    file_name = "dragontail-#{latest_version}.tgz"
    remote_file = "#{DataDragon.DDRAGON_URL}/cdn/#{file_name}"
    local_file = File.join('temp', file_name)
    if File.exist?(local_file)
      puts "Didn't have to download #{local_file}"
    else
      puts "Beginning lengthy download of: %s\n\tto:%s" % [remote_file, local_file]
      Utils.download_file(remote_file, local_file)
      puts "Finished downloading #{file_name}"
    end
    
    version_dir = File.join(DataDragon.CACHE_DIR, latest_version)
    if Dir.exist?(version_dir)
      puts "Skipping extraction of %s since %s exists already" % [file_name, version_dir]
    else
      puts "Extracting %s\n\tto:%s" % [file_name, DataDragon.CACHE_DIR]
      Utils.unpack(local_file, DataDragon.CACHE_DIR)
      puts "Finished #{file_name} extraction"
    end
  end

  desc "Update data for use in local development"
  task :update => 'update:everything'

  namespace :update do
    task :everything => ['dev:init'] do
      Rake::Task['dd:download:all'].invoke()
      cp_r "#{output_directory}/json", File.dirname(dev_json_dir)
    end

    all_languages.collect do |lang|
      task lang do
        Rake::Task["dev:update:languages"].invoke(lang)
      end
    end

    task :languages, [:language] do |t, args|
      args.with_defaults({language: 'en_US'})
      ENV['pretty'] = 'true'
      puts "Updating local server's '#{args[:language]}' data"
      case args[:language]
      when 'all'
        Rake::Task["dd:download:#{args[:language]}"].invoke()
        cp_r "#{output_directory}/json", File.dirname(dev_json_dir)
      else
        args[:language].split(' ').flatten.each do |lang|
          Rake::Task["dd:download:#{lang}"].invoke()
          cp_r "#{output_directory}/json/#{lang}", dev_json_dir
        end
      end
    end
  end

  case RUBY_PLATFORM.downcase
  when /win[0-9]+/, /i386-mingw32/
    desc "Run the dev webserver and pop open the website"
    multitask :start => ["#{node_dir}/node_modules", dev_json_dir] do
      system(win_invoke % 'npm start')
      system("START \"\" /B \"#{dev_url}\" ")
    end
  else
    #I don't know how this would work on *nixes
    raise NotImplementedException
  end

end
