require('dotenv').config();
const fetch = require('node-fetch');
console.log("hello world")

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
  }

async function getJSONGoogleSheet(url) {
    try {
      const absoluteURL = new URL(url);
      const response = await fetch(absoluteURL.href);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = ((await response.json())['values']).splice(1);
      //data = data['values'].splice(1);
      //console.log(data)
      return data;
    } catch (error) {
      console.error('Error:', error);
    }
}  


async function getUnsubDataFromGoogleSheets(){
    //GET UNSUB DATA FROM GSHEETS
    unsubUserData = ""
    try {
      const unsubUrl = process.env.UNSUBSCRIBE_FORM;
      const data = await getJSONGoogleSheet(unsubUrl);
      // Handle the JSON data here
      unsubUserData = data; //UNSUB DATA IS STORED IN unsubUserData
    } catch (error) {
      // Handle any errors that occurred during the process
      console.error('Error:', error);
    }

    finalUnsubData = []
    //ITERATE THROUGH unsubUserData, manipulate data
    for (entries in unsubUserData){
		unsubDate = unsubUserData[entries][0];
		DD = unsubDate.slice(0,2);
		MM = unsubDate.slice(3,5);
		YY = unsubDate.slice(6,10);
		hh = unsubDate.slice(11,13);
		mm = unsubDate.slice(14,16);
		ss = unsubDate.slice(17,19);
		//console.log("New Date    " + DD, MM, YY, hh, mm, ss)
		unsubDate = YY + "-" + MM + "-" + DD + "T" + hh + ":" + mm + ":" + ss + ".000Z";
		unsubDateValueOf = (new Date(unsubDate)).valueOf()
		//console.log("New Data: " + unsubDate + " " + unsubDateValueOf);	
		finalUnsubData.push([unsubUserData[entries][1],unsubDateValueOf])
    }	
	console.log (finalUnsubData);
	return finalUnsubData;


};

async function getSubDataFromConvertKit(){
    //PULL SUBSCRIBER LIST FROM CONVERTKIT
    userSubData = ""
    try {
      const subUrl = "https://api.convertkit.com/v3/subscribers?api_secret="+process.env.CONVERTKIT_SECRET;
      const data = await getJSONConvertKit(subUrl);

	  finalSubData = [];
      //FOR LOOP TO ITERATE THROUGH PAGES
      for (counter = 1; counter <= data['total_pages']; counter++){

		const subUrlWithPage = "https://api.convertkit.com/v3/subscribers?api_secret="+process.env.CONVERTKIT_SECRET+"&page="+counter;
		const dataWithPage = await getJSONConvertKit(subUrlWithPage);
		//console.log(dataWithPage['subscribers']);
		//console.log("Counter - ", counter);
		for (i in dataWithPage['subscribers']){
			subDateValueOf = new Date(dataWithPage['subscribers'][i]['created_at']).valueOf()
			finalSubData.push([dataWithPage['subscribers'][i]['email_address'], subDateValueOf]);
		};
		
        };
	//console.log(finalSubData);
	return finalSubData;

      userSubData = data; //SUB DATA IS STORED IN userSubData
    } catch (error) {
      // Handle any errors that occurred during the process
      console.error('Error:', error);
    }

};

function unsubUser(userEmail){
	jsonVar = {api_secret: process.env.CONVERTKIT_SECRET, email: userEmail};
	//console.log(jsonVar);

	const putMethod = {
	method: 'PUT', // Method itself
	headers: {
		'Content-type': 'application/json' // Indicates the content 
	},
	body: JSON.stringify(jsonVar) 
	}

	// make the HTTP put request using fetch api
	fetch('https://api.convertkit.com/v3/unsubscribe', putMethod)
	.then(response => response.json())
	.then(data => console.log(data)) // Manipulate the data retrieved back, if we want to do something with it
	.catch(err => console.log(err)) // Do something with the error   	

};

async function findUsersToUnsub(currentlySubbed, awaitingUnsub){
	for (x in awaitingUnsub){
		unsubEmail = awaitingUnsub[x][0];
		unsubTime = awaitingUnsub[x][1];

		for (y in currentlySubbed){
			subEmail = currentlySubbed[y][0];
			subTime = currentlySubbed[y][1];
			//console.log(unsubEmail + " - " + subEmail);
			//console.log(subEmail ,unsubEmail, unsubTime, subTime)
			if (subEmail == unsubEmail && unsubTime > subTime){ //If the email matches and the unsub time is after the subtime then add the email to a list of emails to be unsubbed
				
				unsubUser(subEmail) //unsubs the user

                //logic to manage the fact that an array of length 1 doesn't work with splice
				awaitingUnsub.length == 1 ? awaitingUnsub = [] : awaitingUnsub = awaitingUnsub.splice(x,1);
				currentlySubbed.length == 1 ? currentlySubbed = [] : currentlySubbed = currentlySubbed.splice(y,1);

			}
		}

	}
}

async function main(){
	finalUnsubData = await getUnsubDataFromGoogleSheets(); //returns a list of emails and times of the users who want to unsub
	finalSubData = await getSubDataFromConvertKit(); //returns a list of emails and times of the users who subbed
	await findUsersToUnsub(finalSubData, finalUnsubData); //works both of the above lists also unsubs said user
}
main()
//getUnsubDataFromGoogleSheets()
//unsubData = getUnsubDataFromGoogleSheets()

