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
};  

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
      };
      //console.log(preferences)
      finalTagData.push([userTagData[entries][2],tagDateValueOf,preferences])
    };	
    //console.log (finalTagData);
    return finalTagData;
};

function tagUser(email, preference){

};

function untagUser(email, preference){
  console.log(email, preference)

};

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
  };
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
    } catch (error) {
      // Handle any errors that occurred during the process
      console.error('Error:', error);
    };
};

async function getListOfTagsFromConvertKit(userId){
	//jsonVar = {api_secret: process.env.CONVERTKIT_SECRET, email: userEmail};
	//console.log(jsonVar);

	const getMethod = {
	method: 'GET', // Method itself
	}

	// make the HTTP put request using fetch api to get the list of tags
  const response = await fetch('https://api.convertkit.com/v3/subscribers/'+ userId + "/tags?api_key=" + process.env.CONVERTKIT_PUBLIC, getMethod);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const data = await response.json();  
  //console.log(data)

  //iterates through the tags to create a dict of tags
  tagDict = {}
  for (z in data['tags']){
    tagDict[data['tags'][z]['name']] = data['tags'][z]['id']
  };
  //console.log(tagDict)
  //console.log(tagDict)
  return tagDict;
	// fetch('https://api.convertkit.com/v3/tags?api_key='+process.env.CONVERTKIT_PUBLIC, getMethod)
	// .then(response => response.json())
	// .then(data => console.log(data)) // Manipulate the data retrieved back, if we want to do something with it
	// .catch(err => console.log(err)) // Do something with the error   	

};

async function getListOfTags(){
	//jsonVar = {api_secret: process.env.CONVERTKIT_SECRET, email: userEmail};
	//console.log(jsonVar);

	const getMethod = {
	method: 'GET' // Method itself
	};

	// make the HTTP put request using fetch api to get the list of tags
  const response = await fetch('https://api.convertkit.com/v3/tags?api_key='+process.env.CONVERTKIT_PUBLIC, getMethod);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  };
  const data = await response.json();  
  //console.log(data['tags'])

  //iterates through the tags to create a dict of tags
  tagDict = {}
  for (x in data['tags']){
    tagDict[data['tags'][x]['name']] = data['tags'][x]['id']
  };
  //console.log(tagDict)
  return tagDict;
};

async function updateUserTags(userTagPreferences, userIds, allTags){
  for (x in userTagPreferences){

    var userId = userIds[userTagPreferences[x][0]]
    //console.log("---- ", x, userIds[userTagPreferences[x][0]])
    if ((userTagPreferences[x][1] > Date.now()-172800000) && (userTagPreferences[x][0] in userIds)){//If the user's request is less than 2 days old (86400000 = 1 day) and they are a subscriber
      //console.log(x,"In", userTagPreferences[x], userIds, userId )
      //console.log("User ID", userId)
      tagsFromConvertKit = await getListOfTagsFromConvertKit(userId); //Get their tags from convertkit

      //Untag user flow
      for (y in tagsFromConvertKit){ //For every tag the user currently has
        //console.log(y, userTagPreferences[x][2])
        if (y in userTagPreferences[x][2] == false){ //If the tag is not in their updated preferences then... 
          console.log("Untag user",userTagPreferences[x][0], y, tagsFromConvertKit[y]) //remove that tag from the user
          //untagUser(userTagPreferences[x][0],tagsFromConvertKit[y]) //need to write untag function
        };
      };

      //Tag user flow
      for (y in userTagPreferences[x][2]){ //For every tag the user wants
        //console.log(userTagPreferences[x][2])
        //console.log(y, tagsFromConvertKit, userTagPreferences[x][2][y])
        if (userTagPreferences[x][2][y] in tagsFromConvertKit == false){ //If the tag is not in their current prefences

          console.log("Tag user", userTagPreferences[x][0], userTagPreferences[x][2][y], allTags[userTagPreferences[x][2][y]]) //tag the user
          //tagUser() //need to write tag function
        };
      };
    };
  };
};



async function main(){
  //getListOfTagsFromConvertKit(2180605535)
  finalTagData = await getTagDataFromGoogleSheets()
  //console.log(finalTagData)
  userIds = await fetchUserIds() 
  tags = await getListOfTags()
  //console.log(userIDs);
  //console.log(finalTagData)
  //console.log(userIds)
  await updateUserTags(finalTagData, userIds, tags);
  
}
main()    