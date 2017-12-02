


module.exports = function runTimer(seconds, expired, pulse){
	// Set the date we're counting down to
	var countDownDate = new Date(Date.now()+seconds*1000);

	var id = setInterval(interval, 1000);

	// Update the count down every 1 second
	function interval() {

		// Get todays date and time
		var now = new Date().getTime();
		
		// Find the distance between now an the count down date
		var distance = countDownDate - now;
		
		// Time calculations for days, hours, minutes and seconds
		var seconds = Math.floor((distance % (1000 * 60)) / 1000);

		pulse(seconds);
		
		// If the count down is over, write some text 
		if (distance <= 1) {
			clearInterval(id);
			expired();
		}
	}
	interval();
	return id;
}