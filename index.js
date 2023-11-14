const express = require('express');
const cors = require('cors');
const fs = require('fs');
const {multerMiddleware} = require('./middlewares/storage.middleware');
const { Files, Links } = require('./confing');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Express JS on Vercel');
})

app.get('/ping', (req, res) => {
    res.send('pong 🏓');
})

app.post('/url', multerMiddleware.single('file'), async (req, res) => {
    try {
        const files = await Files.findOne({ read:false });
        if(!files) {
            console.log('NOT_FILE');
            return;
        }
        const file = `${__dirname}/files/file-1699920511596.txt`;
        fs.readFile(file, 'utf8', async (err, data) => {
            if(err) {
                console.log(err);
                console.log('ERROR_READ');
                return res.status(400).json({res:'file no encontrado'})
            }
            const palabras = [];
            const dataAll = data.split(' ');
            console.log('palabras en bruto', dataAll.length);
            dataAll.map(async (key) => {
                if(key.includes('chat.whatsapp.com')) {
                    let item = `http${key.split('http')[1]}`;
                    
                    const link_url = await Links.findOne({ url: Links });
                    if(!link_url) {
                        const toSaveUrl = new Links({ url:item, status:1 });
                        await toSaveUrl.save();
                        palabras.push(item);
                    }
                    
                }
            })

            
            return res.json({response:'SUCCESS',total:palabras.length,body:palabras});
        })
    } catch (error) {
        console.log(error);
        return res.json('error');
    }
})

app.get('/url', async (req, res) => {
    const page = `${req.query.page}`;
    const sk = parseInt(page) * 100;
    const urls = await Links.find().skip(sk).limit(100);
    return res.json({body:urls});
})

const port = process.env.PORT || 8080;

app.listen(port, (err, res) => {
    if (err) {
        console.log(err)
        return res.status(500).send(err.message)
    } else {
        console.log('[INFO] Server Running on port:', port)
    }
})


