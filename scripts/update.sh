#!/bin/sh
# Pull latest default branch (ff-only), then rebuild images and recreate containers.
exec "$(dirname "$0")/deploy.sh"
