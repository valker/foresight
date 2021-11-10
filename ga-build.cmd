npm run build
#aws s3 sync ./build/ s3://ga.56-studio.com --delete
#aws s3api put-object --bucket ga.56-studio.com --key bundle.74590.esm.js --content-type text/javascript --body build/bundle.74590.esm.js
#aws s3api put-object --bucket ga.56-studio.com --key bundle.bc616.js     --content-type text/javascript --body build/bundle.bc616.js
