const crypto = require('crypto');
exports.hashPassword = password => crypto.createHash('sha256').update(password, 'utf8').digest('hex');

exports.fillListModel = entity => 
    entity.map( ({PersonID, Name, BirthDate, Email, Sex, Active }) => ({ 
        PersonID, 
        Name, 
        BirthDate: new Date(BirthDate).toDateString(), 
        Email, 
        Sex, 
        Active
 }));

exports.list = async (knex, predicate) => await knex.raw(`SELECT Persons.*, Sex.Description as 'Sex' FROM Persons join Sex on Persons.SexId = Sex.SexId ${predicate}`);

exports.createPredicate = (filter) => {
    if (!filter) return '';

    const { NameFilter, ActiveFilter } = filter;
    let predicates = [];
    if (NameFilter)
        predicates.push(`Name like '%${NameFilter}%'`);
    if (ActiveFilter)
        predicates.push(`Active = ${ActiveFilter}`);
    
    return predicates.length ? `WHERE ${predicates.join(' AND ')}` : '';
}

const joinChangedValues = model => Object.keys(model).filter(attr => model[attr]).map(attr => `${attr}='${model[attr]}'`).join(',');

exports.save = async (knex, model) => {
    const { isNew, PersonID, Name, BirthDate, Email, SexId, Password, Active } = model;

    if (isNew)
        await knex.raw(`
        INSERT INTO Persons VALUES(
            '${Name}',
            '${BirthDate}',
            '${Email}',
            ${SexId},
            '${Password}',
            ${Active})`);
    else 
        await knex.raw(`
        UPDATE Persons 
        SET 
        ${joinChangedValues({Name, BirthDate, Email, SexId, Active})}
        WHERE PersonId=${PersonID}`);
}

exports.isModelValid = model => {
    const { isNew, Name, BirthDate, Email, SexId, Password } = model;
    const erros = [];

    const setError = (userMsg, devErr) => erros.push({ userMsg, devErr });

    if (!Name)
        setError('You forgot the Name field', 'Name');
    if (Name && Name.length < 3)
        setError('Field Name must be greater than 3 characters', 'Name');
    if (!BirthDate)
        setError('You forgot the Birth Date field', 'BirthDate');
    if (!Email || !isValideEmail(Email))
        setError('The Email specified is invalid', 'Email');
    if (!SexId)
        setError('You forgot the Sex field', 'SexId');
    if (!(SexId == 1 || SexId == 2))
        setError('The sex specified is currently not covered', 'SexId');
    if ((isNew) && !Password)
        setError('You forgot the Password field', 'Password');

    if (erros.length)
        throw erros;
    
    return 'Congratulations, your registry has been successfully created';
}

const isValideEmail = email => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        .test(String(email).toLowerCase());