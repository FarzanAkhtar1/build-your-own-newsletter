require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');

//console.log(process.env.CONVERTKIT_SECRET);
console.log("Hello world");

async function pullNewsData(coins, tickers){
	for (y in coins){
		await fetch(process.env.TEST_SITE + coins[y] + "?type=ln").then(function (response) {
			return response.text();
		}).then(function (html) {
			// This is the HTML from our response as a text string
			html = html.replace(/<form class="njs" action="\/h\/ajax\/fredir" method="GET">.*/g,"")
			html = html.split(/view more headlines.*/g)[0]
			html = html.replace("Earlier today","")	
			//html = html.replace(/.*Most Read/gm,"")	

			//////////////////////////NEED NEW REGEX TO CONSIDER THE DATE IN THE FORMAT HH:MM DD-MMM-YYYY
			var newhtml = html.match(/<a class="hll".*<i class.*\d{2}:\d{2}/g)
			//console.log(newhtml)
			urlAndHeadline = []

			//console.log(newhtml)
			for (x in newhtml){
				item = newhtml[x]

				//////////////////////////NEED NEW REGEX TO CONSIDER THE DATE IN THE FORMAT HH:MM DD-MMM-YYYY
				date = item.substr(-5)

				item = item.replace("<a class=","")
				item = item.replace('"hll" href="',"")
				item = item.replace("</a>","")

				publisher = item.replace(/.*data-pub="/,"")
				publisher = publisher.replace(/">.*/,"")

				url = item.replace(/" target.*/,"")
				
				headline = item.replace(/.*"nofollow">/,"")
				headline = headline.replace(/<span.*/,"")

				newsData = [publisher, date, url, headline] 
				//console.log(publisher, date, headline, url)

				// Add iuf it doesn't contain the name of the actual asset
				if ((newsData[3].toUpperCase()).includes("PRICE") ||
					(newsData[3].toUpperCase()).includes("BULL") || 
					(newsData[3].toUpperCase()).includes("BEAR") ||
					(newsData[3].toUpperCase()).includes("RALL") || //RALLY or RALLIES				
					(newsData[3].toUpperCase()).includes("TRAD") ||
					(newsData[3].toUpperCase()).includes("SUPPORT") ||
					(newsData[3].toUpperCase()).includes("$") ||
					(newsData[3].toUpperCase()).includes("SUPPORT") ||
					(newsData[3].toUpperCase()).includes("RESISTANCE") ||
					(newsData[3].toUpperCase()).includes("ARTIFICIAL") ||
					(newsData[3].toUpperCase()).includes("PUMP") ||
					(newsData[3].toUpperCase()).includes("DUMP") ||
					(newsData[3].toUpperCase()).includes("INSIDE BITCOIN") ||
					(newsData[3].toUpperCase()).includes("TECHNICAL") ||
					!((/\d{2}:\d{2}/g).test(newsData[2]))
					// !(newsData[3].includes(coins[y])) ||
					// !(newsData[3].includes(tickers[y]))
					){
					console.log("Dirty -", newsData[3], newsData[0], newsData[1])
				}else{
					urlAndHeadline.push(newsData)
					console.log("Clean -", newsData[3], newsData[0], newsData[1])
				}
			}
			console.log(tickers[y], coins[y], urlAndHeadline.length)

			// fs.writeFile('sorted.txt', String(urlAndHeadline), err => {
			// 	if (err) {
			// 	  console.error(err);
			// 	}
			// 	// file written successfully
			//   });


		
		}).catch(function (err) {
			// There was an error
			console.warn('Something went wrong.', err);
		});
	}	
}

async function getSubscribersJSONConvertKit() {
	const getMethod = {
		method: 'GET', // Method itself
		}
	
		// make the HTTP put request using fetch api to get the list of tags
	  const response = await fetch('https://api.convertkit.com/v3/subscribers?api_secret='+ process.env.CONVERTKIT_SECRET, getMethod);
	  if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	  }
	  const data = await response.json();  
	  console.log(data)
	  //console.log(data)
};

async function sendEmail(newsOfEachCoin){
	//newsOfEachCoin should be a dictionary, where the key is the name of the crypto, and the value is an array of arrays where the array contains the link to the article and the headline

	//Define email formatting  for sendgrid

	// Pull all users, store their email
		// For each user, pull their tags and their tags from ConvertKit can reused code from tagsflow.js
	// Remove everything after the bracket (i.e., Bitcoin (BTC) -> Bitcoin) can use regex such as /(.*)/g
	//https://api.convertkit.com/v3/subscribers?api_secret=<your_secret_api_key>
	//For each user
		//Read their tags
		//Construct an email based on their tags (pull data from newsOfEachCoin)
		//Send email

}

async function main(){
	getSubscribersJSONConvertKit()
	//names = ['Bitcoin','Algorand']
	//ticker = ['BTC', 'ALGO']
	//sites = await pullNewsData(names, ticker)
	//console.log(sites)
}
//main()
//getUnsubDataFromGoogleSheets()
//unsubData = getUnsubDataFromGoogleSheets()



main()