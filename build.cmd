lua ga-build.lua
rem npm run build
rem aws s3 sync ./build/ s3://foresight.56-studio.com --delete
rem aws s3api put-object --bucket foresight.56-studio.com --key bundle.74590.esm.js --content-type text/javascript --body build/bundle.74590.esm.js
rem aws s3api put-object --bucket foresight.56-studio.com --key bundle.bc616.js     --content-type text/javascript --body build/bundle.bc616.js
