require 'opal'
require 'opal-jquery'
 
desc "Build our app to quicker.js"
task :build do
  env = Opal::Environment.new
  env.append_path "app"
 
  File.open("quicker.js", "w+") do |out|
    out << env["quicker"].to_s
  end
end