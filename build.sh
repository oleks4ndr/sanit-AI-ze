#!/bin/bash
cd packages/sanitaize
npm install
npm run build
cd ../../apps/sanitaize
npm install
npm run build
