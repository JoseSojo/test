const multer = require("multer");
const { Files } = require('../confing');

const PATH_STORAGE = `${process.cwd()}/src/files`;

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, PATH_STORAGE);
    },
    async filename(req, file, cb) {
        const ext = file.originalname.split(".").pop();
        const fileNameRandom = `file-${Date.now()}.${ext}`;
        const fileNew = new Files({name:fileNameRandom,read:false});
        try {            
            await fileNew.save();
        } catch (error) {
            console.log(error);
        }
        cb(null, fileNameRandom);
    }
});

const multerMiddleware = multer({ storage });


module.exports = { multerMiddleware};
