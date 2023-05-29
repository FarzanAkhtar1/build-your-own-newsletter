require('dotenv').config();

console.log(process.env.CONVERTKIT_SECRET);
console.log("Hello world");

function pullNewsData(){
	const http = require('https');
	// const req = http.request('https://www.newsnow.co.uk/h/Business+&+Finance/Cryptocurrencies/DeFi', res => {
	// 	const data = [];
	// const req = http.request('https://c.newsnow.co.uk/A/1181750939?-52845:39960', res => {
	// 	const data = [];
	// 	res.on('data', _ => data.push(_))
	// 	res.on('end', () => console.log(data.join()))
	// });

}
pullNewsData()

function pullSubscribedUsers(){
	
	const callURL = "https://api.convertkit.com/v3/subscribers?api_secret="+process.env.CONVERTKIT_SECRET
	console.log(callURL);
	//const req = http.request

}

//pullSubscribedUsers()

