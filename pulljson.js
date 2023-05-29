require('dotenv').config();
const fetch = require('node-fetch');


async function getJSON(url) {
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
  
  async function main() {

    //GET UNSUB DATA FROM CONVERTKIT
    // unsubData = ""
    // try {
    //   const unsubUrl = process.env.UNSUBSCRIBE_FORM;
    //   const data = await getJSON(unsubUrl);
    //   // Handle the JSON data here
    //   unsubData = data; //UNSUB DATA IS STORED IN unsubData
    // } catch (error) {
    //   // Handle any errors that occurred during the process
    //   console.error('Error:', error);
    // }

    // //ITERATE THROUGH unsubData
    // for (entries in unsubData){
    //     entry = unsubData[entries]['Timestamp'];
    //     console.log(entry);
    // }

    //DATE MANIPULATION FOR UNSUB DATA
    DD = unsubDate.slice(0,2);
    MM = unsubDate.slice(3,5);
    YY = unsubDate.slice(6,10);
    hh = unsubDate.slice(11,13);
    mm = unsubDate.slice(14,16);
    ss = unsubDate.slice(17,19);
    console.log("asdasa    " + DD, MM, YY, hh, mm, ss)
    reg = new RegExp('/'); //"/\//g"
    unsubDate = YY + "-" + MM + "-" + DD + "T" + hh + ":" + mm + ":" + ss + ".000Z";
    console.log(unsubDate)
    date1 = new Date(unsubDate);    



    //PULL SUBSCRIBER LIST FROM CONVERTKIT
    subData = ""
    try {
      const subUrl = "https://api.convertkit.com/v3/subscribers?api_secret="+process.env.CONVERTKIT_SECRET;
      const data = await getJSON(subUrl);
      // Handle the JSON data here

      // subDate time handle
      console.log(data['page']);
      console.log(data['subscribers'][0]['created_at'])
      subDate = new Date(data['subscribers'][0]['created_at']);
      console.log(date1.valueOf());


      //FOR LOOP TO ITERATE THROUGH PAGES
    //   for (counter = 1; counter <= data['total_pages']; counter++){
    //     }

      console.log("asda");
      subData = data; //UNSUB DATA IS STORED IN unsubData
    } catch (error) {
      // Handle any errors that occurred during the process
      console.error('Error:', error);
    }

    //ITERATE THROUGH subData
    // for (entries in subData){
    //     entry = subData[entries]['Timestamp'];
    //     console.log(entry);
    // }
    //UNSUB USERS FROM CONVERTKIT


  }
  
  // Call the async function to start the process
  main();