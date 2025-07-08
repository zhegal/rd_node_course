// Macrotasks
setTimeout(() => { }, 0);
setInterval(() => { }, 1000);

// Microtasks
new Promise((resolve, reject) => { });
queueMicrotask(() => { })