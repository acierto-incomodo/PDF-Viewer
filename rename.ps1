Get-ChildItem -Path "dist" | ForEach-Object {
    $newName = $_.Name -replace " ", "-"
    
    if ($_.Name -ne $newName) {
        Rename-Item -Path $_.FullName -NewName $newName
    }
}