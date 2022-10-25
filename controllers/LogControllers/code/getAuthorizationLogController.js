const fs = require('fs')
const path = require('path');

const getAuthorizationLogController = async () => {

    
    try {
        
        let files = await fs.promises.readdir(`log/authorization_log/`, async (err) => {

            if (err)
                console.warn(err);

        });

        let logs = {};
        await Promise.all(
            files.map( async (filename) => {
                const data = await fs.promises.readFile('log/authorization_log/'+filename, 'utf8');
                let result = data.split("\n")
                logs[filename.split('.').slice(0, -1).join('.')] = {}
                await Promise.all(
                    result.map((log) => {

                        if(log[0]) {
                            log = log.split(",");
                            logs[filename.split('.').slice(0, -1).join('.')][log[4]] = log.slice(0,4);
                        }

                    })
                )
            })
        )

        
        return logs;

    } catch (err) {
        throw err
    }


}

module.exports = getAuthorizationLogController;