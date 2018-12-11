 @echo off
 if not exist .git\ (
   git init 
   git config  user.email  "neoandrey@yahoo.com"
   git config  user.name   "neoandrey@yahoo.com"
   echo "log" >>.gitignore
   echo "bin" >>.gitignore
   git add . 
   git commit -m "Initialize Application " 
)
 set proxy_filepath=%cd%\proxy.txt
 echo "Checking proxy path: %proxy_filepath%"
 IF EXIST "%proxy_filepath%" (
   SET /p proxy_url=<"%proxy_filepath%"
 )  ELSE (
   echo "Please type proxy URL:"
      set /p proxy_url=    
 )
echo  %proxy_url%>%cd%\proxy.txt
 echo "setting proxy as:%proxy_url%"
 SET  HTTP_PROXY=%proxy_url%
 SET  HTTPS_PROXY=%proxy_url%
powershell  -File  %cd%\run.ps1
pause