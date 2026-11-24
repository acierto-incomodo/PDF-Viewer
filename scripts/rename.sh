#!/bin/bash

cd dist || exit

for file in *; do
    new_name=$(echo "$file" | tr ' ' '-')
    
    if [ "$file" != "$new_name" ]; then
        mv "$file" "$new_name"
    fi
done