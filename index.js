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
        const fileNew = new Files({name:file_name,read:false});
        
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
        const files = await Files.findOne({ read:false });
        if(!files) {
            console.log('NOT_FILE');
            return;
        }

        console.log('filess', files);
        const file = `${__dirname}/storage/${files.name}`;
        fs.readFile(file, 'utf8', async (err, data) => {
            if(err) {
                console.log(err);
                console.log('ERROR_READ');
                return res.status(400).json({res:'file no encontrado'})
            }
            const palabras = [];
            const dataAll = data.split(' ');
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
    const sk = parseInt(page) * 100;
    const urls = await Links.find().skip(sk).limit(100);
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


