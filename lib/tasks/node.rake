CLOBBER << "node/node_modules"

node_dir = File.expand_path 'node'
# - starting in the directory NODE_DIR
# - passing our current environment to it
# - staying until it stops,
win_invoke = "START \"ULTIMATE %1$s\" /D \"#{node_dir}\" /I /WAIT %1$s"

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