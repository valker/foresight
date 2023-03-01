-- print(arg[1])
-- local bucket = arg[1] == "ga" and "ga.56-studio.com" or "foresight.56-studio.com"

local lfs = require("lfs")

local bucket = "foresight" -- in yandex cloud
print(bucket)

-- собираем проект
os.execute("npm run build")

-- загружаем все файлы кроме js
os.execute("aws s3 sync ./build/ s3://" .. bucket .. " --delete --exclude *.js --endpoint-url=https://storage.yandexcloud.net")

-- загружаем файлы js
for fl in lfs.dir( "build" ) do
	if string.match(fl, ".+\.js$") then
		print(fl)
		local command_line = "aws s3api put-object --bucket " .. bucket .. " --key " .. fl .. " --content-type text/javascript --endpoint-url=https://storage.yandexcloud.net --body build/" .. fl
		os.execute( command_line )
	end
end
