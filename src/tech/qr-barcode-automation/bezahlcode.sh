#!/bin/sh

urlencode() {
  local string="$(cat)"
  local strlen=${#string}
  local encoded=""
  local pos c o

  for (( pos=0 ; pos<strlen ; pos++ )); do
     c=${string:$pos:1}
     case "$c" in
        [-_.~a-zA-Z0-9] ) o="${c}" ;;
        * )               printf -v o '%%%02x' "'$c"
     esac
     encoded+="${o}"
  done
  echo "${encoded}"
  REPLY="${encoded}"
}

unset lines
while IFS= read -r; do
  lines+=("$REPLY")
done
[[ $REPLY ]] && lines+=("$REPLY")

if [ "${lines[0]:0:25}" = "bank://singlepaymentsepa?" ]; then
  open "${lines[0]}"
  exit 0
fi

if [ "${lines[0]}" = "BCD" ]; then
  BIC=`echo ${lines[4]} | urlencode`
  NAME=`echo ${lines[5]} | urlencode`
  IBAN=`echo ${lines[6]} | urlencode`
  AMOUNT=`echo ${lines[7]} | tr -cd "[:digit:] [:punct:]" | urlencode`
  REASON=`echo ${lines[10]} | urlencode`
  open "bank://singlepaymentsepa?name=${NAME}&iban=${IBAN}&bic=${BIC}&amount=${AMOUNT}&reason=${REASON}"
  exit 0
fi

exit -1