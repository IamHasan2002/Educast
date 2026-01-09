#!/usr/bin/env bash
source ../../.venv/Scripts/activate
export FLASK_APP=app:create_app
if [ -f .env ]; then export $(grep -v '^#' .env | xargs); fi
python app/__main__.py