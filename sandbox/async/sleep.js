const { setTimeout } = require("node:timers/promises");

(async () => {
    console.log('test');
    await setTimeout(1000);
    console.log('a');
})()