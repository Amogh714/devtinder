# API List

## authrouter
post/signup
post/login
post/logout

## profilerouter

get/getprofile
patch/profile/updateinfo
patch/profile/forgotpassword

## connectionrouter

post/connection/send/interested/:_id
post/connection/send/rejected/:_id
post/connection/review/accepted/:_id
post/connection/review/declined/:_id

## userconnectionrouter
get/user/connections
get/user/feed
get/request/recieved