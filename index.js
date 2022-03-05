var express = require('express');
var app = express();
var cors = require('cors');
var axios = require('axios')

app.use(cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));


const startMint = async (formDataFormat) => {

    console.log("mint function calles");
    // let formDataFormat = {
    //     "img_bin": `${image}`,
    //     "user_pub_key": `${publicKey}`,
    //     "get_eye": "eye",
    //     "get_nose": "nose",
    //     "get_mouth": "mouth",
    //     "get_outfit": "outfit",
    //     "nft_number": `${nftNumber}`,
    //     "phone_number": `${phoneNumber}`
    // }

    //console.log(formDataFormat);

    try {
        url = 'https://api.ahrtribe.com/api/echo-json';
        let res = await axios({
            method: 'post',
            url: url,
            timeout: 60 * 4 * 1000, // Let's say you want to wait at least 180 seconds
            data: formDataFormat,
            headers: {
                'Access-Control-Allow-Origin': '*',
                "Content-Type": "application/json"
            }
        })
        console.log(res.data.transaction);
        console.log("mint function finished");
        return res.data.transaction;
    }
    catch (er) {
        console.log(er);
        console.log("mint function failed xxx");
    }

}

app.get('/', (req, res) => {
    res.send("server running");
})

app.post('/startmint', async (req, res) => {
    //console.log(req.body);
    res.json({ status: "mint started" });
    let tx = await startMint(req.body);
    if (tx) {
        console.log("started tx capture");
        try {
            let res = await axios.post('https://ahrtribe.com/api/capturetx',
                {
                    phone: req.body.phone_number,
                    url: tx
                })
            if (res.data.status == 'ok') {
                console.log("tx capture sucess");
            }
            else {
                console.log("tx capture failed xxxxxxx");
            }
        }
        catch(er){
            console.log(er);
        }
    }
})

app.listen(8080, () => {
    console.log("server started");
})

