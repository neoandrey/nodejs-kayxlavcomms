rem npm start
cd  C:\Users\Mobolaji.Aina\Documents\nodejs\kayxlavcomms
taskkill /im node.exe  /f /t
taskkill /im mongod.exe  /f /t
taskkill /im java.exe  /f /t
rem java -jar nodesiteservice.jar -n kayxlavcomms -d "C:\\Users\\Mobolaji.Aina\\Documents\\nodejs\\kayxlavcomms\\" -s "," -e "cmd /c start_mongo_server.cmd,cmd /c start_site_http.cmd"

start cmd /k start_mongo_server.cmd && start cmd /k start_site_http.cmd
