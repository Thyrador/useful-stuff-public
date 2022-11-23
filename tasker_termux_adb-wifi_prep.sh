#!/data/data/com.termux/files/usr/bin/bash

pkg update
pkg install platform-tools rustscan -y

TASKERDIR=~/.termux/tasker

prepare_Tasker(){
    echo
    echo 
    if [ ! -d $TASKERDIR ]; then
        echo "Tasker folder not found. Creating: \"$TASKERDIR\""
        mkdir $TASKERDIR
    fi

    echo
    echo "Downloading adb.sh"
    curl -L https://raw.githubusercontent.com/Thyrador/useful-stuff-public/main/adb/adb.sh > $TASKERDIR/adb.sh
    
    echo
    echo "Downloading adb_pair.sh"
    curl -L https://raw.githubusercontent.com/Thyrador/useful-stuff-public/main/adb/adb_pair.sh > $TASKERDIR/adb_pair.sh
    
    echo
    echo "Downloading adb_connect.sh"
    curl -L https://raw.githubusercontent.com/Thyrador/useful-stuff-public/main/adb/adb_connect.sh > $TASKERDIR/adb_connect.sh
    
    echo
    echo "Set permissions ..."
    chmod a+x $TASKERDIR/adb.sh $TASKERDIR/adb_pair.sh $TASKERDIR/adb_connect.sh
    
    echo
    echo "Done!"
    echo
}

prepare_Tasker
