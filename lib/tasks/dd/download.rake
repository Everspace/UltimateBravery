require 'lol/DataDragon'

#TODO: Handle being offline
all_tasks = []

task "versions" do
  puts "Downloading versions.json"
  Utils.write(
    DataDragon.get_generic("api/versions.json"),
    "#{$output_directory}/json/versions.json",
    if ENV['pretty'] then true else false end
  )
  puts "Finished downloading versions.json"
end
all_tasks << "versions"

#Actual language data
download_all_languages = $all_languages.collect do |lang|
  things_to_do = []

  things_to_update = Tristana.UPDATEABLE_THINGS.collect do |thing|

    task "#{lang}:#{thing}" => "realm:#{ENV['realm'] || 'NA'}" do |t|

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

      Utils.dump(blob, '_RawBlob') if $is_debug
      blob = judger.new(blob, debug: $is_debug).process if judger
      Utils.dump(blob, '_JudgedBlob') if $is_debug

      Utils.write(
        trist.groomer.groom_blob(blob),
        "#{$output_directory}/json/#{lang}/#{thing}.json",
        $is_pretty
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

download_all_realms = $all_realms.collect do |realm|
  task "realm:#{realm}" do |t|
    puts "Downloading realm #{realm}"
    Utils.write(
      DataDragon.realm_info(realm),
      "#{$output_directory}/json/realm_#{realm.downcase}.json",
      $is_pretty
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