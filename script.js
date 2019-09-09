const fs = require("fs");
const Piranhax = require("piranhax");
require('dotenv').config();

// Prompt
const prompt = require('prompt');

const amazonFirst = "<!DOCTYPE html><html><head><title>Amazon Front Page</title><link rel='stylesheet' href='style.css'></head><body><p style='text-align: center;'><a href='https://hssonline.org/resources/isis-books-received/'>Previous <em>Isis</em> Books Received Lists</a></p><h3 style='text-align: center;'><strong>Click the book to learn more</strong></h3><div class='ama-body-container'>";

//Complete file with closing tags and affiliate warning
const amazonLast = "</div><em>By arrangement with Amazon.com, Web users can benefit the Society while purchasing titles currently listed in the Amazon catalog. Each book (or any other kind of merchandise) bought from Amazon using an HSS link or the HSS search box will earn the Society up to 5% of the purchase price. We offer this opportunity as a service to our many Web users, and to help support the costs of our growing Web presence.</em></body></html>";

fs.writeFile("index.html", amazonFirst, function (err, amazonFirst) {
    if (err) console.log(err);
    console.log("Created the HTML file and entered initial information...");
});

// Enter raw list of ISBNs
let rawList = "Maimonides On the Regimen of Health,Maimonides On the Regimen of Health";

// Split ISBNs into a new array
const amaISBN = (/,/.test(rawList)) ? rawList.split(',') : rawList;
console.log(amaISBN)
// Enter Amazon Associate Information
const client = new Piranhax(process.env.AMAZON_ACCESS, process.env.AMAZON_SECRET, "historyofscie-20");

// Define errors
let bookErrors = [];


// To loop through ISBNs and get info from Amazon via ItemSearch
function amaLoop(amaISBN, callback) {

    for (let i = 0; i < amaISBN.length; i++) {
        (function (i) {
            setTimeout(function () {

                client.ItemSearch("Books", {
                    Keywords: amaISBN[i],
                    ResponseGroup: ["Images", "ItemAttributes"]


                }).then(results => {



                    // Define info
                    let url = await results.get("Item.DetailPageURL");
                    let image = await results.get("Item.LargeImage.URL");
                    let title = await results.get("Item.ItemAttributes.Title");
                    let titleIndex = " ' " + title + " ' ";
                    let author = await results.get("Item.ItemAttributes.Author");
                    let publisher = await results.get("Item.ItemAttributes.Publisher");
                    let pubDate = await results.get("Item.ItemAttributes.PublicationDate");
                    let isbn = await results.get("Item.ItemAttributes.ISBN");
                    let pages = results.get("Item.ItemAttributes.NumberOfPages");

                    if (author === undefined) {
                        var newAuthor = "";
                    } else {
                        var newAuthor = author;
                    }

                    if (publisher === undefined) {
                        var newPub = "";
                    } else {
                        var newPub = publisher;
                    }

                    if (pubDate === undefined) {
                        var pubYear = "";
                    } else {
                        var pubYear = pubDate.substring(0, 4);
                    }

                    // Define HTML
                    let amazon = (title + "," + author + "," + image + "," + url);

                    let amazonBody = ` <div class="ama-body-item"><a class="ama-body-link" href="${url}" target="_blank" rel="noreferrer"><img class="ama-body-image" src="${image}" alt="${title}"></a></div>`;
                    let memberNewsText = `📚 Title: ${title}\nLink: ${url}\nImage Link: ${image}\n`

                    fs.appendFile("index.html", amazonBody, function (err, amazonBody) {
                        if (err) console.log(err);
                        console.log("Writing HTML for: " + title + " | ISBN: " + isbn + " | " + (i + 1) + " of " + amaISBN.length);
                    });

                    fs.appendFile("member news.txt", memberNewsText, function (err, amazonBody) {
                        if (err) console.log(err);
                    });

                    if (i == (amaISBN.length - 1)) {
                        callback();
                    }

                }).catch(err => {
                    console.log(err, "Oh shit! " + amaISBN[i] + " did not write!")
                    bookErrors.push(amaISBN[i]);
                })
            }, 1000 * i);
        })(i);
    };

}

function finishIt() {

    fs.appendFile("index.html", amazonLast, function (err, amazonLast) {
        if (err) console.log(err);
        console.log("Putting those dope final touches on the file...");
        console.log(`These titles didn't write ${bookErrors}`);
    });
}



amaLoop(amaISBN, finishIt);