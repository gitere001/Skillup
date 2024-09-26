const welcomeNote = async (user) => {
	const userName = user.firstName;
	const now = new Date();
	console.log('now', now)
	const kenyaTimeString = now.toLocaleString("en-UK", { timeZone: "Africa/Nairobi", hour: '2-digit', hour12: false });
	console.log('kenyaTimeString', kenyaTimeString)
	const hours = parseInt(kenyaTimeString);
	let greeting;

	if (hours >= 0 && hours < 12) {
		greeting = "Good Morning";
	} else if (hours >= 12 && hours < 18) {
		greeting = "Good Afternoon";
	} else {
		greeting = "Good Evening";
	}
	const note = `${greeting} ${userName}`;
	return note;

}

export default welcomeNote