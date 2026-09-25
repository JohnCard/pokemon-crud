// user template
const userTemplate = (user) => {
    const {name, username, email, address, phone, company} = user
    const {city, street} = address
    const companyName = company.name
    return `<div class="col-11 col-md-6 col-lg-3">
        <div class="card">
            <div class="card-header">
                <h5 class="card-title">${name}</h5>
            </div>
            <div class="card-body">
                <p class="card-text">${username}</p>
                <p class="card-text">${email}</p>
                <p class="card-text">city - ${city}</p>
                <p class="card-text">street - ${street}</p>
                <p class="card-text">company - ${companyName}</p>
                <p class="card-text">phone - ${phone}</p>
            </div>
            <div class="card-footer">
                <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal">Delete</button>
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#updateModal">Launch demo modal</button>
            </div>
        </div>
    </div>`
}
const usersContainer = document.getElementById('users-container')
const trainerForm = document.getElementById('trainer-form')
const trainerUpdateForm = document.getElementById('trainer-form-update')
const trainerDeleteForm = document.getElementById('trainer-form-delete')

// users json placeholders
const userBaseUrl = 'https://jsonplaceholder.typicode.com/users/'

//* main variables for pokeapi
const pokeapiBaseUrl = 'https://pokeapi.co/api/v2/pokemon/'
const pokemonNameForm = document.getElementById('pokemon-name-form')
const movementsTitle = document.getElementById('movements-title')
const typesTitle = document.getElementById('types-title')
const abilitiesTitle = document.getElementById('abilities-title')
const movements = document.getElementById('movements')
const types = document.getElementById('types')
const abilities = document.getElementById('abilities')
const img = document.querySelector('img')
const pokemonHeader = document.getElementById('pokemon-header')
const pokemonBody = document.getElementById('pokemon-body')
const pokemonFooter = document.getElementById('pokemon-footer')

//* pokemon value containers
const id = document.getElementById('id')
const name = document.getElementById('name')
const weight = document.getElementById('weight')
const height = document.getElementById('height')
const order = document.getElementById('order')
const baseExperience = document.getElementById('base-experience')

//* search pokemon name form event listener
pokemonNameForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const pokemonName = document.getElementById('pokemon-name-input').value
    fetch(pokeapiBaseUrl+pokemonName)
    .then(response => {
        pokemonHeader.classList.remove('d-none')
        pokemonBody.classList.remove('d-none')
        pokemonFooter.classList.remove('d-none')
        return response.json()
    })
    .then(data => {
        // name.textContent = `${data.name.charAt(0).toUpperCase()+ data.name.slice(1)} i choose you!`
        name.textContent = `${data.name.toUpperCase()} i choose you!`
        const pokemonFrontSprite = data.sprites.front_default
        id.textContent = `id - ${data.id}`
        weight.textContent = `weight - ${data.weight}`
        height.textContent = `height - ${data.height}`
        order.textContent = `order - ${data.order}`
        baseExperience.textContent = `base experience - ${data.base_experience}`
        movementsTitle.textContent = `${data.name} movements`
        abilitiesTitle.textContent = `${data.name} abilities`
        typesTitle.textContent = `${data.name} types`
        img.src = pokemonFrontSprite
        img.alt = data.name
        let abilityNames = data.abilities
        abilityNames = abilityNames.map(ability => `<li>${ability.ability.name}</li>`)
        let typeNames = data.types
        typeNames = typeNames.map(type => `<li>${type.type.name}</li>`)
        let moveNames = data.moves.slice(0,8).map(move => move.move.name)
        moveNames = moveNames.map(move => `<li>${move}</li>`)
        movements.innerHTML = moveNames.join('')
        types.innerHTML = typeNames.join('')
        abilities.innerHTML = abilityNames.join('')
    })
    .catch(error => console.error(error))
    .finally(() => console.log('ended request'))
})

//* pull users data
fetch(userBaseUrl)
    .then(response => {
        return response.json()
    })
    .then(data => {
        let userData = data.map(user => userTemplate(user))
        usersContainer.innerHTML = userData.join('')
    })
    .catch(error => console.error(error))
    .finally(() => console.log('ended request to users'))

// submit pokemon trainer
trainerForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const trainerName = document.getElementById('trainer-name').value
    const trainerUsername = document.getElementById('trainer-username').value
    const trainerEmail = document.getElementById('trainer-email').value
    const trainerPokemon = document.getElementById('favorite-pokemon').value
    let pokemonTrainer = {
        name: trainerName,
        username: trainerUsername,
        email: trainerEmail,
        pokemon: trainerPokemon
    }
    pokemonTrainer = JSON.stringify(pokemonTrainer)
    fetch(userBaseUrl, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: pokemonTrainer
    })
    .then(response => {
        if(!response.ok){
            throw new Error('Not valid request')
        }
        return response.json()
    })
    .then(data => {
        console.log('completed request')
        console.log(data)
    })
    .catch(error => console.error(error))
    .finally(() => console.log('completed task'))
})
// update trainer
trainerUpdateForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const trainerId = document.getElementById('trainer-id-update').value
    const trainerName = document.getElementById('trainer-name-update').value
    const trainerUsername = document.getElementById('trainer-username-update').value
    const trainerEmail = document.getElementById('trainer-email-update').value
    let bodyRequest = {
        name: trainerName,
        username: trainerUsername,
        email: trainerEmail
    }
    bodyRequest = JSON.stringify(bodyRequest)
    fetch(userBaseUrl+trainerId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: bodyRequest
    })
    .then(response => {
        if(!response.ok){
            throw new Error('not a valid request!')
        }
        return response.json()
    })
    .then(data => {
        console.log(data)
    })
    .catch(error => console.error(error))
    .finally(() => {
        document.getElementById('trainer-id-update').value = ''
        document.getElementById('trainer-name-update').value = ''
        document.getElementById('trainer-username-update').value = ''
        document.getElementById('trainer-email-update').value = ''
    })
})
// delete trainer
trainerDeleteForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const trainerId = document.getElementById('trainer-id-delete').value
    fetch(userBaseUrl+trainerId, {
        method: 'delete'
    })
    .then(response => {
        if(!response.ok){
            throw new Error('not a valid request')
        }
        return response.json()
    })
    .then(data => console.log(data))
    .catch(error => console.error(error))
    .finally(() => {
        console.log('deleted user')
        document.getElementById('trainer-id-delete').value = ''
    })
})