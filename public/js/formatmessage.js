const moment = require('moment');

function formatMessage(username,text){
    return{
        username:username,
        text:text,
        time:moment().tz("Asia/Calcutta|Asia/Kolkata").format('h:mm a')
    }
}
module.exports = formatMessage;