const obterListagem = (header, dataSource) => {
    return `<table class="table">
            <thead class="thead-dark">
                ${header.map(head => `<th style='text-align: center'>${head}</th>`)}
            </thead>
            <tbody>
                ${dataSource.map(line => `<tr>${Object.keys(line).map(attr => `<td style='text-align: center'>${line[attr]}</td>`)}</tr>` )}
            </tbody>
        </table>`
}