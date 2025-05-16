try {
    const lastIndex = process.argv.length - 1;
    const arg = process.argv[lastIndex];
    const array = JSON.parse(arg);
    const result = sum(array);
    
    function sum(array) {
        return array.reduce((total, element) => {
            const value = Array.isArray(element) ? sum(element) : element;
            return total + value;
        }, 0);
    }
    
    console.log(result);
} catch (err) {
    console.error(err.message);
}