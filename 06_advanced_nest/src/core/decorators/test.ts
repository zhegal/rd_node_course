export function Test() {
    return function (target: any) {
        console.log(target);
    }
}