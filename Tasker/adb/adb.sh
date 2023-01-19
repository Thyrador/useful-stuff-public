#!/data/data/com.termux/files/usr/bin/bash
host="$1"
adb=$PREFIX/bin/adb

$adb connect $host
$adb tcpip 5555
$adb disconnect
$adb kill-server
