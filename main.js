require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');
const { userInfo } = require('os');
const sgMail = require('@sendgrid/mail')


//console.log(process.env.CONVERTKIT_SECRET);
console.log("Hello world");

async function pullNewsData(coins, tickers){
	newsDataFinal = {}
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
			newsDataFinal[coins[y]] = urlAndHeadline
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
	return newsDataFinal	
}

async function getJSONConvertKit(url) {
    try {
      const absoluteURL = new URL(url, process.env.UNSUBSCRIBE_FORM);
      const response = await fetch(absoluteURL.href);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
    }
};

async function getSubscribersJSONConvertKit() {
	const getMethod = { //Define the type of method
		method: 'GET', 
		}
	
		// make the HTTP put request using fetch api to get the list of users
	const response = await fetch('https://api.convertkit.com/v3/subscribers?api_secret='+ process.env.CONVERTKIT_SECRET, getMethod);
	if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	};

	const data = await response.json();  
	//console.log(data)
	subscribersDict = {} //dict to store user information
	for (counter = 1; counter <= data['total_pages']; counter++){ //subscriber data is presented in pages so we need to iterate through the max number of pages given by the API
		const subUrlWithPage = "https://api.convertkit.com/v3/subscribers?api_secret="+process.env.CONVERTKIT_SECRET+"&page="+counter; //pull user data based on page
		const dataWithPage = await getJSONConvertKit(subUrlWithPage);
		for (i in dataWithPage['subscribers']){ //iterates through all the users
			userID = dataWithPage['subscribers'][i]['id'] //takes the user's ID, this will be used as the key for subscriberDict
			subscribersDict[userID] = ""; //creates the dict with an empty value
			const userTagsURL = "https://api.convertkit.com/v3/subscribers/" + userID + "/tags?api_key=" + process.env.CONVERTKIT_PUBLIC; //pulls the specific user's tags, ID is the unique identifier
			const userTagsData = await getJSONConvertKit(userTagsURL);		
			tags = []
			for (y in userTagsData['tags']){ //for the tags user has
				tags.push(userTagsData['tags'][y]['name'].replace(/ (.*)/g,"")) //remove the ticker from the tag name
				//console.log(userTagsData['tags'][y]['name'].replace(/ (.*)/g,""))
			};
			subscribersDict[dataWithPage['subscribers'][i]['id']] = [tags,dataWithPage['subscribers'][i]['first_name'], dataWithPage['subscribers'][i]['email_address']] //adds the tag data, name, and email to the value of the key above
			//finalSubData.push([dataWithPage['subscribers'][i]['email_address'], subDateValueOf]);
		};
	};
	return subscribersDict
};

async function sendEmail(newsOfEachCoin, subscriberDict){
	for (x in subscriberDict){ //for each user
		console.log(subscriberDict[x])
		userEmail = subscriberDict[x][2] //get user email
		userName = subscriberDict[x][1] //get users names
		userNews = subscriberDict[x][0] //get users news prefs
		totalNews = ""
		for (y in userNews){ //for each of their preferences
			console.log(userNews[y])
			try{
				console.log(newsOfEachCoin[userNews[y]])
				//console.log(newsOfEachCoin[userNews])
				totalNews = totalNews + newsOfEachCoin[userNews[y]] //if their preference is in the dict, add it to their 'news'
			}catch{};
		};
		
		//console.log(totalNews)
	}
	sgMail.setApiKey(process.env.SENDGRID_API_KEY)
	let ts = Date.now();
	let date_ob = new Date(ts);
	let date = date_ob.getDate();
	let month = date_ob.getMonth() + 1;
	let year = date_ob.getFullYear();
	// prints date & time in YYYY-MM-DD format
	emailDate = (date + "/" + month + "/" + year);

	// const msg = {
	// 	to: 'farzan.akhtar1@gmail.com', // Change to your recipient
	// 	from: process.env.SENDGRID_SENDER, // Change to your verified sender
	// 	subject: 'Test email from fudge',
	// 	text: 'test email',
	// 	html: '<strong>New Block - '+ emailDate + '</strong>' +
	// 		'<p>Welcome to this edition of New Block</p>',	
	//   }
	//   sgMail
	// 	.send(msg)
	// 	.then(() => {
	// 	  console.log('Email sent')
	// 	})
	// 	.catch((error) => {
	// 	  console.error(error)
	// 	})

	//Added sendgrid API key
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

};

async function main(){


	userInfos = await getSubscribersJSONConvertKit()
	console.log("-----")
	console.log(userInfos)
	console.log("-----")
	
	names = ['Bitcoin','Solana']
	ticker = ['BTC', 'SOL']
	newsLinks = await pullNewsData(names, ticker)
	console.log("-----")
	console.log(newsLinks)
	console.log("-----")
	await sendEmail(newsLinks, userInfos)
}
//main()
//getUnsubDataFromGoogleSheets()
//unsubData = getUnsubDataFromGoogleSheets()



main()