#!/bin/bash
echo "Fixing Worklets version mismatch..."

# Stop any running Metro bundler
pkill -f "metro" || true

# Clear Metro bundler cache
echo "Clearing Metro cache..."
npx expo start -c --clear || true

# Clear watchman (if available)
if command -v watchman &> /dev/null; then
    echo "Clearing Watchman..."
    watchman watch-del-all
fi

# Clear npm cache
echo "Clearing npm cache..."
npm cache clean --force

# Remove node_modules and package-lock
echo "Removing node_modules..."
rm -rf node_modules
rm -f package-lock.json

# Reinstall dependencies
echo "Reinstalling dependencies..."
npm install

echo "✅ Done! Now run: npx expo start --clear"
