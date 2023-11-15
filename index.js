const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const multer = require('multer');
// const { multerMiddleware } = require('./middlewares/storage.middleware');
const { Files, Links } = require('./confing');

const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// STORAGE
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'storage');
    },
    filename: async function (req, file, cb) {
        const ext = file.originalname.split(".").pop();
        const file_name = `${file.fieldname}-${Date.now()}.${ext}`;
        const fileNew = new Files({ name:file_name, read:false, group_name:`${file.originalname}`});
        
        try {            
            await fileNew.save();
            console.log('new file creado');
        } catch (error) {
            console.log(error);
        }

        cb(null, file_name)
    }
})

const upload = multer({storage:storage});

app.post('/file', upload.single('file'), async (req, res) => {
    try {
        const group = req.body.group;
        
        const files = await Files.findOne({ read:false });
        if(!files) {
            console.log('NOT_FILE');
            return;
        }

        const file = `${__dirname}/storage/${files.name}`;
        fs.readFile(file, 'utf8', async (err, data) => {
            if(err) {
                console.log(err);
                console.log('ERROR_READ');
                return res.status(400).json({res:'file no encontrado'})
            }
            const palabras = [];
            const dataAll = data.split('chat.whatsapp.com');
            dataAll.map(async (key, i) => {
                const key_ch = key.split('https://chat.whatsapp.com/')[1].substring(0,22);
                const link_url = await Links.findOne({ url: key_ch }).exec();

                if(link_url) { return console.log('existe', i) }
                if(link_url === 'ESlj7vd7b4KEANY9RZRvSe') return;
                console.log('entonces', i)
                if(item.url === 'DBMCOLDedkFDHV5BdxRvHq') return console.log('Florida Conecta'); //1
                if(item.url === 'JWI0bRPuSzJ5WWESNOxNWu') return console.log('Negocios Miami');   //2
                if(item.url === 'G5oy2HkiWmC15WgIqQpnkP') return console.log('Imparables');       //3
                if(item.url === '') return console.log('Clasificados Florida');                   //4
                if(item.url === 'EeR3VBYnzTs38Etv82WKA') return console.log('Clasificados Orlando');//5
                if(item.url === 'DTZA6pNU03jDu7mVGJCtrh') return console.log('Empleos Florida');//6
                if(item.url === 'F1NNMFTTkui7Y5T0pYKTM3') return console.log('FloriLinks');//7
                if(item.url === 'F8ovoS7Mxek9hACjY5Hpn4') return console.log('LatinX');//8
                if(item.url === 'He9Rf4aEs9OB1c05D1ypwu') return console.log('Clasificados Orlando');//9
                const toSaveUrl = new Links({ url:key_ch, status:1 });
                await toSaveUrl.save();
                console.log(i);
                palabras.push(key_ch);
            });
            
            return res.status(200).json({response:'SUCCESS',total:palabras.length});
        })
    } catch (error) {
        console.log(error);
        return res.json('error');
    }
})

app.get('/file', async (req, res) => {
    const page = `${req.query.page}`;
    const sk = parseInt(page) * 10;
    const urls = await Links.find().skip(sk).limit(10);
    const algo = {body:urls}
    console.log(algo)
    return res.json(algo);
})

const port = process.env.PORT || 7654;

app.listen(port, (err, res) => {
    if (err) {
        console.log(err)
        return res.status(500).send(err.message)
    } else {
        console.log('[INFO] Server Running on port:', port)
    }
})


