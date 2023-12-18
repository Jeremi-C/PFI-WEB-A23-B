import Model from './model.js';
import Repository from '../models/repository.js';
import UserModel from './user.js';

export default class PhotoLike extends Model {
    constructor()
    {
        super();
        this.addField('UsersId', 'string');   
        this.addField('PhotoId', 'string');     

        this.setKey("PhotoId");
    }
}