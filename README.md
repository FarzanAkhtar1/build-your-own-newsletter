# Build-Your-Own Newsletter 
How I built a customisable crypto-based newsletter

Contact me on [Twitter](https://twitter.com/FarzanAkhtar1) or on [LinkedIn](https://www.linkedin.com/in/farzan-a-088644127/)

## Background
Newsletters have made a resurgence in popularity over the past few years, as people turn away from general media (TV, newspapers, news sites), they look for alternatives. And newsletters have filled this gap by providing more niche perspectives which also allows the user to pick and choose what they read by subscribing to many newsletters.

However, many areas are extremely broad (Technology, science, finance) and it can be difficult to find newsletter which only present information regarding a specific topic or area. In this case I will be exploring the blockchain and crytocurrency space which is home to hundreds of blockchains and thousands of coins/tokens across them.

The aim to to build a proof-of-concept for a newsletter which enables users to choose which blockchain news they recieve. For example, one user may only want news regarding Bitcoin, however another user may want news focusing on Ethereum, Algorand, Cardano, or any other coin. Each user will choose what tokens they want to see and only recieve news focused on that. 

## Tech stack and rationale

[Node.js](https://nodejs.org/en) (JavaScript) - The decision to use JavaScript is based on me wanting to learn a new programming language to develop my skillset from python. Javascript is also a fast language compared to Python which could prove useful if mailing lists get too large.

[Carrd](https://carrd.co/) ([Affiliate Link](https://try.carrd.co/w545yzx2)) - Carrd enables the quick creation of single-page websites with basic functionality such as collecting information via forms, and navigation (which then acts like a multi-page website). For this project, I am using the $19/year Carrd Pro Standard plan which enables features like Forms.

[ConvertKit](https://convertkit.com/) - I needed a platform to gather my subscriber list, ConvertKit allows up to 300 subscribers for free which should be enough for a proof-of-concept. The alternative to this would be to upgrade my Carrd plan which allows for custom forms and better data gathering which could replace ConvertKit.

Google [Forms](https://forms.google.com/)/[Sheets](https://sheets.google.com/) - To remove additional technical requirements fo requiring a database, a GOogle Form will be used to capture user informaiton which will be populated in a Google Sheet which will work as a makeshift database. At scale there could be problems with performance.

[SendGrid](https://sendgrid.com/) - Enables the sending of emails, supports 100 emails/day which means I may need to work on some optimisations on the email sending flow to enable maximum value. Paid plans enable more throughput.

[Azure Functions](https://azure.microsoft.com/en-gb/products/functions) - Azure Functions can be set to run on a schedule where costs are associated with run time and data requirements. If requirements are too high and the function reaches a timeout, the alternative would be a VM (virtual machine) and use a daemon to execute at a specified time.

## Cost
One of the goals of this project was to minimise the cost associated with the project. If there is opportunity to generate revenue through sponsors/affiliates then I would be willing to invest more into this project. I will outline 3 variations of costs:
1. MVP - Proof-of-concept, minimal cost, good for upto 100 subscribers
2. Validated - Same as MVP but I would pay for services like ConvertKit and SendGrid to enable scaling to 1000 subscribers
3. Large scale - Same as MVP but for 1000-3000 subscribers
4. Alternative - This would leverage Carrd Pro and potentially have higher scaling for lower costs

All costs are on a monthly basis and  assume I use the annual plans which are cheaper than the monthly plans.

| | MVP (100 subs) | Validated (100-1000) | Large scale (1000-3000) | Alternative (100-3000) |
| --- | --- | --- | --- | --- |
| Carrd | | | | |
| ConverKit | | | | |
| Google Forms/Sheets | | | | |
| SendGrid | | | | |
| Azure Functions | | | | |
| (Optional) Domain | | | | |
| Total (GBP) | | | | |
| Total (USD) | | | | |

### MVP (100 subs)
- Carrd Pro Standard - £1.35/month ($1.60/month)
- ConvertKit - Free
- Google Forms/Sheets - Free
- SendGrid - Free
- Azure Functions - £0.50/month ($0.65/month) - Liberal estimate
- (Optional) Domain - £2.50/month ($3.25/month)

Total: £1.85-£4.35/month ($2.25-$5.50/month)

### Validated (100-1000 subs)
- Carrd Pro Standard - £1.35/month ($1.60/month)
- ConvertKit - Free
- Google Forms/Sheets - Free
- SendGrid - £16.50/month ($19.95/month)
- Azure Functions - £0.50/month ($0.65/month) - Liberal estimate should still apply
- (Optional) Domain - £2.50/month ($3.25/month)

Total: £18.35-£20.85/month ($22.20-$25.45/month)

### Large scale (1000-3000 subs)
- Carrd Pro Standard - £1.35/month ($1.60/month)
- ConvertKit - £33.50/month ($41/month)
- Google Forms/Sheets - Free
- SendGrid - £28.90/month ($34.95/month)
- Azure Functions - £0.50/month ($0.65/month) - Liberal estimate should still apply
- (Optional) Domain - £2.50/month ($3.25/month)

Total: £64.25-£66.75/month ($78.20-$81.45/month)

### Alternative (100-3000 subs)
- Carrd Pro Plus - £3.35/month ($4.10/month)
- Google Forms/Sheets - Free
- SendGrid - £16.50-£28.90/month ($19.95-$34.95/month)
- Azure Functions - £0.50/month ($0.65/month) - Liberal estimate should still apply
- (Optional) Domain - £2.50/month ($3.25/month)

Total: £20.35-£35.25/month ($24.70-$42.95/month)


## User Flows

### User Subscription Flow
Flow outlining how parts of the system will interact when the user is subscribing to the newsletter
![alt text](https://github.com/FarzanAkhtar1/build-your-own-newsletter/blob/main/UML%20Diagrams/Subscribe%20flow.jpg)

### Daily Email Flow
Flow outlining how parts of the system will interact when sending out the daily email
![alt text](https://github.com/FarzanAkhtar1/build-your-own-newsletter/blob/main/UML%20Diagrams/Email%20flow.jpg)

