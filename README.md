some practice to make use of poe-api-manager library<br>
npm package repo : https://github.com/ayberkgezer/poe-api-manager<br>
looking for ideas to make an addon out of this
PoE Item Price Fetcher
This project is a simple web-based application for fetching item prices from the Path of Exile (PoE) economy using the poe-api-manager. The application allows users to search for items by name and retrieve their current Chaos or Divine Orb value. It also provides a basic web UI for users to interact with.

Features
Fetch Current Chaos Value: Get the equivalent Chaos Orb value of a Divine Orb.
Search for Item Prices: Search for PoE items by name and retrieve their current price in Chaos Orbs or Divine Orbs.
Search History: Keeps track of recently searched items in a history panel.
Interactive Web UI: Simple and intuitive web interface for users to interact with the API.
Prerequisites
Ensure you have the following installed:

Node.js (v14.x or later)
npm (Node Package Manager)
You can install the required npm packages by running:

bash
Kodu kopyala
npm install express path poe-api-manager
How to Run
Clone the repository:

bash
Kodu kopyala
git clone https://github.com/muriarty1893/web_UI_for_PoE_api.git
cd web_UI_for_PoE_api
Install dependencies:

bash
Kodu kopyala
npm install
Start the server:

bash
Kodu kopyala
node index.js
Open your web browser and navigate to http://localhost:3000.

Project Structure
index.js: The main server file that sets up Express routes for fetching item prices and Chaos Orb values.
index.html: The main HTML file for the web UI, including inline CSS for styling and JavaScript for handling user interactions.
style.css: (Optional) If you choose to separate the CSS from the HTML file, it can be moved here.
poe-api-manager: A Node.js package that interfaces with the Path of Exile's Ninja API.
API Endpoints
GET /: Serves the main HTML page.
GET /fetch-chaos-value: Fetches the current Chaos Orb value of a Divine Orb.
GET /fetch-item-price?iname=<item_name>: Fetches the price of an item by its name. If the exact item is not found, it suggests similar items.
Example Usage
Fetching Chaos Value
The endpoint /fetch-chaos-value returns the current Chaos Orb value for a Divine Orb in JSON format:

json
Kodu kopyala
{
  "success": true,
  "chaosValue": 150
}
Searching for an Item
When searching for an item by name using the form on the main page, the item’s price and modifiers are displayed:

json
Kodu kopyala
{
  "success": true,
  "data": {
    "name": "Headhunter",
    "divineValue": 1.5,
    "explicitModifiers": [
        "+40% to Chaos Resistance",
        "Adds 12 to 20 Chaos Damage"
    ],
    "icon": "https://www.poewiki.net/images/e/ee/Headhunter_inventory_icon.png"
  }
}
If no exact match is found, the API suggests similar items.

License
This project is licensed under the MIT License.
