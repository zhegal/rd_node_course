import "reflect-metadata";

export function UseGuards(...guards: any[]): ClassDecorator & MethodDecorator {
  return (target: any, propertyKey?: string | symbol) => {
    if (propertyKey) {
      Reflect.defineMetadata("guards", guards, target, propertyKey);
    } else {
      Reflect.defineMetadata("guards", guards, target);
    }
  };
}
