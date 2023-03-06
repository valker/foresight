
local lfs = require("lfs")
local bucket = "foresight" -- in yandex cloud

-- собираем проект
os.execute("npm run build")

-- загружаем все файлы кроме js
os.execute("aws s3 sync ./build/ s3://" .. bucket
		.. " --delete"
		.. " --exclude *.js"
		.. " --endpoint-url=https://storage.yandexcloud.net")

-- загружаем файлы js
for filename in lfs.dir( "build" ) do
	if string.match(filename, ".+\.js$") then
		print(filename)
		local command_line = "aws s3api put-object"
				.. " --bucket "     .. bucket
				.. " --key "        .. filename
				.. " --content-type text/javascript"
				.. " --endpoint-url=https://storage.yandexcloud.net"
				.. " --body build/" .. filename
		os.execute( command_line )
	end
end
