const express = require("express");
const path = require("path");
const { NinjaAPI } = require("poe-api-manager");
const app = express();
const port = 3000;

const ninjaAPI = new NinjaAPI("Settlers");

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/fetch-chaos-value", async (req, res) => {
    try {
        const chaosValueData = await ninjaAPI.currencyView.currency.getQuickCurrency("Divine Orb");
        const chaosValue = chaosValueData.chaosEquivalent;
        res.json({ success: true, chaosValue });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get("/fetch-item-price", async (req, res) => {
    const iname = req.query.iname.toLowerCase().trim(); 

    try {
        // Tüm itemleri aramak için aşağıdaki item kategorilerini ekledik
        const itemTypes = [
            ninjaAPI.itemView.uniqueAccessory,
            ninjaAPI.itemView.uniqueArmour,
            ninjaAPI.itemView.uniqueFlask,
            ninjaAPI.itemView.uniqueJewel,
            ninjaAPI.itemView.uniqueWeapon,
            // Diğer item kategorilerini de ekleyebilirsin
        ];

        let itemOut = null;
        let similarItems = [];

        for (const itemType of itemTypes) {
            const items = await itemType.getData(["id", "name", "divineValue", "explicitModifiers", "icon", "chaosValue"]);
            itemOut = items.find(item => item.name.toLowerCase() === iname);

            if (itemOut) break;
            
            similarItems = similarItems.concat(items.filter(item => item.name.toLowerCase().includes(iname)));
        }

        if (itemOut) {
            res.json({ success: true, data: itemOut });
        } else if (similarItems.length > 0) {
            res.json({ success: true, message: `Item not found. Did you mean one of these?`, data: similarItems });
        } else {
            res.json({ success: false, message: `${req.query.iname} not found.` });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
