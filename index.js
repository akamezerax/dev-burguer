const express = require("express")
const uuid = require("uuid")

const port = 3000
const app = express()
app.use(express.json())

const orders = []

const checkerUserId = (request, response, next) => {
    const{id} = request.params

    const index = orders.findIndex(order => order.id === id)

    if(index < 0) {
        return response.status(404).json({massage:"Order not found"})
    }

    request.orderIndex = index
    request.orderId = id

    next()
}

const logRequest = (request, response, next) => {

    const {method, url} = request;

    console.log(`Tipo de requisição: ${method}`);
    console.log(`URL da requisição: ${url}`);

    next();
}

app.use(logRequest);


app.post("/order", (request, response) => {

    const {pedido, clientName, price, status} = request.body

    const order = {id:uuid.v4(), pedido, clientName, price, status}

    orders.push(order)

    return response.status(201).json(order)
})


app.get("/order", (request, response) => {
    return response.json(orders)
})


app.put("/order/:id", checkerUserId, (request, response) => {

    const {pedido, clientName, price, status} = request.body
    const index = request.orderIndex
    const id = request.orderId

    const updateOrder = {id, pedido, clientName, price, status}

    orders[index] = updateOrder

    return response.json(updateOrder)
})

app.delete("/order/:id", checkerUserId, (request, response) => {

    const index = request.orderIndex

    orders.splice(index,1)

    return response.status(204).json(orders)
})


app.get("/order/:id", checkerUserId, (request, response) => {

    const index = request.orderIndex
    const {id, pedido, clientName, price, status} = orders[index]

    const showOrder = {id, pedido, clientName, price, status}

    return response.json(showOrder)
})


app.patch("/order/:id", checkerUserId, (request, response) => {

    const index = request.orderIndex

    orders[index].status = "Pronto!"

    return response.json(orders[index])
})


app.listen(port, () => {
    console.log("🤓 Server started on port ${port}");
})

