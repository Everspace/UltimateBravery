$LOAD_PATH.unshift File.expand_path('lib', File.dirname(__FILE__))

require 'Utils'
require 'lol/DataDragon'
#require 'lol/Doran'
require 'lol/ChampionJudge'
require 'lol/ItemJudge'
require 'lol/Tristana'

require 'benchmark'
require 'rake/clean'

is_pretty = if ENV['pretty'] then true else false end
is_debug = if ENV['debug'] then true else false end

config_directory = File.expand_path(ENV['config_directory'] || './config')
output_directory = File.expand_path(ENV['output_directory'] || './build')
CLEAN << output_directory

node_dir = File.expand_path 'node'
# - starting in the directory NODE_DIR
# - passing our current environment to it
# - staying until it stops,
win_invoke = "START \"ULTIMATE %1$s\" /D \"#{node_dir}\" /I /WAIT %1$s"

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

namespace :aws do
  task :upload => ['package'] do
    puts 'Pushing to AWS bucket'
  end
end

namespace :node do
  CLOBBER << "#{node_dir}/node_modules"

  #Note that we have to do run npm in a seperate process
  #lest other tasks blow up if we just cd'ed into the directory

  directory "#{node_dir}/node_modules" do |t|
    puts "node_modules missing, running npm install"

    case RUBY_PLATFORM.downcase
    when /win[0-9+]/, /i386-mingw32/
      #make a window named npm, passing our current environment to it
      #staying until it stops, starting in the directory NODE_DIR
      system("#{win_invoke % 'npm'} install --progress=false")
    else
      raise NotImplementedException
    end
  end

  task :build => ["#{node_dir}/node_modules"] do

    case RUBY_PLATFORM.downcase
    when /win[0-9+]/, /i386-mingw32/
      system("#{win_invoke % 'npm'} run build")
    else
      raise NotImplementedException
    end
  end

  assets = FileList["#{node_dir}/static", "#{node_dir}/static/**/*"]

  task :package => ["^clean", :build]
end

namespace :dd do
  namespace :download do

    all_tasks = []

    task "versions" do
      puts "Downloading versions.json"
      Utils.write(
        DataDragon.get_generic("api/versions.json"),
        "#{output_directory}/json/versions.json",
        if ENV['pretty'] then true else false end
      )
      puts "Finished downloading versions.json"
    end
    all_tasks << "versions"

    #Actual language data
    download_all_languages = all_languages.collect do |lang|
      things_to_do = []

      things_to_update = Tristana.UPDATEABLE_THINGS.collect do |thing|

        task "#{lang}:#{thing}" do |t|

          puts "Updating #{lang}:#{thing}"
          #Fire up a tristana
          trist = Tristana.new language: lang, realm: (ENV['realm'] || 'NA')
          #Get the blob
          blob = trist.send("get_#{thing}".to_sym)
          #Hire the judge
          judger = case thing
                  when :champions
                    ChampionJudge
                  when :items
                    ItemJudge
                  end

          Utils.dump(blob, '_RawBlob') if is_debug
          blob = judger.new(blob, debug: is_debug).process if judger
          Utils.dump(blob, '_JudgedBlob') if is_debug

          Utils.write(
            trist.groomer.groom_blob(blob),
            "#{output_directory}/json/#{lang}/#{thing}.json",
            is_pretty
          )

          puts "Finished updating #{lang}:#{thing}"
        end

        "#{lang}:#{thing}"
      end

      multitask "#{lang}" => things_to_update do
        puts "Finished updating all of #{lang}"
      end

      "#{lang}"
    end
    all_tasks |= download_all_languages

    download_all_realms = all_realms.collect do |realm|
      task "realm:#{realm}" do |t|
        puts "Downloading realm #{realm}"
        Utils.write(
          DataDragon.cache_realm_info(realm),
          "#{output_directory}/json/realm_#{realm.downcase}.json",
          if ENV['pretty'] then true else false end
        )
        puts "Finished downloading realm #{realm}"
      end

      "realm:#{realm}"
    end
    all_tasks |= download_all_realms

    desc "download everything from data dragon"
    multitask "all" => all_tasks do
      puts "Finished updating all the DataDragon!"
    end
  end
end

namespace :dev do
  #Temp area for when doing dev work because webserver
  dev_json_dir = "#{node_dir}/static/json"
  CLEAN << dev_json_dir

  directory dev_json_dir do
    Rake::Task["dev:update:everything"].invoke()
  end

  desc "Update data for use in local development"
  task :update => 'update:everything'

  namespace :update do
    task :everything do
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