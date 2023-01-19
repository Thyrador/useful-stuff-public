#!/data/data/com.termux/files/usr/bin/bash

adb=$PREFIX/bin/adb
PORTS=$(rustscan -a 127.0.0.1 -t 5000 -b 1000 --range 30000-50000 -g | cut -d "[" -f2 | cut -d "]" -f1)

#echo "ports scanned: $PORTS"
for port in $(echo $PORTS | sed "s/,/ /g")
do
    host=127.0.0.1:$port
    #echo "connect to $host ..."
    $adb connect $host | grep -q 'connected to' &> /dev/null
    #echo "return value: $?"
    if [ $? == 0 ] ; then
      #echo "connected to $host"
      $adb tcpip 5555 &> /dev/null
      $adb kill-server &> /dev/null
      echo $port
      break
    fi
done
