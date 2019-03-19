var { exec } = require('child_process');
var io  = require('socket.io-client')

var { cliente_name, secret, server } = require('./util/DB.js')


var hub = io(server, {
    path: '/supertech', 
    query: {
        server: cliente_name,
        secret:  secret
    }
})

hub.on('pavimento', async (req, response_cb) => {
    if (req.tipo === 'restart_idempiere') {
        exec('service idempiere_Debian.sh restart', function (err, stdout, stderr) {
            if (err) {
                console.error('Error reinicio', err);
                return response_cb(`Error reinicio ${err}`)
            }

            console.log('reinicio idempiere exitoso')
            return response_cb('reinicio idempiere exitoso')
        })

    } else if (req.tipo === 'restart_postgresql') {
        exec('service postgresql restart', function (err, stdout, stderr) {
            if (err) {
                console.error('Error reinicio base', err);
                return response_cb(`Error reinicio base ${err}`)            
            }

            console.log('reinicio base exitoso')
            return response_cb('reinicio base exitoso')
        })
    } else {
        response_cb(req.tipo+' comando no soportado')
    }
})

hub.on('connect', () => console.log(`This <-----> ${server} [${new Date().toLocaleString()}]`))
hub.on('disconnect', () => console.log(`This <-   -> ${server} [${new Date().toLocaleString()}]`))
hub.on('error', err => {
    console.error("Error grave", err)
    hub.close()
} )