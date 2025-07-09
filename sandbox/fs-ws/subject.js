import { Subject } from "rxjs";

const subject = new Subject();

subject.subscribe(value => console.log(`Subscriper 1: ${value}`));
subject.subscribe(value => console.log(`Subscriper 2: ${value}`));

subject.next('Hello!');
subject.next('World!');