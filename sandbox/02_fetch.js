async function run() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
        if (!response) {
            throw new Error('Error happened');
        }
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error(error.message);
    } finally {
        console.log('Finish');
    }
}

run();