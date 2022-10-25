const eng_dotenv = () => {


    const envFile = require("dotenv").config();


    if (envFile.error) {
        throw envFile.error
    } else {
        return true;
    }


}

module.exports = eng_dotenv;