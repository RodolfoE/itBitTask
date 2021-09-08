const crypto = require('crypto');
exports.hashPassword = password => crypto.createHash('sha256').update(x, 'utf8').digest('hex');

exports.save = async (knex, model) => {
    const { isNew, PersonID, Name, BirthDate, Email, SexId, Password, Active } = model;

    if (isNew)
        await knex.raw(`
        INSERT INTO Persons VALUE(
            '${Name}',
            '${BirthDate}',
            '${Email}',
            ${SexId}
            '${Password}',
            ${Active})`);
    else 
        await knex.raw(`
        UPDATE Persons 
        SET 
        Name='${Name}',
        BirthDate='${BirthDate}',
        Email='${Email}',
        SexId=${SexId}
        Password='${Password}',
        Active=${Active})
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
    if (!Email || validateEmail(Email))
        setError('The Email specified is invalid', 'Email');
    if (!SexId)
        setError('You forgot the Sex field', 'SexId');
    if (!SexId != 1 || SexId != 2)
        setError('The sex specified is currently not covered', 'SexId');
    if ((isNew) && !Password)
        setError('You forgot the Password field', 'Password');

    if (erros.length)
        throw erros;
    
    return 'Congratulations, your registry has been successfully created';
}

const validateEmail = email => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        .test(String(email).toLowerCase());