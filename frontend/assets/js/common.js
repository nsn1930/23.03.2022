const url = 'http://localhost:5001'
const mainInput = document.querySelector('#new-todo')
const addButton = document.querySelector('#add-new-todo')
const messageDiv = document.querySelector('.messages')

const messages = (message, status) => {
    let klase = (status === 'success') ? 'alert-success' : 'alert-danger'

    messageDiv.innerHTML = message
    messageDiv.classList.remove('alert-success', 'alert-danger')
    messageDiv.classList.add('show', klase)

    setTimeout(() => {
        messageDiv.classList.remove('show')
    }, 3000);
}

const transferData = async (url, method = 'GET', data = {}) => {
    let options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        }
    }

    if (method != 'GET')
        options.body = JSON.stringify(data)

    const resp = await fetch(url, options)

    return resp.json()

}


const getData = () => {

    transferData(url)
        .then(resp => {

            if (resp.status === 'success') {
                let html = '<ul>'
                let length = resp.data.length
                let doneEntries = 0

                resp.data.forEach(value => {
                    let done = value.done ? 'done' : ''

                    html += `<li data-id="${value.id}">
                                <input type="checkbox" class="mass-delete">
                                <a class="mark-done ${done}"> ${value.task}</a> 
                                <a class="btn btn-outline-danger delete-todo">Remove</a> 
                                <a class="btn btn-outline-secondary update-todo">Edit</a> 
                            </li>`
                    if (value.done)
                        doneEntries++

                })

                let perc = 0

                if (length === 0) {
                    perc === length
                } else {
                    perc = (doneEntries / length * 100).toFixed(0)
                }

                html += `<div class="taskBar">${doneEntries} tasks completed from ${length}</div>
                        <div class="progress">
                            <div class="progress-bar bg-secondary" role = "progressbar" style = "width:${perc}%;" >${perc}%</div>
                        </div>`


                html += '</ul>'

                document.querySelector('#todos').innerHTML = html

                document.querySelectorAll('.mark-done').forEach(element => {
                    let id = element.parentElement.getAttribute('data-id')

                    element.addEventListener('click', () => {

                        transferData(url + '/mark-done/' + id, 'PUT')
                            .then(resp => {
                                if (resp.status === 'success') {
                                    getData()
                                }
                                messages(resp.message, resp.status)
                            })
                    })
                })

                document.querySelectorAll('.delete-todo').forEach(element => {
                    let id = element.parentElement.getAttribute('data-id')

                    element.addEventListener('click', () => {

                        transferData(url + '/delete-todo/' + id, 'DELETE')
                            .then(resp => {
                                if (resp.status === 'success') {
                                    getData()
                                }

                                messages(resp.message, resp.status)
                            })
                    })
                })

                document.querySelectorAll('.update-todo').forEach(element => {
                    let id = element.parentElement.getAttribute('data-id')

                    element.addEventListener('click', () => {

                        transferData(url + '/' + id)
                            .then(resp => {
                                if (resp.status === 'success') {
                                    mainInput.value = resp.data.task
                                    mainInput.classList.add('edit-mode')
                                    mainInput.setAttribute('data-mode', 'edit')
                                    addButton.textContent = addButton.getAttribute('data-edit-label')
                                    addButton.setAttribute('data-id', id)
                                } else {
                                    messages(resp.message, resp.status)
                                }
                            })

                    })
                })


            } else {
                let messages = document.querySelector('.messages')

                messages.innerHTML = resp.message
                messages.classList.add('show')
            }
        })
}

window.addEventListener('load', () => {
    getData()
})

addButton.addEventListener('click', () => {
    let task = mainInput.value
    let mode = mainInput.getAttribute('data-mode')
    let route = url + '/add-todo'
    let method = 'POST'

    if (task === '') {
        let messages = document.querySelector('.messages')
        messages.innerHTML = 'Iveskite uzduoti'
        messages.classList.add('show')
        return
    }

    if (mode === 'edit') {
        let id = addButton.getAttribute('data-id')

        route = url + '/edit-todo/' + id
        method = 'PUT'
    }

    transferData(route, method, { task })
        .then(resp => {
            if (resp.status === 'success') {
                getData()
            }

            mainInput.value = ''
            mainInput.classList.remove('edit-mode')
            addButton.textContent = addButton.getAttribute('data-add-label')

            messages(resp.message, resp.status)
        })
})

document.querySelector('#mass-delete').addEventListener('click', () => {

    let ids = []

    document.querySelectorAll('.mass-delete:checked').forEach(element => {
        ids.push(element.parentElement.getAttribute('data-id'))
    })

    transferData(url + '/mass-delete', 'DELETE', { ids })
        .then(resp => {
            if (resp.status === 'success') {
                getData()
            }
            messages(resp.message, resp.status)
        })

})