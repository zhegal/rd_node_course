const createMultiplier = (num) => (val) => num * val;
const multiplyBy2 = createMultiplier(2);

console.log(multiplyBy2(5)); // Результат: 10
console.log(multiplyBy2(10)); // Результат: 20