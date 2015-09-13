var redis = require("redis"),
client = redis.createClient();

// if you'd like to select database 3, instead of 0 (default), call
client.select(0, function() {
});


client.on("error", function (err) {
    console.log("Error " + err);
});

//client.set("name", "Zhiheng", redis.print);
//client.hset("employee", "ChenChen", "Chen is the designer in Bumpn", redis.print);
//client.hset(["hash key", "hashtest 1", "some other value of hashtest 2"], redis.print);

// client.hkeys("employee", function (err, replies) {
//     console.log(replies.length + " replies:");
//     replies.forEach(function (reply, i) {
//         console.log("    " + i + ": " + reply.toString());
//     });
//     client.quit();
// });

// client.hgetall("employee", function (err, obj) {
//     console.dir(obj);
// });

//取hash
// client.hmset("hosts", "mjr", "1", "another", "23", "home", "1234");
// client.hgetall("hosts", function (err, obj) {
//     console.dir(obj);
// });

//取hash中一个field的值
client.hget("employee", "ZhihengYi", function(err, obj){
	console.log(obj);
});