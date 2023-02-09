#
# Be sure to run `pod lib lint CriteoMRAID.podspec' to ensure this is a
# valid spec before submitting.
#
# Any lines starting with a # are optional, but their use is encouraged
# To learn more about a Podspec see https://guides.cocoapods.org/syntax/podspec.html
#

Pod::Spec.new do |s|
  s.name             = 'CriteoMRAID'
  s.version          = '1.0.0'
  s.summary          = 'MRAID resource pod'
  s.description      = <<-DESC
MRAID js file host.
                       DESC

  s.homepage         = 'https://github.com/criteo/mraid-bridge'
  s.license          = { :type => 'MIT', :file => 'LICENSE' }
  s.author           = { "Criteo" => "opensource@criteo.com" }
  s.source           = {
    :git => 'https://github.com/criteo/mraid-bridge.git',
    :tag => s.version
  }
  s.ios.deployment_target = '9.0'

  s.resource_bundles = {
    'CriteoMRAIDResource' => ['build/criteo-mraid.js']
  }
end
