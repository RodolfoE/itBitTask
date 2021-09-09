var userServices = require('./../Services/UserService');

exports.SaveUser = async (knex, model, filter) => {
    !model.isEditActive && userServices.isModelValid(model)
    if (model.isNew)
        model.Password = userServices.hashPassword(model.Password);
        
    await userServices.save(knex, model);
    return await exports.list(knex, model.filter);
}

exports.deleteUser = async (knex, { PersonID, filter }) => {
    await knex.raw(`DELETE FROM Persons WHERE PersonID=${PersonID}`);
    return await exports.list(knex, filter);
}

exports.list = async (knex, filter) => 
    userServices.fillListModel(await userServices.list(knex, userServices.createPredicate(filter)));