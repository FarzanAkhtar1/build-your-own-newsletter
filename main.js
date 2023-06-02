require('dotenv').config();
const fetch = require('node-fetch');


//console.log(process.env.CONVERTKIT_SECRET);
console.log("Hello world");

async function pullNewsData(){

	const resp = await fetch('');

	console.log(await resp);	

}	




async function main(){
	await pullNewsData()

}
//main()
//getUnsubDataFromGoogleSheets()
//unsubData = getUnsubDataFromGoogleSheets()

main()