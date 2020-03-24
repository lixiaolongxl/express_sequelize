module.exports = {
    resSuccess(res,statuscode,data){
        res.status(statuscode).json({
            status:statuscode,
            data:data,
            msg:'success'
        })
    },
    resError(res,statuscode,data){
        res.status(statuscode).json({
            status:statuscode,
            msg:data
        })
    },
    getLocalIP() {
        const os = require('os');
        const ifaces = os.networkInterfaces();
        let locatIp = '';
        for (let dev in ifaces) {
            if (dev === '本地连接' || dev === '以太网') {
                for (let j = 0; j < ifaces[dev].length; j++) {
                    if (ifaces[dev][j].family === 'IPv4') {
                        locatIp = ifaces[dev][j].address;
                        break;
                    }
                }
            }
        }
        return locatIp;
    }
    
}