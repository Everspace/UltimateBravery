task :everything => ['dev:init'] do
  Rake::Task['dd:download:all'].invoke()
  cp_r "#{$output_directory}/json", File.dirname("#{$node_dir}/static/json")
end

$all_languages.collect do |lang|
  task lang do
    Rake::Task["dev:update:languages"].invoke(lang)
  end
end

task :languages, [:language] => ['dev:init'] do |t, args|
  args.with_defaults({language: 'en_US'})
  ENV['pretty'] = 'true'
  puts "Updating local server's '#{args[:language]}' data"
  case args[:language]
  when 'all'
    Rake::Task["dd:download:#{args[:language]}"].invoke()
    cp_r "#{$output_directory}/json", File.dirname("#{$node_dir}/static/json")
  else
    args[:language].split(' ').flatten.each do |lang|
      Rake::Task["dd:download:#{lang}"].invoke()
      cp_r "#{$output_directory}/json/#{lang}", "#{$node_dir}/static/json"
    end
  end
end