const express = require("express");
const path = require("path");
const { NinjaAPI } = require("poe-api-manager");
const app = express();
const port = 3000;

const ninjaAPI = new NinjaAPI("Settlers");

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/fetch-item-price", async (req, res) => {
    const iname = req.query.iname.toLowerCase().trim(); 

    try {
        const theItem = await ninjaAPI.itemView.uniqueAccessory.getData(["id", "name", "divineValue", "explicitModifiers", "icon"]);

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

app.get("/fetch-chaos-value", async (req, res) => {
    try {
        const chaosValue = await ninjaAPI.currencyView.currency.getQuickCurrency("Divine Orb");
        res.json({ success: true, chaosValue });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
