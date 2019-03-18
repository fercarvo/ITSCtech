var express = require('express');
var router = express.Router();
var moment = require('moment')
const { exec } = require('child_process');
const { key } = require('./util/DB.js')


router.post('/restart_idempiere/:key', async function (req, res, next) {

    if (req.params.key !== key)
        return res.send('UnAuthorized')

    exec('service idempiere_Debian.sh restart', function (err, stdout, stderr) {
        if (err) {
            console.error('Error reinicio', err);
            res.send('Ok')
        }

        console.log('reinicio idempiere exitoso')
        res.send('Ok')
    })
})

router.post('/restart_postgresql/:key', async function (req, res, next) {

    if (req.params.key !== key)
        return res.send('UnAuthorized')

    exec('service postgresql restart', function (err, stdout, stderr) {
        if (err) {
            console.error('Error reinicio base', err);
            res.send('Ok')
        }

        console.log('reinicio base exitoso')
        res.send('Ok')
    })
})

module.exports = router;