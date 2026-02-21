import UserModel from "../models/user.model.js";

export default class SessionDAO {

    async createUser (user) {
        return await UserModel.create(user)
    }

    async getUserByFilter (filter) {
        return await UserModel.findOne(filter).lean()
    }

}