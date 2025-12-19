#!/bin/bash

# Script to pull all Git LFS video files
# Run this script to download all actual video files from Git LFS

echo "Pulling Git LFS video files..."
git lfs pull --include="public/assets/videos/*.mp4"

echo "Verifying video files..."
for video in public/assets/videos/*.mp4; do
    if [ -f "$video" ]; then
        size=$(stat -f%z "$video" 2>/dev/null || stat -c%s "$video" 2>/dev/null)
        if [ "$size" -lt 1000 ]; then
            echo "⚠️  $video is still a pointer (${size} bytes) - may need authentication"
        else
            echo "✅ $video is a real file (${size} bytes)"
        fi
    fi
done

echo ""
echo "Done! If some files are still pointers, you may need to:"
echo "1. Configure Git credentials: git config credential.helper store"
echo "2. Or pull manually: git lfs pull --include='public/assets/videos/[filename].mp4'"

