// we will use this variable for updateUser (arrow function) and delete fetch requests, to specify the user´s id at final endpoint
let idUser = null
// function to set new id for user at for endpoint in update and delete fetch/requests
function setUserId(id){
    idUser = id
}
//todo gaffet template arrow function (user template)
const gaffet = (user) => {
    const { id, name, username, email, company, address, phone, website } = user
    const { street, city, zipcode } = address
    const companyName = company.name
    return `
    <div class="col-12 col-md-6 col-lg-3" id=${id}>
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">${name}</h3>
                <h4 class="card-subtitle">known as ${username}</h4>
            </div>
            <div class="card-body">
                <p class="card-text">${email}</p>
                <h4 class=" card-subtitle">Company - ${companyName}</h4>
                <h4 class="card-subtitle">Address data</h4>
                <ul class=" list-group">
                    <li class="list-group-item">${street}</li>
                    <li class="list-group-item">${city}</li>
                    <li class="list-group-item">${zipcode}</li>
                </ul>
                <p class="card-text">phone - ${phone.replace('.','-')}</p>
                <p class="card-text">website - ${website}</p>
            </div>
            <div class="card-footer">
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#updateModal" onclick="setUserId(${id})">Update</button>
            <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal" onclick="setUserId(${id})">Delete</button>
            </div>
        </div>
    </div>
    `
}
//* html elements & user (.row) div container
const createForm = document.getElementById('user-form')
const updateForm = document.getElementById('update-form')
const deleteForm = document.getElementById('delete-form')
const usersContainer = document.getElementById('users-container')
//todo base endpoint for jsonplaceholder CRUD requests
const baseEndpoint = 'https://jsonplaceholder.typicode.com/users/'
//* update user from jsonplaceholder, based on endpoint and a request body
const updateUser = (endpoint, body) => {
    fetch(endpoint+idUser, {
        // specify put method (get is set as default method)
        method: 'put',
        // specify format data
        headers: {
            'Content-Type': 'application/json'
        },
        // body request
        body: body
    })
    // try to format response to json type
    .then(response => {
        //? is not the response ok? throw error message for operator
        if(!response.ok){
            throw new Error('Not valid request data')
        }
        //* ok response? return in json format
        return response.json()
    })
    //* show complete data
    .then(data => console.log(data))
    //! catch error? console to see details
    .catch(error => console.error(error))
    .finally(() => {
        // reset every fields typed by user
        document.getElementById('name').value = ''
        document.getElementById('username').value = ''
        document.getElementById('email').value = ''
        document.getElementById('company').value = ''
        document.getElementById('street').value = ''
        document.getElementById('phone-number').value = ''
        document.getElementById('website').value = ''
        // set user id to initial value
        setUserId(null)
    })
}
//* pull users data section
fetch(baseEndpoint)
.then(response => {
    if(!response.ok){
        throw new Error('Failed request')
    }
    return response.json()
})
.then(data => {
    // map data to format every user as a gaffet
    let formattedData = data.map(user => gaffet(user))
    // join formattedData items without any character
    formattedData = formattedData.join('')
    // insert div.card items into usersContainer (div.row)
    usersContainer.innerHTML = formattedData
})
.catch(error => console.error(error))
// this request has finally ended
.finally(() => console.log('successful request'))
//* update users section
updateForm.addEventListener('submit', e => {{
    e.preventDefault()
    // pull every update user form field values
    const name = document.getElementById('name').value
    const username = document.getElementById('username').value
    const email = document.getElementById('email').value
    const company = document.getElementById('company').value
    const street = document.getElementById('street').value
    const phoneNumber = document.getElementById('phone-number').value
    const website = document.getElementById('website').value
    // format form values into json data
    let updateBodyRequest = {
        name: name,
        username: username,
        email: email,
        company: company,
        street: street,
        phone_number: phoneNumber,
        website: website
    }
    // convert to string format
    updateBodyRequest = JSON.stringify(updateBodyRequest)
    // update user function
    updateUser(baseEndpoint, updateBodyRequest)
}})
//* delete users
deleteForm.addEventListener('submit', e => {
    e.preventDefault()
    fetch(baseEndpoint+idUser, {
        // specify delete method to prevent get default
        method: 'delete'
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log(error))
    // set user to null value
    .finally(() => setUserId(null))
})
//* create user
createForm.addEventListener('submit', e => {
    e.preventDefault()
    // extract form values
    const name = document.getElementById('name-field').value
    const username = document.getElementById('username-field').value
    const email = document.getElementById('email-field').value
    const company = document.getElementById('company-field').value
    const street = document.getElementById('street-field').value
    const phoneNumber = document.getElementById('phone-number-field').value
    const website = document.getElementById('website-field').value
    // convert to json format
    let finalRequest = {
        name: name,
        username: username,
        email: email,
        company: company,
        street: street,
        phone_number: phoneNumber,
        website: website
    }
    // json to string format
    finalRequest = JSON.stringify(finalRequest)
    fetch(baseEndpoint, {
        // specify method as post action instead get as default
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: finalRequest
    })
    .then(response => {
        // throw error message for any detected error
        if(!response.ok) throw new Error('Failed request')
        return response.json()
    })
    .then(data => console.log(data))
    .catch(error => console.error(error))
    .finally(() => {
        // reset form values
        document.getElementById('name-field').value = ''
        document.getElementById('username-field').value = ''
        document.getElementById('email-field').value = ''
        document.getElementById('company-field').value = ''
        document.getElementById('street-field').value = ''
        document.getElementById('phone-number-field').value = ''
        document.getElementById('website-field').value = ''
    })
})