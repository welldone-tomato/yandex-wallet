#!/bin/bash

# check version of docker
hash docker 2>/dev/null || { echo >&2 -e "\e[33mYou dont have docker daemon. Please check, fix or install it.\e[0m"; exit 1; }
hash docker-compose 2>/dev/null || { echo >&2 -e "\e[33mYou dont have docker-compose script. Please check, fix or install it.\e[0m"; exit 1; }

OPTS=`getopt -o vh --long verbose,help,file:,addition-file: -n 'parse-options' -- "$@"`

if [ $? != 0 ] ; then echo "Failed parsing options." >&2 ; exit 1 ; fi

eval set -- "$OPTS"

VERBOSE=false
HELP=false
FILE="docker-compose.yml"

while true; do
  case "$1" in
    -v | --verbose )    VERBOSE=true; shift ;;
    -h | --help )       HELP=true; shift ;;
    --file )            FILE="$2"; shift; shift ;;
    --addition-file )   AFILE="$2"; shift; shift ;;
    -- ) shift; break ;;
    * ) break ;;
  esac
done

if $HELP ;
then
 echo "Usage: $0 [--file <file name>] [--addition-file <file name>] [-h --help] [-v --verbose] up|update|down|stop|start|restart"
 exit 0
fi

if [ -f "$FILE" ];
then
  echo "Using $FILE $AFILE file(s)"
  if [ ! -z "$AFILE"]
  then
    if [! -f "$AFILE" ];
    then
      echo -e "\e[33mFile not provided. Set it by [--file <file name>] [--addition-file <file name>] or use docker-compose.yml\e[0m"
      exit 1
    fi
  fi   
else
  echo -e "\e[33mFile not provided. Set it by [--file <file name>] [--addition-file <file name>] or use docker-compose.yml\e[0m"
  exit 1
fi  

# Parse additional arguments
case "$1" in
    up)       
      if [ -f "$AFILE" ];
      then
        docker-compose -f $FILE -f $AFILE2 up -d
        exit 0
      else
        docker-compose -f $FILE up -d
        exit 0
      fi 
      ;;

    down)     
      echo -e "\e[33m*********************************************"
      echo "***************** WARNING *******************"
      echo -e "*********************************************\e[0m"
      echo "Do you want to stop and remove all containers?"
      echo "It destroyes all data in containers. yes\no"
      read doing
      if [[ $doing == "yes" ]]
      then
        if [ -f "$AFILE" ];
        then
          docker-compose -f $FILE -f $AFILE2 down
          exit 0
        else
          docker-compose -f $FILE down
          exit 0
        fi
      fi  
      ;;
    update)   
      if [ -f "$AFILE" ];
      then
          docker-compose -f $FILE -f $AFILE2 pull web
      else
          docker-compose -f $FILE pull web
      fi
      if docker ps -a | grep --quiet yandex-web-production 
      then 
        if [ -f "$AFILE" ];
        then
            docker-compose -f $FILE -f $AFILE2 up -d --no-deps web
        else
            docker-compose -f $FILE up -d --no-deps web
        fi
      else 
        echo "You system dont have yandex-web-production container. Please do full "docker-compose up""
      fi
      ;;
    stop)     stop ;;
    start)    start ;;
    restart)
              stop
              start
              ;;
    *) 
      echo "Usage: $0 [--file <file name>] [--addition-file <file name>] [-h --help] [-v --verbose] up|update|down|stop|start|restart"
      exit 0 ;;
esac