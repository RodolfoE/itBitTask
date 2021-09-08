var userServices = require('./../Services/UserService');

exports.SaveUser = async (knex, model, filter) => {
    userServices.isModelValid(model)
    if (model.isNew)
        model.password = userServices.hashPassword(model.password);
        
    await userServices.save(knex, model);
    return await userServices.list(knex, filter);
}