require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');

//console.log(process.env.CONVERTKIT_SECRET);
console.log("Hello world");

async function pullNewsData(){
	fetch(process.env.TEST_SITE).then(function (response) {
		// The API call was successful!
		return response.text();
	}).then(function (html) {
		// This is the HTML from our response as a text string
		html = html.replace(/<form class="njs" action="\/h\/ajax\/fredir" method="GET">.*/g,"")
		html = html.split(/view more headlines.*/g)[0]
		html = html.replace("Earlier today","")	
		//html = html.replace(/.*Most Read/gm,"")	

		var newhtml = html.match(/<a class="hll".*\/a>/g)
		console.log(newhtml)
		
		fs.writeFile('testing.txt', html, err => {
			if (err) {
			  console.error(err);
			}
			// file written successfully
		  });

		  fs.writeFile('testing.html', html, err => {
			if (err) {
			  console.error(err);
			}
			// file written successfully
		  });

		  return newhtml
	}).catch(function (err) {
		// There was an error
		console.warn('Something went wrong.', err);
	});
}	

async function main(){
	sites = await pullNewsData()
}
//main()
//getUnsubDataFromGoogleSheets()
//unsubData = getUnsubDataFromGoogleSheets()

main()