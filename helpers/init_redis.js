const redis = require('redis')



const client =  redis.createClient({
    port:6379,
    host:"127.0.0.1"
})

client.connect()

client.on('connect', ()=>{
    console.log("Client connected to redis...")
})

client.on('ready', ()=>{
    console.log("Client connected to redis and ready to use")

})
+
client.on('end',()=>{
    console.log("Client is disconnected")
})

client.on('error', (err) => {
  console.log(err.message);
});

process.on('SIGINT',()=>{
})

module.exports=client