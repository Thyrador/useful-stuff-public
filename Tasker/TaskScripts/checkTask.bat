@echo  off
whoami
echo.
schtasks /query /TN elformDesktopApps /FO LIST
echo.
pause