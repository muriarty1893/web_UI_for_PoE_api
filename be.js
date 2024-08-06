// backend
const express = require("express");
const path = require("path");
const { NinjaAPI, WatchAPI } = require("poe-api-manager");
const app = express();
const port = 3000;

const ninjaAPI = new NinjaAPI("Settlers");
const requestedProperties = ["id", "name", "divineValue", "explicitModifiers", "icon"];

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/fetch-item-price", async (req, res) => {
    const iname = req.query.iname.toLowerCase().trim(); 

    try {
        const theItem = await ninjaAPI.itemView.uniqueAccessory.getData(requestedProperties);

        const itemOut = theItem.find(item => item.name.toLowerCase() === iname);

        if (itemOut) {
            res.json({ success: true, data: itemOut });
        } else {

            const similarItems = theItem.filter(item => item.name.toLowerCase().includes(iname));
            if (similarItems.length > 0) {
                res.json({ success: true, message: `Item not found. Did you mean one of these?`, data: similarItems });
            } else {
                res.json({ success: false, message: `${req.query.iname} not found.` });
            }
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
