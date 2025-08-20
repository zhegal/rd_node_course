import { dataSource } from '../src/data-source';

(async () => {
  await dataSource.initialize();
  const builder = (dataSource as any).driver.createSchemaBuilder();
  const { upQueries } = await builder.log();

  await dataSource.destroy();

  if (upQueries.length) {
    console.error('Schema drift detected');
    process.exit(1);
  }
  console.log('Schema is in sync');
  process.exit(0);
})();
