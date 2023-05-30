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
        //console.log(preferences)
		finalTagData.push([userTagData[entries][2],tagDateValueOf,preferences])
    }	
	//console.log (finalTagData);
	return finalTagData;
};



async function main(){
    finalTagData = await getTagDataFromGoogleSheets()
    console.log(finalTagData)
}
main()    