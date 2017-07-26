#!/bin/bash

# https://gist.github.com/domenic/ec8b0fc8ab45f39403dd
# https://github.com/steveklabnik/automatically_update_github_pages_with_travis_example

# generate keys with no passphrase
# -----------------------------------------------------------------------------
# mkdir ./.ssh/
# ssh-keygen -t rsa -b 4096 -C "sh@signalwerk.ch" -f ./.ssh/id_rsa

# generate keys with no passphrase
# -----------------------------------------------------------------------------
# cd ./.ssh/
# travis encrypt-file ./id_rsa

# others
# -----------------------------------------------------------------------------
# copy the id to the .travis.yml
# add deploy key to https://github.com/<user>/<repo>/settings/keys



set -e # Exit with nonzero exit code if anything fails


echo "-- start"

echo "-- env start"
echo ${SOURCE_BRANCH}
echo ${DEPLOY_DIR}
echo "-- env end"

SOURCE_BRANCH="master"
TARGET_BRANCH="gh-pages"
DEPLOY_DIR="public"


# Pull requests and commits to other branches shouldn't try to deploy, just build to verify
if [ "$TRAVIS_PULL_REQUEST" != "false" -o "$TRAVIS_BRANCH" != "$SOURCE_BRANCH" ]; then
    echo "Skipping deploy; just doing a build."
    exit 0
fi

# Save some useful information
REPO=`git config remote.origin.url`
echo "----- repo"
SSH_REPO=${REPO/https:\/\/github.com\//git@github.com:}
SHA=`git rev-parse --verify HEAD`

# Clone the existing gh-pages for this repo into $DEPLOY_DIR/
# Create a new empty branch if gh-pages doesn't exist yet (should only happen on first deply)
git clone $REPO $DEPLOY_DIR
cd $DEPLOY_DIR
git checkout $TARGET_BRANCH || git checkout --orphan $TARGET_BRANCH
cd ..

# Clean out existing contents
echo "-- clean up"
cd $DEPLOY_DIR
# Recursively clean current directory but not dir named .git
#rm -r `find . | grep -v '.git'`
rm -r $(ls | grep -v '.git')
cd ..


# Run our compile script
echo "-- build"
sh ./travis/build.sh

# Now let's go have some fun with the cloned repo
cd $DEPLOY_DIR
git config user.name "Travis CI"
git config user.email "$COMMIT_AUTHOR_EMAIL"

# If there are no changes to the compiled out (e.g. this is a README update) then just bail.
if git diff --quiet; then
    echo "No changes to the output on this push; exiting."
    exit 0
fi

# Commit the "changes", i.e. the new version.
# The delta will show diffs between new and old versions.
git add -A .
git commit -m "Deploy to GitHub Pages: ${SHA}"

# Get the deploy key by using Travis's stored variables to decrypt id_rsa.enc
ENCRYPTED_KEY_VAR="encrypted_${ENCRYPTION_LABEL}_key"
ENCRYPTED_IV_VAR="encrypted_${ENCRYPTION_LABEL}_iv"
ENCRYPTED_KEY=${!ENCRYPTED_KEY_VAR}
ENCRYPTED_IV=${!ENCRYPTED_IV_VAR}
eval `ssh-agent -s`
openssl aes-256-cbc -K $ENCRYPTED_KEY -iv $ENCRYPTED_IV -in ./travis/.ssh/id_rsa.enc -d | ssh-add -

# Now that we're all set up, we can push.
git push $SSH_REPO $TARGET_BRANCH
