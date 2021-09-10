const newPerson = async () => {
    setListInterface(await execGettReq('register',  { ...getPersonsInfo(), filter: getFilter() }))
    showSuccessfulMessage(2);
}

const remove = async PersonID => {   
    setListInterface(await execGettReq('remove', { PersonID, filter: getFilter() }));
    showSuccessfulMessage(3);
}

const list = async () => setListInterface(await execGettReq('list', { filter: getFilter() }));

const setListInterface = (list) => {
    $('#tabelaComponent').empty();
    $('#tabelaComponent').append(
        obterListagem(
            [ 'Name', 'Birth Date', 'Sex', 'Active', 'Edit', 'Delete'],
            list.map(({PersonID, Name, BirthDate, Sex, Active}) => (
                { 
                    Name, 
                    BirthDate, 
                    Sex, 
                    Active: getActiveRadioBtn(Active, PersonID), 
                    Edit: `<button>Edit</button>`,
                    Delete: `<i class="far fa-trash-alt" onClick="remove(${PersonID})" style='cursor: pointer'></i>`
                }
            ))
        )
    )
}

const getPersonsInfo = () => ({
     isNew: true, 
     Name: $('#Name').val(), 
     BirthDate: new Date($('#BirthDate').val()).toISOString(), 
     Email: $('#Email').val(), 
     SexId: $('.sexIdRadio:checked').val(), 
     Password: $('#Password').val(),
     Active: 1
});

const parseDate = (date) => {
    const [day, month, year] = date.split('/');
    return [month, day, year].join('/');
}

const handleActiveChange = async (Active, PersonID) => {
    setListInterface(await execGettReq('register', { Active, PersonID, isEditActive: 1, filter: getFilter() }))
    showSuccessfulMessage(1);
}

const showSuccessfulMessage = (n) => {
    switch(n){
        case 1:
            alert('Congratulations, your registry has been altered');
        break;
        case 2:
            alert('Congratulations, your registry has been created');
        break;
        case 3: 
            alert('Congratulations, your registry has been removed');
        break;
    }
}


const getActiveRadioBtn = (Active, PersonID) => (`
    <label for="isActive${PersonID}">Yes</label>
    <input type="radio" id="isActive${PersonID}" name="activeBtn${PersonID}" value="1" ${Active===1 && `checked="checked"`} onclick="handleActiveChange(1, ${PersonID});">
    <input type="radio" id="notActive${PersonID}" name="activeBtn${PersonID}" value="0" ${Active===0 && `checked="checked"`} onclick="handleActiveChange(0, ${PersonID});">
    <label for="notActive${PersonID}">No</label>
`)

const getFilter = () => {
    let obj = {};
    const NameFilter = $('#NameFilter').val();
    const ActiveFilter = $('#isActive').is(':checked') ? 1 : 0;
    const NotActiveFilter = $('#notActive').is(':checked') ? 1 : 0;
    const both = $('#both').is(':checked') ? 1 : 0;
    
    if (!both){
        if (ActiveFilter)
            obj.ActiveFilter = 1;
        if (NotActiveFilter)
            obj.ActiveFilter = 0;
    }
    if (NameFilter)
        obj.NameFilter = NameFilter;
    return obj; q
}

const showModal = async (model) =>{
    $('#SexIdComponent').append((await execGettReq('sexLookup')).map(({SexId, Description}) => (
        `<div>
            <label for="sexIdRadio">${Description}</label>
            <input type="radio" class="sexIdRadio pr-2" name="sexIdRadio" value="${SexId}">
        </div>`
    )));
    $('.modal').show();
}
    

const needMocks = async () => {
    const list = await execGettReq('list');
    return list.length === 0;
}

const mockUser = async () => {
    try{
        await execGettReq('mock_users');
    } catch (err){
        console.log(err);
    }
}

(async () => {
    if (await needMocks())
        await mockUser();

    list();
})();