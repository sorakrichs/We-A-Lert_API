const cfg_mongodb = () => {

    const hostname = process.env.MONGODB_HOSTNAME;
    const username = process.env.MONGODB_USERNAME;
    const password = process.env.MONGODB_PASSWORD;
    const database = process.env.MONGODB_DATABASE;
    const MONGODB_URI = process.env.MONGODB_URI;


    if(typeof MONGODB_URI == 'string' && MONGODB_URI) {
        return MONGODB_URI;
    }
    else if(
        typeof hostname == 'string' && hostname &&
        typeof username == 'string' && username &&
        typeof password == 'string' && password &&
        typeof database == 'string' && database
    ) {
        return `mongodb+srv://${encodeURI(username)}:${encodeURI(password)}@${hostname}/${database}?retryWrites=true&w=majority`;
    }
    else {
        return `mongodb+srv://Masmelon:Z-h-4MGPaS8B9rq@cluster0.bl8vo.mongodb.net/wealert?retryWrites=true&w=majority`;
    }
}

module.exports = cfg_mongodb();