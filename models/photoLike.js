import Model from './model.js';
import Repository from '../models/repository.js';

export default class PhotoLike extends Model {
    constructor()
    {
        super();
        this.addField('UsersId', 'string');   
        this.addField('PhotoId', 'string');     

        this.setKey("PhotoId");
    }

    bindExtraData(instance) {
        instance = super.bindExtraData(instance);
        let usersRepository = new Repository(new UserModel());
        instance.Owner = usersRepository.get(instance.OwnerId);
        instance.OwnerName = instance.Owner.Name;
        return instance;
    }
}