task :everything => ['dev:init'] do
  Rake::Task['dd:download:all'].invoke()
  cp_r "#{$output_dir}/json", File.dirname("#{$node_dir}/static/json")
end

$all_languages.collect do |lang|
  task lang do
    Rake::Task["dev:update:languages"].invoke(lang)
  end
end

task :languages, [:language] => ['dev:init'] do |t, args|
  args.with_defaults({language: 'en_US'})

  $is_pretty = true

  copy_opts = {
    remove_destination: true,
    verbose: true
  }

  puts "Updating local server's '#{args[:language]}' data"

  source = "#{$output_dir}/json"
  target = "#{$node_dir}/static/json"

  case args[:language]
  when 'all'
    Rake::Task["dd:download:#{args[:language]}"].invoke()
    cp_r target, File.dirname(target), **copy_opts
  else
    args[:language].split(' ').flatten.each do |lang|
      Rake::Task["dd:download:#{lang}"].invoke()
      cp_r "#{source}/#{lang}", target, **copy_opts
    end
  end
end
