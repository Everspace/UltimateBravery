require 'aws-sdk'
require 'yaml'
require 'digest'

has_config = File.exist? "#{$config_dir}/AWS.yaml"
config = YAML.load_file("#{$config_dir}/AWS.yaml") if has_config
bucket = Aws::S3::Resource.new(
  region: config[:region],
  credentials: Aws::Credentials.new( *config[:credentials] )
).bucket(config[:bucket]) if has_config

desc "Uploads build to S3 bucket" if has_config
task :upload => ['package'] do
  puts "Pushing to AWS bucket"

  object_by_key = bucket.objects.reduce({}) do |mem, obj|
    mem[obj.key] = obj
    mem
  end

  def md5_matches?(obj, key)
    return false unless obj
    md5 = Digest::MD5.new.hexdigest(File.read("#{$output_dir}/#{key}")).to_s
    obj.etag.gsub('"', '') == md5
  end

  foreign_key_to_hash = {}
  existing_files = []
  bucket.objects.each do |o|
    existing_files << o.key
    foreign_key_to_hash[o.key] = o.etag.gsub('"', '')
  end

  new_files = []
  replacing = []
  no_change = []
  Dir["#{$output_dir}/**/*.*"].each do |path|
    fileKey = path.sub("#{$output_dir}/", '')

    if md5_matches? object_by_key[fileKey], fileKey
      no_change << fileKey
      puts "Skipping       #{fileKey}"
      next
    end

    if existing_files.include? fileKey
      replacing << fileKey
      puts "Will Replace   #{fileKey}"
    else
      new_files << fileKey
      puts "Will Add       #{fileKey}"
    end
  end

  uploading = [*new_files, *replacing]
  to_delete = existing_files - [*uploading, *no_change, *config[:exempt_files]]
  to_delete.each {|key| puts "Will Delete    #{key}"}

  uploading.each do |key|
    success = bucket.object(key).upload_file("#{$output_dir}/#{key}")
    if success
      puts "Uploaded #{key}"
    else
      raise "ERROR: failed to upload #{key}"
    end
  end

  unless to_delete.empty?
    response = bucket.delete_objects({
      delete: {
        objects: to_delete.map {|key| {key: key} }
      }
    })

    response.deleted.each do |obj|
      puts "Deleted   #{obj.key}"
    end

    unless response.errors.empty?
      response.errors.each do |e|
        puts e
      end

      raise "ERROR: Did not delete objects from bucket successfully"
    end
  end

  puts "Finished uploading to AWS"
end if has_config
