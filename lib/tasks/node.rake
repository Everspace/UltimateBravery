CLEAN << "#{$node_dir}/build"
CLOBBER << "#{$node_dir}/node_modules"

def run_node(call, logfile)
  CLEAN << logfile
  puts "Starting '#{call}'"
  success = system(
    call,
    [:err, :out]=>logfile,
    chdir: $node_dir
  )
  puts File.read(logfile)
  raise "ERROR: #{call} failed" unless success
  puts "Finished: '#{call}'"
end

directory "#{$node_dir}/node_modules" do |t|
  puts "node_modules missing, running npm install"
  run_node("npm install --progress=false", "npm_install.log")
end

task :build => ["#{$node_dir}/node_modules"] do
  rm_f "#{$node_dir}/build/"
  CLEAN << 'node.log'
  run_node("npm run build", "node.log")
end

task :package => [:build] do 
  assets = FileList["#{$node_dir}/static", "#{$node_dir}/static/**/*"]
  cp_r "#{$node_dir}/static/.", "#{$node_dir}/build"
end

desc "Run the dev webserver"
multitask :start => ["#{$node_dir}/node_modules", "#{$node_dir}/static/json"] do
  case RUBY_PLATFORM.downcase
  when /win[0-9]+/, /i386-mingw32/
    #In windows we can start a new window and it's great
    call = "START /I npm run start"
  else
    #I don't know how this would work on *nixes
    call = "npm run start"
  end

  system(
    call,
    [:err, :out]=>:out,
    chdir: $node_dir
  )
end