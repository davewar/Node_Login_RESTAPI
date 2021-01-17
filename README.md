# Tech-challenge-junior

**Build app using given two provided API endpoints (Login and Policy details) that returns insurance policy details.**

Location of challenge: https://github.com/bymiles-tech/tech-challange-junior

# Install dependencies

npm install

# start app

npm start

# Server runs on http://localhost:8080

## Author

dave_war

### Version

1.0.0

Test findings:

Pass:

1. User able to login with username and password.
2. User insurance policy details are shown in dashboard.
3. User able to logout and cookie deleted.
4. if user.id not held - user not able to bypass the login and go directly to http://localhost:8080/dashboard

Fail:

1. username and password dont need to be valid and API will pull back data
2. code. access_token are all identical.
3. Password validation not possible in this api.
4. Brcypt - would be beneficial to mask password in API database.

Example of data response

_invalid username and passwords returns data_

```
data {
username: 'Ronny70',
session: 'yJraWQiOiJweUs2RHhFak05SXhnU3',
type: 'USER_PASSWORD_AUTH',
code: '116567',
access_token: 'MuYW1hem9uYXdzLmNvbVwvZXUtd2VzdC0zX3JkdldSMGs',
refresh_token: 'MuYW1hem9uYXdzLmNvbVwvZXUtd2VzdC0zX3JkdldSMGs'
}
data {
username: 'Laurel49',
session: 'yJraWQiOiJweUs2RHhFak05SXhnU3',
type: 'USER_PASSWORD_AUTH',
code: '116567',
access_token: 'MuYW1hem9uYXdzLmNvbVwvZXUtd2VzdC0zX3JkdldSMGs',
refresh_token: 'MuYW1hem9uYXdzLmNvbVwvZXUtd2VzdC0zX3JkdldSMGs'
}
data {
username: 'Rosina.Reichert',
session: 'yJraWQiOiJweUs2RHhFak05SXhnU3',
type: 'USER_PASSWORD_AUTH',
code: '116567',
access_token: 'MuYW1hem9uYXdzLmNvbVwvZXUtd2VzdC0zX3JkdldSMGs',
refresh_token: 'MuYW1hem9uYXdzLmNvbVwvZXUtd2VzdC0zX3JkdldSMGs'
}
```
