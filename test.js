const fs = require('fs')
fs.readFile('testhtml.txt', (err, inputD) => {
  names = ['Bitcoin','Solana']
	ticker = ['BTC', 'SOL']
  coins = names
  for (y in coins){
   if (err) throw err;
      html = inputD.toString();
      //console.log(html)
      html = html.replace(/<form class="njs" action="\/h\/ajax\/fredir" method="GET">.*/g,"")
      html = html.split(/view more headlines.*/g)[0]
      html = html.replace("Earlier today","")	
      //console.log(html)      
      var newhtml = html.match(/<a class="hll".*<i class.*\d{2}:\d{2}/g)
      //console.log(newhtml)
      urlAndHeadline = []

      for (x in newhtml){
        item = newhtml[x]
        
        date = item.substr(-5)

        item = item.replace("<a class=","")
        item = item.replace('"hll" href="',"")
        item = item.replace("</a>","")
        //console.log(item)
        

        publisher = item.replace(/.*data-pub="/,"")
        publisher = publisher.replace(/">.*/,"")
        //console.log(publisher)

        url = item.replace(/" target.*/,"")
        url = url.replace(/-:/,"-")
        //console.log(url)
        
        headline = item.replace(/.*"nofollow">/,"")
        //console.log(headline)

        headline = headline.replace(/<span class="hlsh">/," ")
        // console.log(headline)
        headline = headline.replace(/<\/span>/," ")
        // console.log(headline)
        headline = headline.replace(/<span.*/,"")
        // console.log(headline)        
        headline = headline.trim()
        // console.log(headline)
        //console.log("")
        
        newsData = [publisher, date, url, headline] 
        //console.log(newsData)
        //console.log(newsData)        

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
            (newsData[3].toUpperCase()).includes("DIP") ||
            (newsData[3].toUpperCase()).includes("BUY") ||
            (newsData[3].toUpperCase()).includes("SELL") ||
            (newsData[3].toUpperCase()).includes("INSIDE BITCOIN") ||
            (newsData[3].toUpperCase()).includes("TECHNICAL") //||
            //!((/\d{2}:\d{2}/g).test(newsData[2]))
            // !(newsData[3].includes(coins[y])) ||
            // !(newsData[3].includes(tickers[y]))
            ){
            //console.log("Dirty -", newsData[3], newsData[0], newsData[1])
        }else{
            urlAndHeadline.push(newsData)
            console.log("Clean -", newsData[3], newsData[0], newsData[1])

        }        
      }
      // console.log(urlAndHeadline)
      // newsOfEachCoin = urlAndHeadline

      // for (y in newsOfEachCoin){
      //   console.log(newsOfEachCoin[x])
      }
}
)