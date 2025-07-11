import "reflect-metadata";

export function UseFilters(...filters: any[]): ClassDecorator {
  return (target: any) => {
    Reflect.defineMetadata("filters", filters, target);
  };
}
