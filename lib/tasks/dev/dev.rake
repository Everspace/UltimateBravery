#Temp area for when doing dev work because webserver
CLEAN << "#{$node_dir}/static/json"

directory "#{$node_dir}/static/json" do
  Rake::Task["dev:update:everything"].invoke()
end

desc "Prepares the local cache (BIG DOWNLOAD)"
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

desc "Populates en_US and starts dev server"
task :start => ["dev:update:languages", "node:start"]
