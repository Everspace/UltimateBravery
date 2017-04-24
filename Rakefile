$LOAD_PATH.unshift File.expand_path('lib', File.dirname(__FILE__))

require 'Utils'
require 'lol/DataDragon'
require 'lol/ChampionJudge'
require 'lol/ItemJudge'
require 'lol/Tristana'

require 'rake/clean'
require 'pathname'

$is_pretty = if ENV['pretty'] then true else false end
$is_debug = if ENV['debug'] then true else false end

$config_directory = File.expand_path(ENV['config_directory'] || './config')
$output_directory = File.expand_path(ENV['output_directory'] || './build')
CLEAN << $output_directory
CLOBBER << './temp'

$node_dir = File.expand_path 'node'
$dev_url = "http://localhost:9001/"
$all_realms = YAML::load_file("#{$config_directory}/Realms.yaml")
$all_languages = DataDragon.get_generic "cdn/languages.json"

task :default => :package

task :uglify_data do
  ENV['pretty'] = nil
  Rake::Task['dd:download:all'].invoke()
end

desc "Gets everything needed to deploy in the output_directory"
multitask :package => [:uglify_data, 'node:package'] do
  puts 'Copying artifacts around'
  cp_r "#{$node_dir}/build/.", $output_directory
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
