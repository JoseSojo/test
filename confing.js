const mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://jsojo346:j28*Sojo@cluster0.df9wohf.mongodb.net/`)
    .then(() => console.log('MONGOOSE_RUN'))
    .catch(() => console.log('ERROR_MONGO'))

// MODELS
const LinksSchema = new mongoose.Schema({
    url: String,
    status: Number
});

const Links = mongoose.model('myurls', LinksSchema);

const FilesSchema = new mongoose.Schema({
    name: String,
    read: Boolean,
    group_name: String
});

const Files = mongoose.model('myfiles', FilesSchema);

module.exports = { Links, Files }
