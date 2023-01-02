#
# Be sure to run `pod lib lint CRMRAID.podspec' to ensure this is a
# valid spec before submitting.
#
# Any lines starting with a # are optional, but their use is encouraged
# To learn more about a Podspec see https://guides.cocoapods.org/syntax/podspec.html
#

Pod::Spec.new do |s|
  s.name             = 'CRMRAID'
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
  s.ios.deployment_target = '10.0'

  s.resource_bundles = {
    'Resource' => ['src/*.ts']
  }
end
