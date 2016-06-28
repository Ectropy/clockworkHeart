# clockworkHeart 1.0.1
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
That's all there is to it! In this example the clockworkHeart has been told that the session will expire in 30 minutes and it will display a warning message 1 minute before the session expires. If the user interacts with the warning message to ask for more time, a hearbeat is sent to the file `heartbeat.cfm`, thus keeping the session alive. When the session does expire, the user is redirected to `index.cfm?reason=sessionexpired`.

## Full Documentation
### Methods
#### clockworkHeart.start()
```javascript
clockworkHeart.start(days,hours,mins,secs,warningMins,warningSecs,heartbeatFilepath,expiryFilepath);
```
Start a clockworkHeart. Specify the time until session expiry, the time before session expiry that you want a warning to be displayed, what file to send heartbeats to, and where to redirect to after expiry.

Argument | Data type | Description
---|---|---
days | int | Days until session expiry.  
hours | int | Hours until session expiry.  
mins | int | Minutes until session expiry.  
secs | int | Seconds until session expiry.  
warningMins | int | Minutes before expiry to display warning.  
warningSecs | int | Seconds before expiry to display warning.  
heartbeatFilepath | string | Filepath of file to send an Ajax post to in order to keep the session alive.  
expiryFilepath | string | Filepath of file to redirect to after session has expired.

#### clockworkHeart.restart()
```javascript
clockworkHeart.restart(days,hours,mins,secs,warningMins,warningSecs,heartbeatFilepath,expiryFilepath);
```
Manually indicate that the session should be renewed. It will send a hearbeat to the file you specified, clear out old timeoutes, and create new timeouts so that users are not warned about expiration or redirected prematurely.

In order to make sure the timeouts stay 'in sync' with the actual session expiry, you should also use this function anytime you perform an action that renewed the session, such as contacting a server-processed file (for example Ajax posting to a ColdFusion .cfc or .cfm file).

Argument | Data type | Description
---|---|---
days | int | Days until session expiry.  
hours | int | Hours until session expiry.  
mins | int | Minutes until session expiry.  
secs | int | Seconds until session expiry.  
warningMins | int | Minutes before expiry to display warning.  
warningSecs | int | Seconds before expiry to display warning.  
heartbeatFilepath | string | Filepath of file to send an Ajax post to in order to keep the session alive.  
expiryFilepath | string | Filepath of file to redirect to after session has expired.

#### clockworkHeart.perpetual()
```javascript
clockworkHeart.perpetual(days,hours,mins,secs,heartbeatFilepath);
```
Send a constant heartbeat to the server to keep the session alive for as long as the user's browser is open and is running JavaScript. It does this silently in the background without requiring any user interaction.

Argument | Data type | Description
---|---|---
days | int | Days until session expiry.  
hours | int | Hours until session expiry.  
mins | int | Minutes until session expiry.  
secs | int | Seconds until session expiry.  
heartbeatFilepath | string | Filepath of file to send an Ajax post to in order to keep the session alive. 

WARNING: *Do not* use `clockworkHeart.perpetual()` at the same time as `clockworkHeart.start()` or `clockworkHeart.restart()`. Undesired behavior will occur if you do! (The user will get session expiration warnings, even though the session is automatically renewed! Furthermore, if the user doesn't interact with the session expiration warnings to ask for more time, the timeout will assume the session has expired and redirect them to the specified page. In reality the session will still be alive because `clockworkHeart.perpetual()` is keeping it alive! In short, these methods are not meant to be used together and strange things will happen if you try to use them together.)

#### clockworkHeart.beat()
```javascript
clockworkHeart.beat(heartbeatFilepath);
```
Manually send a heartbeat to keep the session alive. 

Argument | Data type | Description
---|---|---
heartbeatFilepath | string | Filepath of file to send an Ajax post to in order to keep the session alive. 

WARNING: If your application uses `clockworkHeart.start()` to keep track of session expiration you will almost always want to use `clockworkHeart.restart()` to extend the session, instead of manually sending a `clockworkHeart.beat()`. Unlike `clockworkHeart.restart()`, `clockworkHeart.beat()` does not clear and reset old timeouts, so session expiration warnings and redirects may occur earlier than expected.

### Variables
#### clockworkHeart.debug
```javascript
clockworkHeart.debug = true|false;
```
Indicates whether or not debugging info will be logged to the console.

Data type | Default | Description
---|---|---
boolean | `false` | Set to `true` to display debugging info in the console.

#### clockworkHeart.warningTitleText
```javascript
clockworkHeart.warningTitleText = "string";
```

Data type | Default | Description
---|---|---
string | "Need more time?" | Text to display in the title of the session expiry warning modal.

#### clockworkHeart.warningMessageText
```javascript
clockworkHeart.warningMessageText = "string";
```

Data type | Default | Description
---|---|---
string | "It looks like you've been inactive for some time. For security, you will be automatically logged out soon. Do you need more time?" | Text to display in the body of the session expiry warning modal.

#### clockworkHeart.warningButtonText
```javascript
clockworkHeart.warningButtonText = "string";
```

Data type | Default | Description
---|---|---
string | "Yes, extend my time." | Text to display in the button of the session expiry warning modal. (The button that extends the session.)

### Timeout Variables
Generally there isn't going to be a good reason to access these yourself, but if you really want to you can.
#### clockworkHeart.sessionOverTimeout
```javascript
clockworkHeart.sessionOverTimeout
```
This is the timeout that keeps track of when the session will end. It redirects the user to the page you specified in `clockworkHeart.start()` or `clockworkHeart.restart()`.

One reason you might want to manually access the timeout is to kill it. You can kill it like any timeout by using `clearTimeout()` for example: `clearTimeout(clockworkHeart.sessionOverTimeout);`

#### clockworkHeart.displayWarningTimeout
```javascript
clockworkHeart.displayWarningTimeout
```
This is the timeout that keeps track of when the warning modal should be displayed.

One reason you may wish to manually access this timeout is to kill it, for example: `clearTimeout(clockworkHeart.displayWarningTimeout);`

