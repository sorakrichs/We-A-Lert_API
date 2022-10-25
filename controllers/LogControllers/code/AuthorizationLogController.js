
const fs = require('fs')


const loginLogController = async (userid='',role='',action='login',ip) => {

    
    try {
        if (!fs.existsSync(`log/authorization_log`)){

            fs.mkdirSync(`log/authorization_log`, { recursive: true });

        }  else {

            let date = new Date();

            const data = new Uint8Array(Buffer.from(`${userid},${role},${action},${ip},${date.toLocaleTimeString('th-TH')}\n`));
            fs.appendFile(`log/authorization_log/${date.toISOString().slice(0, 10)}.txt`, data, (err) => {
                if (err) throw err;
            });
        } 
        return;
    } catch (err) {

    }


}

module.exports = loginLogController;