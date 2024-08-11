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
        const itemTypes = [
            ninjaAPI.itemView.uniqueAccessory,
            ninjaAPI.itemView.uniqueArmour,
            ninjaAPI.itemView.uniqueFlask,
            ninjaAPI.itemView.uniqueJewel,
            ninjaAPI.itemView.uniqueWeapon,  
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

app.get("/collect-data", async (req, res) => {
    try {
        const itemTypes = [
            ninjaAPI.itemView.uniqueAccessory,
            ninjaAPI.itemView.uniqueArmour,
            ninjaAPI.itemView.uniqueFlask,
            ninjaAPI.itemView.uniqueJewel,
            ninjaAPI.itemView.uniqueWeapon,
        ];

        let allItems = [];

        for (const itemType of itemTypes) {
            const items = await itemType.getData([
                "id", "name", "divineValue", "chaosValue", "explicitModifiers", "icon"
            ]);

            // explicitModifiers'ı metne dönüştür
            items.forEach(item => {
                item.explicitModifiers = item.explicitModifiers
                    .map(mod => `${mod.text} (${mod.optionalStat || ''})`)
                    .join(", ");
            });

            allItems = allItems.concat(items);
        }

        // Veri setini kaydetme işlemi - örneğin CSV formatında
        const csvWriter = require("csv-writer").createObjectCsvWriter({
            path: "poe_item_data.csv",
            header: [
                { id: "name", title: "NAME" },
                { id: "divineValue", title: "DIVINE VALUE" },
                { id: "chaosValue", title: "CHAOS VALUE" },
                { id: "explicitModifiers", title: "EXPLICIT MODIFIERS" },
            ],
        });

        await csvWriter.writeRecords(allItems);

        res.json({ success: true, message: "Veri başarıyla toplandı ve kaydedildi." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
