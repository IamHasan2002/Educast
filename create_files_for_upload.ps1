$source = "d:\MD Tazimul Hasan_10352967 COM6681\cloud-native-app"
$destination = "d:\MD Tazimul Hasan_10352967 COM6681\upload_to_azure.zip"
$exclude = "node_modules"

Get-ChildItem -Path $source -Exclude $exclude | Compress-Archive -DestinationPath $destination -Force

Write-Host "Created zip file at $destination"
