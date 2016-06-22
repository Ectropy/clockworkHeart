//This is an Immediately Invoked Function Expression (IIFE) that wraps all of
//the code and accepts the window object as an argument.
(function(window){
'use strict';

function define_clockworkHeart(){
	//The base clockworkHeart object.
	var clockworkHeart = {};
	
	//Set this to true to enable debugging console.log statements.
	//console.log statements for incorrect function usage will be displayed regardless of this setting.
	clockworkHeart.debug = false;
	
	clockworkHeart.warningTitleText = "Need more time?";
	clockworkHeart.warningMessageText = "It looks like you've been inactive for some time. For security, you will be automatically logged out soon. Do you need more time?";
	clockworkHeart.warningButtonText = "Yes, extend my time.";
	
	//Run this function when any page that uses a session is first loaded.
	clockworkHeart.start = function(days,hours,mins,secs,warningMins,warningSecs,heartbeatFilepath,expiryFilepath){
	if (days === undefined || hours === undefined || mins === undefined || secs === undefined || warningMins === undefined || warningSecs === undefined || heartbeatFilepath === undefined || expiryFilepath === undefined ){
		console.log("USAGE: clockworkHeart.start(days, hours, minutes, secondsBeforeSessionExpiry, minutes, secondsBeforeSessionExpiryToDisplayWarning, fileToAccessForHeartbeat, fileToRedirectToAfterSessionExpiry)");
	}
	else{
		var milliseconds = (days*86400000)+(hours*3600000)+(mins*60000)+(secs*1000);
		var warningMilliseconds = (warningMins*60000)+(warningSecs*1000);
		
		//When the page first loads, start a js timeout based on the serverside sessionTimeout.
		clockworkHeart.sessionOverTimeout = setTimeout(
			function(){
				//location.href = expiryFilepath;
			//To ensure that the session has expired by the time the js has redirected, we add 2 seconds to the time.
			}, milliseconds+2000);
			
		//And a warning that occurs before the session would time out.
		clockworkHeart.displayWarningTimeout = setTimeout(
			function(){
				bootbox.dialog({
				closeButton: false,
				title: clockworkHeart.warningTitleText,
				message: clockworkHeart.warningMessageText,
				buttons: {
					btnExtend:{
						label: clockworkHeart.warningButtonText,
						className: "btn-primary",
						callback: function(){clockworkHeart.restart(days,hours,mins,secs,warningMins,warningSecs,heartbeatFilepath,expiryFilepath);}
						}		
					}       
				});
			//The warning is set to occur "warningMilliseconds" before the timeout.
			}, milliseconds-warningMilliseconds ); 
			
		if(clockworkHeart.debug === true){console.log("clockworkHeart started with a duration of " + milliseconds + " milliseconds");}
	}
	};
		
	//Run this function when any page that uses a ColdFusion session for authentication is first loaded.
	clockworkHeart.restart = function(days,hours,mins,secs,warningMins,warningSecs,heartbeatFilepath,expiryFilepath){	
	if (days === undefined || hours === undefined || mins === undefined || secs === undefined || warningMins === undefined || warningSecs === undefined || heartbeatFilepath === undefined || expiryFilepath === undefined ){
		console.log("USAGE: clockworkHeart.restart(days, hours, minutes, secondsBeforeSessionExpiry, minutes, secondsBeforeExpiryToDisplayWarning, fileToAccessForHeartbeat, fileToRedirectToAfterSessionExpiry)");
	}
	else{
		var milliseconds = (days*86400000)+(hours*3600000)+(mins*60000)+(secs*1000);
		var warningMilliseconds = (warningMins*60000)+(warningSecs*1000);
		
		//Clear any existing Timeouts.
		clearTimeout(clockworkHeart.sessionOverTimeout);
		clearTimeout(clockworkHeart.displayWarningTimeout);
		
		//Send a heartbeat.
		clockworkHeart.beat(heartbeatFilepath);
				
		//Start a js timeout based on the serverside sessionTimeout.
		clockworkHeart.sessionOverTimeout = setTimeout(
			function(){
				location.href = expiryFilepath;
			//To ensure that the session has expired by the time the js has redirected
			}, milliseconds+2000);
			
		//And a warning that occurs before the session would time out.
		clockworkHeart.displayWarningTimeout = setTimeout(
			function(){
				bootbox.dialog({
				closeButton: false,
				title: clockworkHeart.warningTitleText,
				message: clockworkHeart.warningMessageText,
				buttons: {
					btnExtend:{
						label: clockworkHeart.warningButtonText,
						className: "btn-primary",
						callback: function(){clockworkHeart.restart(days,hours,mins,secs,warningMins,warningSecs,heartbeatFilepath,expiryFilepath);}
						}		
					}       
				});
			//The warning is set to occur "warningMilliseconds" before the timeout.
			}, milliseconds-warningMilliseconds ); 
			
		if(clockworkHeart.debug === true){console.log("clockworkHeart restarted with a duration of " + milliseconds + " milliseconds");}
	}
	};
		
	clockworkHeart.perpetual = function(days,hours,mins,secs,filepath){
		if (days === undefined || hours === undefined || mins === undefined || secs === undefined || filepath === undefined){
			console.log("USAGE: clockworkHeart.perpetual(daysBeforeSessionExpiry, hoursBeforeSessionExpiry, minutesBeforeSessionExpiry, secondsBeforeSessionExpiry, fileToAccessForHeartbeat)");
		}
		else{
			var milliseconds = (days*86400000)+(hours*3600000)+(mins*60000)+(secs*1000);
			setTimeout(
				function(){
					clockworkHeart.beat(filepath);
					clockworkHeart.perpetual(days,hours,mins,secs,filepath);
				//Once we are 98% of the way to the timeout, the heartbeat is sent.
				//This way the session should never actually expired before before we try to renew it.
				}, milliseconds-(milliseconds*0.02)
			);
		}
	};

	//This function contains a simple bit of ajax that should post to a server-processed file, thus renewing the session.
	clockworkHeart.beat = function(filepath){
		if (filepath === undefined){
			console.log("USAGE: clockworkHeart.beat(fileToAccessForHeartbeat)");
		}
		else{
			$.post(filepath);
			if(clockworkHeart.debug === true){console.log("Heartbeat sent to the file at " + filepath);}
		}
	};
return clockworkHeart;
}

//If the object "clockworkHeart" is not already being used, create that object and define this library's functions in it.
if(typeof(clockworkHeart) === 'undefined'){
    window.clockworkHeart = define_clockworkHeart();
}

})(window); //Give the IIFE window object as an argument.
