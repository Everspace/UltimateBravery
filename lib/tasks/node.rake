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
  cmd = "npm run start"
  call = case RUBY_PLATFORM.downcase
  when /win[0-9]+/, /i386-mingw32/
    #In windows we can start a new window and it's great
    "START /I #{cmd}"
  else
    #I don't know how this would work on *nixes
    if File.read('/proc/version') =~ /.*Microsoft.*/
      #hoooooo boy we've gone around the bend again
      case $node_dir
      when /^\/mnt\/[a-z]\// 
        #we're poking in the windows system so we can open a thing there natrually
        #We'll invoke cmd.exe from the wsl bash to call START in a new window
        path = $node_dir
                  .partition('mnt/').last
                  .split('/')
        path[0] = path[0].upcase + ":" #get c to C:
        start = ['START']
        start << '/D' << "#{path.join('\\\\')}"
        start << '/I' << cmd

        #Invoke cmd.exe from the wsl bash to call START with node run and such
        "cmd.exe /C \"#{start.join(' ')}\""
      else
        cmd #Shouldn't touch linux dir in windows.
      end
    else
      cmd 
    end
  end
  
  puts call
  system(
    call,
    [:err, :out]=>:out,
    chdir: $node_dir
  )
end

#Todo alias all the scripts in the package.json as well
