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

		var newhtml = html.match(/<a class="hll".*<i class.*\d{2}:\d{2}/g)
		//console.log(newhtml)
		urlAndHeadline = []

		//console.log(newhtml)
		for (x in newhtml){
			item = newhtml[x]

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
				(newsData[3].toUpperCase()).includes("INSIDE BITCOIN")){
				console.log("detected", newsData[3])
			}else{
				urlAndHeadline.push(newsData)

			}
		}
		console.log(urlAndHeadline.length)	

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

async function main(){
	sites = await pullNewsData()
	//console.log(sites)
}
//main()
//getUnsubDataFromGoogleSheets()
//unsubData = getUnsubDataFromGoogleSheets()

main()