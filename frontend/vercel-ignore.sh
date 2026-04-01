#!/bin/bash

echo "Checking Vercel build conditions..."
echo "Current Environment: $VERCEL_ENV"

# 1. Check if it's a production build
if [[ "$VERCEL_ENV" != "production" ]]; then
  echo "WARNING: Build cancelled: This is not a production environment."
  exit 0
fi

FOLDER_TO_CHECK="."

# Check if there are differences in the specified folder between the last commit and this one
if git diff --quiet HEAD^ HEAD ./$FOLDER_TO_CHECK; then
  echo "WARNING: Build cancelled: No changes detected in the '$FOLDER_TO_CHECK' folder."
  exit 0
else
  echo "MESSAGE: Build proceeding: Changes detected in '$FOLDER_TO_CHECK' or production forced."
  exit 1
fi