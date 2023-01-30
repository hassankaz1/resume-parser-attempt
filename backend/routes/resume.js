const express = require("express");
const pdf = require("pdf-parse")
const ExpressError = require("../expressError")
const fs = require('fs');
const path = require("path");
const { type } = require("os");
var multer = require('multer');
const PdfParse = require("pdf-parse");

let router = new express.Router();


let dataBuffer = fs.readFileSync("./resumes/Hassan_Kazi_resume_2022.pdf");


const directoryPath = path.join("", "public")


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

var upload = multer({ storage: storage }).array('file')

const counter = 0;

async function findCount(obj, name) {
    const keys = ["aws", "python", "javascript", "process", "queens", "memory", "logical", "address", "user", "spring", "honors", "graduate", "my"];
    let dataBuffer = fs.readFileSync(`./public/${name}`);

    const contents = new Set();

    await pdf(dataBuffer).then(function (data) {

        let textPDF = data.text;

        const pdfContents = textPDF.split(' ').join(',')
            .split(':').join(",")
            .split("\n").join(",")
            .split("-").join(",")
            .split("|").join(",")
            .split("(").join(",")
            .split(")").join(",")
            .split("/").join(",")
            .split("*").join(",")
            .split(",");

        // console.log(pdfContents);

        pdfContents.forEach(word => {
            contents.add(word.toLowerCase())
        });

        // console.log(contents);

        let count = 0
        keys.forEach(k => {
            if (contents.has(k)) {
                count += 1;
            }
        })

        // console.log(name)
        // console.log(`Count: ${count}`)

        obj[name] = count;

        // console.log(obj);

    });

}



//get all companies from DB
router.get("/", async function (req, res, next) {
    try {


        const filesToCheck = fs.readdirSync(directoryPath);

        const filesWithCount = {};

        const ranking = []

        for (let i = 0; i < filesToCheck.length; i++) {
            await findCount(filesWithCount, filesToCheck[i]);
        }

        keysSorted = Object.keys(filesWithCount).sort(function (a, b) { return filesWithCount[a] - filesWithCount[b] })
        console.log(filesWithCount);
        console.log(keysSorted);
        const ranked = {}
        let rank = 1
        while (rank <= keysSorted.length) {
            let idx = keysSorted.length - rank;
            let newObj = {}
            newObj[keysSorted[idx]] = filesWithCount[keysSorted[idx]];
            ranked[rank] = newObj;
            rank += 1
        }

        console.log(ranked)

        return res.json(ranked)
    } catch (err) {
        return next(err);
    }
});

router.post("/", function (req, res, next) {
    try {
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(500).json(err)
            } else if (err) {
                return res.status(500).json(err)
            }
            return res.status(200).send(req.file)

        })
    } catch (err) {
        return next(err);
    }
});


module.exports = router;