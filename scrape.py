import requests
import os
from dotenv import load_dotenv

load_dotenv()

f = open("scrape.txt", "w")
g = open("scrape.html", "w")

URL = os.getenv('TEST_SITE')
page = requests.get(URL)
print(page.text)
f.write(page.text)
f.close()
g.write(page.text)
g.close()


f = open("scrapeRedirect.txt", "w")
g = open("scrapeRedirect.txt", "w")
URL = os.getenv('REDIRECT')
page = requests.get(URL)
print(page.text)
f.write(page.text)
f.close()
g.write(page.text)
g.close()