module.exports = async knex => {
    try{
        if (!(await migrationAlreadyExecuted(knex))){
           await createMigrationTable(knex);
           await createSexTable(knex);
           await createUserTable(knex);
        }
    } catch (err){
        console.log('The setup of database scheme have failed\n Process exited with status 1', err);
        process.exit(1);        
    }
}

const createMigrationTable = async knex => {
    await knex.raw(`
        CREATE TABLE migration (
            Id int NOT NULL PRIMARY KEY IDENTITY(1,1),
            Done int NOT NULL,
            DoneDate Date
        );
    `);

    await knex.raw(`INSERT INTO migration VALUES (1, getDate())`);
}

const migrationAlreadyExecuted = async knex => {
    const existTable = await knex.raw(`SELECT * FROM tempdb.INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'task' AND TABLE_NAME LIKE '#migration%'`)
    if (existTable.length === 0)
        return false;
}

const createSexTable = async knex => {
    await knex.raw(`
        CREATE TABLE Sex (
            SexId int NOT NULL,
            Description varchar(300) NOT NULL,
            PRIMARY KEY(SexId)
        );
    `);
    await knex.raw(`INSERT INTO Sex VALUES(1, 'Male')`);
    await knex.raw(`INSERT INTO Sex VALUES(2, 'Female')`);
}

const createUserTable = async knex => {
    await knex.raw(`
        CREATE TABLE Persons (
            PersonID int NOT NULL IDENTITY(1,1),
            Name varchar(300) NOT NULL,
            BirthDate Date NOT NULL,
            Email varchar(255) NOT NULL,
            SexId int,
            Password varchar(255) NOT NULL,
            Active int DEFAULT 1,
            PRIMARY KEY(Name, Email),
            FOREIGN KEY (SexId) REFERENCES Sex(SexId)
        );
    `);
}