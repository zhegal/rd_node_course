import "reflect-metadata";
import { container } from "./core/container";
import { Injectable } from "./core/decorators/injectable";
import { Test } from "./core/decorators/test";

@Injectable()
class ServiceA {
  get() {
    return "Hello from A";
  }
}

@Injectable()
class ServiceB {
  constructor(private a: ServiceA) {}

  get() {
    return this.a.get() + " + B";
  }
}

const instanceB = container.resolve(ServiceB);
console.log(instanceB.get());

function InsideTest(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  console.log({ originalMethod });
  
  descriptor.value = function (...args: any[]) {
    console.log(`Called ${propertyKey} with`, args);
    return originalMethod.apply(this, args);
  };
}

@Test()
class Tester {
    constructor() {
        console.log('test');
    }

    @InsideTest
    hello() {
        console.log('hello there!');
    }
}

const test = new Tester();
test.hello();