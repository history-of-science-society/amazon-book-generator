const fs = require("fs");

const Piranhax = require("piranhax")
const client = new Piranhax("AKIAIZH47RTGQEYBCHTA", "8vM2bm25h8t+GWst0s+kvx7Ju5IBuSj7No6lpRJR", "historyofscie-20");
const amaISBN = ["0198794983","0520293398","022651644X","022651045X","0231175019","022650705X","1780238517","146963287X","0674737334"]




var i;
for (i = 0; i < amaISBN.length; i++) {
client.ItemSearch("Books", {
    Keywords: amaISBN[i],
    ResponseGroup: ["Images", "ItemAttributes"]
}).then(results => {
    // results is a response object, see below for further information.
    //    console.log(results.data())

    // get first item ASIN
    let url = results.get("Item.DetailPageURL")
    let image = results.get("Item.LargeImage.URL")
    let title = results.get("Item.ItemAttributes.Title")
    let author = results.get("Item.ItemAttributes.Author")

    let amazon = (title + "," + author + "," + image + "," + url);
    let amazonContainerFirst = "<div class='ama-fp-container'>"
    let amazonContainerLast = "</div>"
    let amazonBody = " <div class='ama-body-item'><a class='ama-body-link' href=' " + url + "' target='_blank' rel='noreferrer' title=' " + title + " by " + author + " '><img class='ama-fp-image' src=' " + image + " ' alt=' " + title + " ' ></a><a class='ama-body-link' href=' " + url + "' target='_blank' rel='noreferrer' title='Explore this title'><h2>"+author+"</h2><em>"+ title+"</em></a></div>";

    fs.appendFile("ama-body.text", amazonBody, function (err, amazonBody) {
        if (err) console.log(err);
        console.log("I wrote it bitch");
    });
}).catch(err => {
    console.log("Why error?", err)
})


}

