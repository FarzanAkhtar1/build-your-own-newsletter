require('dotenv').config();
const fetch = require('node-fetch');
console.log("hello world")

async function getJSONGoogleSheet(url) {
    try {
      const absoluteURL = new URL(url);
      const response = await fetch(absoluteURL.href);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = ((await response.json())['values']).splice(1)
      //console.log(data)
      return data;
    } catch (error) {
      console.error('Error:', error);
    }
}  


async function getTagDataFromGoogleSheets(){
    //GET TAG DATA FROM GSHEETS
    userTagData = ""
    try {
      const unsubUrl = process.env.PREFERENCES_FORM;
      const data = await getJSONGoogleSheet(unsubUrl);
      // Handle the JSON data here
      userTagData = data; //TAG DATA IS STORED IN userTagData
    } catch (error) {
      // Handle any errors that occurred during the process
      console.error('Error:', error);
    }

    finalTagData = []
    //ITERATE THROUGH userTagData, manipulate data
    for (entries in userTagData){
		TagDate = userTagData[entries][0];
		DD = TagDate.slice(0,2);
		MM = TagDate.slice(3,5);
		YY = TagDate.slice(6,10);
		hh = TagDate.slice(11,13);
		mm = TagDate.slice(14,16);
		ss = TagDate.slice(17,19);
		//console.log("New Date    " + DD, MM, YY, hh, mm, ss)
		TagDate = YY + "-" + MM + "-" + DD + "T" + hh + ":" + mm + ":" + ss + ".000Z";
		tagDateValueOf = (new Date(TagDate)).valueOf()
		//console.log("New Data: " + unsubDate + " " + unsubDateValueOf);
    preferences = (userTagData[entries][3]).split(',');
    for (y in preferences){
      preferences[y] = preferences[y].trim();
    }
    //console.log(preferences)
		finalTagData.push([userTagData[entries][2],tagDateValueOf,preferences])
    }	
	//console.log (finalTagData);
	return finalTagData;
};

function tagUser(email, preference){

}

function untagUser(email, preference){

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

async function fetchUserIds(){ //returns a dict with user emails as the key, and their ID as the value
    //PULL SUBSCRIBER LIST FROM CONVERTKIT
    userSubData = ""
    try {
      const subUrl = "https://api.convertkit.com/v3/subscribers?api_secret="+process.env.CONVERTKIT_SECRET;
      const data = await getJSONConvertKit(subUrl);

	  finalSubData = {};
      //FOR LOOP TO ITERATE THROUGH PAGES
      for (counter = 1; counter <= data['total_pages']; counter++){

		const subUrlWithPage = "https://api.convertkit.com/v3/subscribers?api_secret="+process.env.CONVERTKIT_SECRET+"&page="+counter;
		const dataWithPage = await getJSONConvertKit(subUrlWithPage);
		//console.log(dataWithPage['subscribers']);
		//console.log("Counter - ", counter);
		for (i in dataWithPage['subscribers']){
			subDateValueOf = new Date(dataWithPage['subscribers'][i]['created_at']).valueOf()
			finalSubData[dataWithPage['subscribers'][i]['email_address']] = dataWithPage['subscribers'][i]['id']
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

async function getListOfTags(){
	//jsonVar = {api_secret: process.env.CONVERTKIT_SECRET, email: userEmail};
	//console.log(jsonVar);

	const getMethod = {
	method: 'GET', // Method itself
	}

	// make the HTTP put request using fetch api to get the list of tags
  const response = await fetch('https://api.convertkit.com/v3/tags?api_key='+process.env.CONVERTKIT_PUBLIC, getMethod);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const data = await response.json();  
  //console.log(data['tags'])

  //iterates through the tags to create a dict of tags
  tagDict = {}
  for (x in data['tags']){
    tagDict[data['tags'][x]['name']] = data['tags'][x]['id']
  };
  //console.log(tagDict)
  return tagDict;
	// fetch('https://api.convertkit.com/v3/tags?api_key='+process.env.CONVERTKIT_PUBLIC, getMethod)
	// .then(response => response.json())
	// .then(data => console.log(data)) // Manipulate the data retrieved back, if we want to do something with it
	// .catch(err => console.log(err)) // Do something with the error   	

};

async function updateUserTags(userTagPreferences, allTags, userIds){
  userId = ""
  for (x in userTagPreferences){

    if (userTagPreferences[x][0] in userIds){
      userId = userIds[userTagPreferences[x][0]];
    } 
    console.log(userTagPreferences[x][0],userTagPreferences[x][1],userTagPreferences[x][2]);
  }


}

async function main(){
  
  finalTagData = await getTagDataFromGoogleSheets()
  //console.log(finalTagData)
  tags = await getListOfTags()
  console.log(tags);
  userIds = await fetchUserIds() 
  //console.log(userIDs);
  //await updateUserTags(finalTagData, tags, userIds);
  
}
main()    