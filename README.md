# clockworkHeart
A js library to help warn about, extend and redirect after server-side session expirations.

## About
clockworkHeart was originally made for renewing the session in a ColdFusion-based web application. It was modifed to be more server-agnostic and released here.

## Server-side language compatibilty
Known to work with:
* ColdFusion

Theoretically should work with:
* ASP.NET
* PHP
* Any other language that extends the session when a server-processed page is accessed.

_Please update this README.md and submit a pull request if you've tested clockworkHeart with a server-side language that is not yet listed._

## Dependencies
* [jQuery](https://jquery.com/) (Tested with 1.12.1, should also work with version as far back as 1.9.1)
* [Bootbox.js](http://bootboxjs.com) (Tested with version 4.4.0, may also work with older versions.)
  * [Bootstrap](http://getbootstrap.com/) (Tested with 3.3.6, should work with versions as far back as 3.0.0)
 
## Usage
Import `clockworkHeart.js` after Bootstrap and Bootbox scripts.
```html
<script src="clockworkHeart.js"></script>
```
Start a clockworkHeart.
```javascript
clockworkHeart.start(0,0,30,0,1,0,"heartbeat.cfm","index.cfm?reason=sessionexpired");
```
That's all there is to it. In this example the clockworkHeart has been told that the session will expire in 30 minutes and it will display a warning message 1 minute before the session expires.

## Full Documentation
### Methods
#### clockworkHeart.start()
Start a clockworkHeart.

Arguments:

1. days - days until session expiry.  
2. hours - hours until session expiry.  
3. mins - minutes until session expiry.  
4. secs - seconds until session expiry.  
5. warningMins - minutes before expiry to display warning.  
6. warningSecs - seconds before expiry to display warning.  
7. heartbeatFilepath - filepath of file to $.post to in order to keep the session alive.  
8. expiryFilepath - filepath of file to redirect to after session has expired.
```javascript
clockworkHeart.start(days,hours,mins,secs,warningMins,warningSecs,heartbeatFilepath,expiryFilepath);
```
#### clockworkHeart.restart()
Manually indicate that the session was renewed.
```javascript
clockworkHeart.restart(days,hours,mins,secs,warningMins,warningSecs,heartbeatFilepath,expiryFilepath);
```
#### clockworkHeart.perpetual()
Send a constant heartbeat to the server to keep the session alive for as long as this JavaScript is running.

Don't use this as the same time as `clockworkHeart.start()` or `clockworkHeart.reset()`. It's meant to be used as way of keeping a user's session alive as long as their browser is open--without requiring any user interaction.
```javascript
clockworkHeart.perpetual(days,hours,mins,secs,heartbeatFilepath);
```
#### clockworkHeart.beat()
Manually send a heartbeat to keep the session alive--generally use `clockworkHeart.restart` instead of this.
```javascript
clockworkHeart.beat(heartbeatFilepath);
```
### Variables
#### clockworkHeart.debug
Defaults to `false`.

Set this to `true` if you want to see debugging info logged in the console.
```javascript
clockworkHeart.debug = true|false;
```
#### clockworkHeart.warningTitleText
```javascript
clockworkHeart.debug = "string";
```
#### clockworkHeart.warningMessageText
```javascript
clockworkHeart.debug = "string";
```
#### clockworkHeart.warningButtonText
```javascript
clockworkHeart.debug = "string";
```
### Timeout Variables
Generally there isn't going to be a good reason to access these yourself, but if you really want to you can.
### clockworkHeart.sessionOverTimeout
This is the timeout that keeps track of when the session will end. It redirect the user to the page you specified in `clockworkHeart.start()` or `clockworkHeart.restart()`. You could manually kill it with...
```javascript
clearTimeout(clockworkHeart.sessionOverTimeout);
```
### clockworkHeart.displayWarningTimeout
This is the timeout that keeps track of when the warning modal should be displayed. You could manually kill it with... 
```javascript
clearTimeout(clockworkHeart.displayWarningTimeout);
```
