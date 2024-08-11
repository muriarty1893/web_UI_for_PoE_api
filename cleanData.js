const fs = require("fs");
const csvParser = require("csv-parser");

function cleanData(inputFile, outputFile) {
    const cleanedData = [];

    fs.createReadStream(inputFile)
        .pipe(csvParser())
        .on("data", (row) => {
            // Filtreleme kriterleri:
            const divineValue = parseFloat(row["DIVINE VALUE"]);
            const chaosValue = parseFloat(row["CHAOS VALUE"]);

            // Eğer divineValue veya chaosValue NaN ise veriyi atla
            //if (isNaN(divineValue) || isNaN(chaosValue)) return;

            // Nadir eşyalar veya çok düşük fiyatlı olanları filtrele
            if (divineValue > 0 || chaosValue >= 10) {
                cleanedData.push(row);
            }
        })
        .on("end", () => {
            // Temizlenmiş veriyi yeni bir dosyaya yaz
            const csvWriter = require("csv-writer").createObjectCsvWriter({
                path: outputFile,
                header: [
                    { id: "name", title: "NAME" },
                    { id: "divineValue", title: "DIVINE VALUE" },
                    { id: "chaosValue", title: "CHAOS VALUE" },
                    { id: "explicitModifiers", title: "EXPLICIT MODIFIERS" },
                ],
            });

            csvWriter.writeRecords(cleanedData).then(() => {
                console.log("Veri temizleme tamamlandı. Temizlenmiş veri kaydedildi.");
            });
        });
}

// Veri temizleme işlemini çağırmak için:
cleanData("poe_item_data.csv", "poe_item_data_cleaned.csv");
