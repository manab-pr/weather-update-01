const telegramBot = require('node-telegram-bot-api');
const {default:axios}= require('axios');
require('dotenv').config();



const TOKEN=process.env.TOKEN;
const API_KEY =process.env.WEATHER_API_KEY;
const weater_url=process.env.address;

const bot = new telegramBot(TOKEN,{polling:true});

bot.on('message',(message)=>{
    let chatId =message.from.id;
    const Text =message.text.toLowerCase();

    if(Text==='hey'||Text==='hii'||Text==='hello'||Text==='start'){
        bot.sendMessage(chatId,'🔹To get to know the bot enter: /start\n🔹To know how to command enter: /help\n🔹And finally /weather [city] for magic')
    }

})


bot.onText(/\/start/,(message)=>{
    let chatId=message.from.id;
    bot.sendMessage(chatId,'Hi👋, I am Weather Bot, I am here to keep you updated')

})

bot.onText(/\/help/,(message)=>{
    let chatId=message.from.id;
    bot.sendMessage(chatId,'/weather kolkata')

})
bot.onText(/\/weather (.+)/,async(message,match)=>{
    let chatId=message.from.id;
    const City =match[1];
   
   try {
    const response = await axios.get(weater_url,{
        params:{
            q:City,
            appid:API_KEY,
            units:'metric'

        }
    });

    const weaatherData = response.data.weather[0].description;
    const tempareture = `${Math.floor(response.data.main.temp)}°C`
    const windspeed =`${response.data.wind.speed} km/h`

    bot.sendMessage(chatId,`🔹The Weather 🌍 of ${City} is ${weaatherData} \n🔹The Temperature 🌡️ is Approx: ${tempareture} \n🔹The Wind 💨 Speed is:${windspeed}  `);

    
   } catch (error) {
    console.error(error);
    bot.sendMessage(chatId,'City Not Found!😞\nPlease Enter a Valid City.🙂')
   }
})
