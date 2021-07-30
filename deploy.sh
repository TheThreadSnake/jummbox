#!/bin/bash

npm run build

gcloud app deploy --project beepbox-synth docs/app.yaml
