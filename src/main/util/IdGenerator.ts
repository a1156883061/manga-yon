import { RxCollection } from 'rxdb';

export default function(rxCollection: RxCollection) {
  rxCollection.preInsert(async (data) => {
    if (data.id) {
      return;
    }
    const lastIdDocument = await rxCollection
      .findOne()
      .sort({ id: 'desc' })
      .exec();
    debugger;
    if (lastIdDocument == null) {
      data.id = '1';
      return;
    }
    const lastId = lastIdDocument.get('id');
    data.id = String(Number.parseInt(lastId) + 1);
  }, false);
}
