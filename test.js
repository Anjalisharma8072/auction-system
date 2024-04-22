// function countdownTimer(maxTime) {
//   // Parse the maximum time string into hours, minutes, and seconds
//   var parts = maxTime.split(":");
//   var maxHours = parseInt(parts[0]);
//   var maxMinutes = parseInt(parts[1]);
//   var maxSeconds = parseInt(parts[2]) || 0;

//   // Get the current time
//   var currentTime = new Date();
//   var currentHours = currentTime.getHours();
//   var currentMinutes = currentTime.getMinutes();
//   var currentSeconds = currentTime.getSeconds();

//   // Convert both current and maximum times into total seconds
//   var maxTotalSeconds = maxHours * 3600 + maxMinutes * 60 + maxSeconds;
//   var currentTotalSeconds = currentHours * 3600 + currentMinutes * 60 + currentSeconds;

//   var timer = setInterval(function() {
//       // Get the updated current time
//       currentTime = new Date();
//       currentHours = currentTime.getHours();
//       currentMinutes = currentTime.getMinutes();
//       currentSeconds = currentTime.getSeconds();
//       currentTotalSeconds = currentHours * 3600 + currentMinutes * 60 + currentSeconds;

//       // Check if current time has reached or exceeded the maximum time
//       if (currentTotalSeconds >= maxTotalSeconds) {
//           clearInterval(timer);
//           console.log("Time's up!");
//           return;
//       }

//       // Calculate remaining time
//       var remainingTotalSeconds = maxTotalSeconds - currentTotalSeconds;
//       var remainingHours = Math.floor(remainingTotalSeconds / 3600);
//       var remainingMinutes = Math.floor((remainingTotalSeconds % 3600) / 60);
//       var remainingSeconds = remainingTotalSeconds % 60;
//       document.getElementById("seconds").value=remainingSeconds;
//       console.log("Time remaining: " + remainingHours + " hours " + remainingMinutes + " minutes " + remainingSeconds + " seconds");
//   }, 1000);
// }

// countdownTimer('9:38')

console.log(new Date())