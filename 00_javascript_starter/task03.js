const promise1 = timeoutPromise(1000);
const promise2 = timeoutPromise(2000);
const promise3 = timeoutPromise(3000);

function timeoutPromise(ms) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`Promise resolved after ${ms / 1000} seconds`);
        }, ms);
    });
}

promise1.then(console.log);
promise2.then(console.log);
promise3.then(console.log);
