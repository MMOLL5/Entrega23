import mongoose from 'mongoose';
import * as model from '../mensajes';
import { normalize, schema } from 'normalizr';


const URL = 'mongodb://localhost:27017/ecommerce'

const author = new schema.Entity('author', {}, { idAttribute: 'email' });

const msge = new schema.Entity(
  'message',
  {
    author: author,
  },
  { idAttribute: '_id' }
);

const msgesSchema = new schema.Array(msge);
class MensajesPersistencia {
  async add(data) {
    try {
        
        let rta = await mongoose.connect(URL, {
            useNewUrlParser: true,
            UseUnifiedTopology: true
        })
        console.log('BD Conectada');

        const mensajeSaveModel = new model.mensajes(data);
        let mensajeSave = await mensajeSaveModel.save();
        return mensajeSave;
    } catch (error) {
        console.log(error);
    }
  }

  async getAllMessages(){
    try {
      let messages = (await model.mensajes.find()).map((aMsg) => ({
        _id: aMsg._id,
        author: aMsg.author,
        time: aMsg.time,
        text: aMsg.text,
      }));
      console.log('messages ', messages);
      let normalizedMessages = normalize(messages, msgesSchema);
      console.log('normalizedMessages ', normalizedMessages);
      return normalizedMessages;
    } catch (err) {
      console.log('ERROR');
      console.log(err);
    }
  };

}

export const Mensajes = new MensajesPersistencia();