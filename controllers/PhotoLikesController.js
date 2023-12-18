import PhotoLikeModel from '../models/photoLike.js';
import Repository from '../models/repository.js';
import Controller from './Controller.js';
import Authorizations from '../authorizations.js';
import RepoCacheManager from '../models/repositoryCachesManager.js'

export default class PhotoLikesController extends Controller {
    constructor(HttpContext) {
        super(HttpContext, new Repository(new PhotoLikeModel()), Authorizations.user());
    }

    like(data) {
        if (this.repository != null) {
            let foundedlikes = this.repository.findByField("PhotoId", data.photoId);
            if (foundedlikes != null) {
                if(foundedlikes.UsersId.includes(data.userId)){
                    this.HttpContext.response.accepted();
                }
                else{
                    if(foundedlikes.UsersId.length != 0){
                        foundedlikes.UsersId += "," + data.userId;
                    }
                    let updatedPhotoLike= this.repository.update(foundedlikes.Id, foundedlikes);
                    if (this.repository.model.state.isValid) {
                        this.HttpContext.response.updated(updatedPhotoLike);
                    }
                    else {
                        if (this.repository.model.state.inConflict)
                            this.HttpContext.response.conflict(this.repository.model.state.errors);
                        else
                            this.HttpContext.response.badRequest(this.repository.model.state.errors);
                    }
                }
            } else {
                let photoLike = this.repository.add({"PhotoId":data.photoId, "UsersId":data.userId});
                if (this.repository.model.state.isValid) {
                    this.HttpContext.response.created(photoLike);
                }else {
                    if (this.repository.model.state.inConflict)
                        this.HttpContext.response.conflict(this.repository.model.state.errors);
                    else
                        this.HttpContext.response.badRequest(this.repository.model.state.errors);
                }
            }
        } else
            this.HttpContext.response.notImplemented();
    }

    unlike(data) {
        if (this.repository != null) {
            let foundedlikes = this.repository.findByField("PhotoId", data.photoId);
            if (foundedlikes != null && foundedlikes.UsersId.includes(data.userId)) {
                let positionUserId = foundedlikes.UsersId.indexOf(data.userId)
                if(foundedlikes.UsersId.includes(",")){
                    let updatedPhotoLike
                    if(positionUserId == 0){
                        foundedlikes.UsersId = foundedlikes.UsersId.replace(data.userId + ",", "");
                        updatedPhotoLike = this.repository.update(foundedlikes.Id, foundedlikes);
                    }else{
                        foundedlikes.UsersId = foundedlikes.UsersId.replace("," + data.userId, "");
                        updatedPhotoLike = this.repository.update(foundedlikes.Id, foundedlikes);
                    }
                    if (this.repository.model.state.isValid) {
                        this.HttpContext.response.updated(updatedPhotoLike);
                    }
                    else {
                        if (this.repository.model.state.inConflict)
                            this.HttpContext.response.conflict(this.repository.model.state.errors);
                        else
                            this.HttpContext.response.badRequest(this.repository.model.state.errors);
                    }
                }
                else{
                    this.repository.remove(foundedlikes.Id);
                    this.HttpContext.response.accepted();
                }
            } else {
                this.HttpContext.response.accepted();
            }
        } else
            this.HttpContext.response.notImplemented();
    }
}