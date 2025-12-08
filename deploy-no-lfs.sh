#!/bin/bash
# Deploy script that bypasses Git LFS for images

echo "Building project..."
npm run build

echo "Preparing deployment..."
cd dist

# Initialize a fresh git repo (no LFS)
rm -rf .git
git init
git config user.name "GitHub Actions"
git config user.email "actions@github.com"

# Add all files WITHOUT LFS
git add -A
git commit -m "Deploy to GitHub Pages"

# Force push to gh-pages branch
git push -f https://github.com/IT-For-Youth-Ghana/Webpage.git HEAD:gh-pages

echo "Deployment complete!"
