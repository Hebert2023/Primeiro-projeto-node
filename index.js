const express = require("express")
const uuid = require("uuid")
const port = 3000
const app = express()
app.use(express.json())

/*
    -Query params=> meusite.com/users?nome=hebert%age=27
    -Route params=>/users/2         //Buscar,Deletar ou Atualizar Algo Expecífico
    -Request body =>{ "name": "Hebert", "age:"}   /

    - GET =>  Busca informações no Back-End
    - POST => Cria informações no Back-End
    - PUT/PATCH => Altera/Atualiza as informações do Back-End
    - DELETE => Deleta as informações do Back-End

    -Middleware => Intercepta => tem o poder de parar ou alterar dados da  requisição 
*/
const users = []

const checkUserId = (request, response, nest) => {
    const { id } = request.params//pegando o id que esta na rota

    const index = users.findIndex(user => user.id === id)

    if (index < 0) {
        return response.status(404).json({ erro: 'User not found.' })
    }

    request.userIndex = index
    request.userId = id

    nest()
}

app.get("/users", (request, response) => {
    return response.json({ users })
})


app.post("/users", (request, response) => {
    const { name, age } = request.body

    const user = { id: uuid.v4(), name, age }

    users.push(user)

    return response.status(201).json({ user })
})

app.put("/users/:id", checkUserId, (request, response) => {
    const { name, age } = request.body
    const index = request.userIndex
    const id = request.userId

    
    const updateUser = { id, name, age }
    
    users[index] = updateUser

    return response.json(updateUser)

})
app.delete("/users/:id", checkUserId, (request, response) => {
    const index = request.userIndex

    users.splice(index, 1)

    return response.status(204).json()
})

app.listen(port, () => {
    console.log(`🙌Server is running on http://localhost:${port}`);
})
