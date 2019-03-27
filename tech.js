var { exec } = require('child_process');
var io  = require('socket.io-client')

/** Nombre del cliente, no debe de existir */
var cliente_name 	= undefined 
/** key unica que debe ser la misma del servidor */
var secret 		    = undefined 
/** hrl del servidor */
var server 	        = undefined

for (var i = 2; i < process.argv.length; i++) {
	let arg 		= process.argv[i].split('=')
	let arg_name 	= arg[0] 
    let arg_value 	= arg[1]

	switch (arg_name.toUpperCase()) {
		case 'NAME':
            cliente_name = arg_value;
			break;
		case 'SECRET':
            secret = arg_value;
			break;
		case 'SERVER':
            server = arg_value;
			break;
		default:
		  	console.error("Argumento desconocido " + arg);
	}
}

if (!cliente_name || !secret || !server )
    throw new Error(`NAME=${cliente_name} SECRET=${secret} SERVER=${server}`);

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