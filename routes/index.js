var express = require('express');
var router = express.Router();
var token = 'dianyingren';

/* GET users listing. */
router.get('/', function (req, res) {
    console.log(req.query.echostr);
    var echostr = req.query.echostr;
    var crypt = new WXBizMsgCrypt(config.Token, config.EncodingAESKey, config.CorpID);
    console.log("crypt: " + crypt);

    var newechostr = crypt.decrypt(echostr);
    console.log(newechostr);

    res.end(newechostr.message);
});

router.get('/auth', function (req, res) {

});


module.exports = router;
