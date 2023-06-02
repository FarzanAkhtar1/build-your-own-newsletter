import requests
import os
from dotenv import load_dotenv

load_dotenv()

f = open("scrape.txt", "a")
URL = os.getenv('TEST_SITE')
page = requests.get(URL)
print(page.text)
f.write(page.text)
f.close()

f = open("scrapeRedirect.txt", "a")
URL = os.getenv('REDIRECT')
page = requests.get(URL)
print(page.text)
f.write(page.text)
f.close()