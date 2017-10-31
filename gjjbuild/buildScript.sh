#!/usr/bin/env bash
source ~/.bash_profile
cd ~/AndroidStudioProjects/MyApplication
echo 'begin build'
gradle clean build
gradle assemble
cd app/build/outputs
cp -f apk/app-release-unsigned.apk  ~/WebstormProjects/nodeSample/gjjbuild/apks
echo 'build over'