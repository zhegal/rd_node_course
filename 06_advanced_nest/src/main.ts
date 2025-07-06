import "reflect-metadata";
import { container } from "./core/container.js";
import { Injectable } from "./core/decorators/injectable.js";

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
