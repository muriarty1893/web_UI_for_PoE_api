const express = require("express");
const path = require("path");
const { NinjaAPI, WatchAPI } = require("poe-api-manager");
const app = express();
const port = 3000;

const ninjaAPI = new NinjaAPI("Standard");
const requestedProperties = ["id", "name", "divineValue", "explicitModifiers", "icon"];

// Kök URL'de index.html dosyasını sun
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/fetch-item-price", async (req, res) => {
    const iname = req.query.iname || "Mageblood";

    try {
        const theItem = await ninjaAPI.itemView.uniqueAccessory.getData(requestedProperties);
        const itemOut = theItem.find(item => item.name === iname);

        if (itemOut) {
            res.json({ success: true, data: itemOut });
        } else {
            res.json({ success: false, message: `${iname} not found.` });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
