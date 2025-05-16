async function run() {
    try {
        const data = await fetch('https://jsonplaceholder.typicode.com/todos/1');
        const dataJson = await data.json();
        console.log(dataJson);
    } catch (error) {
        console.error(error.message);
    } finally {
        console.log('Finish');
    }
}

run();