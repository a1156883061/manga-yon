import {
  addRxPlugin,
  createRxDatabase,
  RxCollection,
  RxDatabase,
  RxDocument,
  RxJsonSchema,
} from 'rxdb';
import { join } from 'path';
import currentFolder from '@/util/get-exec-folder';
import levelDBPlugin from 'pouchdb-adapter-leveldb';
import leveldown from 'leveldown';
import { RxDBValidatePlugin } from 'rxdb/plugins/validate';
type ComicDocType = {
  title: string;
  path: string[];
};

type ComicDocument = RxDocument<ComicDocType>;
type ComicCollection = RxCollection<ComicDocType>;
type MyDatabaseCollections = {
  comics: ComicCollection;
};
type MyDatabase = RxDatabase<MyDatabaseCollections>;
type ComicSchema = RxJsonSchema<ComicDocType>;
console.log('path', join(currentFolder, 'comicData'));
addRxPlugin(RxDBValidatePlugin);
addRxPlugin(levelDBPlugin);
const comics = (async function() {
  const db: MyDatabase = await createRxDatabase<MyDatabaseCollections>({
    name: join(currentFolder, 'comicData'),
    adapter: leveldown,
  });
  const comicSchema: RxJsonSchema<ComicDocType> = {
    title: 'comic shelf data',
    description: 'comic shelf data, include title, comic path in desk and etc ',
    type: 'object',
    version: 0,
    properties: {
      title: {
        type: 'string',
        primary: true,
      },
      path: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    },
  };
  await db.addCollections({
    comics: {
      schema: comicSchema,
    },
  });
  return db.comics;
})();
export { comics };
