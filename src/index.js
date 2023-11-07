const telegramBot = require('node-telegram-bot-api');
const {default:axios}= require('axios');
const icons=require('./icons');
require('dotenv').config();



const TOKEN=process.env.TOKEN;
const API_KEY =process.env.WEATHER_API_KEY;
const weater_url=process.env.address;

const bot = new telegramBot(TOKEN,{polling:true});

bot.on('message',(message)=>{
    let name =message.from.first_name;
    console.log(name);
    let chatId =message.from.id;
    const Text =message.text.toLowerCase();

    if(Text==='hey'||Text==='hii'||Text==='hello'||Text==='start'){
        bot.sendMessage(chatId,`🔹Hii ${name}\n🔹To get to know the bot enter: /start\n🔹To know how to command enter: /help\n🔹And finally /weather [city] for magic`,{
            reply_to_message_id:message.message_id
        })
    }

})


bot.onText(/\/start/,(message)=>{
    let chatId=message.from.id;
    let name=message.from.first_name;
    bot.sendMessage(chatId,`Hi👋 ${name}, I am Weather Bot, I am here to keep you updated`,{
        reply_to_message_id:message.message_id
    })

})

bot.onText(/\/help/,(message)=>{
    let chatId=message.from.id;
    bot.sendMessage(chatId,'/weather kolkata',{
        reply_to_message_id:message.message_id
    })

})
bot.onText(/^\/weather$/,(message)=>{
    let chatId=message.from.id;
    bot.sendMessage(chatId,'please provide a name of any city...😃',{
        reply_to_message_id:message.message_id
    })

})
bot.onText(/^\/clear$/,(message)=>{
    let chatId=message.from.id;
    bot.sendMessage(chatId,'please provide a name of any city...😃',{
        reply_to_message_id:message.message_id
    })

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
    // const tempareture = `${Math.floor(response.data.main.temp)}°C`
    const minTemp =`${Math.floor(response.data.main.temp_min)}°C`
    const maxTemp =`${Math.floor(response.data.main.temp_max)}°C`
    const windspeed =`${response.data.wind.speed} km/h`
    const feelsLike =`${Math.floor(response.data.main.feels_like)}°C`
    const visibility =`${Math.floor(response.data.visibility/1000)} km`
    const icon=response.data.weather[0].icon;
    const wIcon=icons[icon];


    bot.sendMessage(chatId,`🔹The Weather 🌍 of ${City} is ${weaatherData} ${wIcon} \n🔹The minimum Temperature 🌡️ is Approx: ${minTemp} \n🔹The maximum Temperature 🌡️ is Approx: ${maxTemp} \n🔹The Wind 💨 Speed is:${windspeed}\n🔹it feels like: ${feelsLike}\n🔹The Visibility is: ${visibility}  `,{
        reply_to_message_id:message.message_id
    });

    
   } catch (error) {
    console.error(error);
    bot.sendMessage(chatId,'City Not Found!😞\nPlease Enter a Valid City.🙂',{ reply_to_message_id:message.message_id})
   }
})
