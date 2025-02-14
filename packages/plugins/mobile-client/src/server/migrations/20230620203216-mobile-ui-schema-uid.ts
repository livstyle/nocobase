import { Model } from '@nocobase/database';
import { Migration } from '@nocobase/server';

export default class extends Migration {
  async up() {
    const systemSettings = this.db.getRepository('systemSettings');
    let instance: Model = await systemSettings.findOne();
    const uiRoutes = this.db.getRepository('uiRoutes');
    const routes = await uiRoutes.find();
    for (const route of routes) {
      if (route.uiSchemaUid && route?.options?.component === 'MApplication') {
        const options = instance.options || {};
        options['mobileSchemaUid'] = route.uiSchemaUid;
        instance.set('options', options);
        instance.changed('options', true);
        await instance.save();
        return;
      }
    }
    instance = await systemSettings.findOne();
    if (!instance.get('options')?.mobileSchemaUid) {
      throw new Error('mobileSchemaUid invalid');
    }
    this.app.log.info('systemSettings.options', instance.toJSON());
  }
}
