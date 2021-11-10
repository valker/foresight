print(arg[1])

local bucket = arg[1] == "ga" and "ga.56-studio.com" or "foresight.56-studio.com"

print(bucket)


local lfs = require("lfs")

os.execute("npm run build")
os.execute("aws s3 sync ./build/ s3://" .. bucket .. " --delete --exclude *.js")

for fl in lfs.dir( "build" ) do
	if string.match(fl, ".+\.js$") then
		print(fl)
		local command_line = "aws s3api put-object --bucket " .. bucket .. " --key " .. fl .. " --content-type text/javascript --body build/" .. fl
--		print(command_line)
		os.execute( command_line )

	end
end


--[[
#npm run build
#aws s3 sync ./build/ s3://ga.56-studio.com --delete --exclude *.js
#aws s3api put-object --bucket ga.56-studio.com --key bundle.bc616.js     --content-type text/javascript --body build/bundle.bc616.js
...
]]
