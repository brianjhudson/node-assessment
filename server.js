const express = require("express");
const {json} = require("body-parser");
const app = express();
app.use(json());
const port = 3000;

const users = require('./users.json');


app.get('/api/users/:id', (req, res) => {
    if (parseInt(req.params.id)) {
        const userById = users.filter(user => user.id == req.params.id);
        if (!userById[0]) return res.status(404).json({error: "No Such User"});
        return res.status(200).json(userById[0]);
    } else if (typeof req.params.id === 'string') {
        const usersByPriv = users.filter(user => user.type === req.params.id);
        return res.status(200).json(usersByPriv);
    }
})

app.get('/api/users', (req, res) => {
    if (req.query) {
        for (let prop in req.query) {
            const usersByLang = users.filter(user => {
                if (parseInt(req.query[prop])) {
                    return user[prop] == req.query[prop];
                } else {
                    return user[prop].toLowerCase() === req.query[prop].toLowerCase()
                }
            });
            return res.status(200).json(usersByLang);
        }
    }
    return res.status(200).json(users);
});


app.post("/api/users", (req, res) => {
    const user = req.body;
    user.id = users[users.length - 1].id + 1;
    user.favorites = [];
    users.push(user);
    return res.status(200).json(user);
})

app.post('/api/users/admin/', (req, res) => {
    const user = req.body;
    // user.type = req.params.type;
    // Test doesn't pass in type as specified in README'
    user.id = users[users.length - 1].id + 1;
    user.favorites = [];
    users.push(user); 
    return res.status(200).json(user);
})

app.post('/api/users/language/:id', (req, res) => {
    for (let i = 0; i < users.length; i++) {
        if (users[i].id == req.params.id) {
            users[i].language = req.body.language;
            return res.status(200).json(users[i]);
        }
    }
    return res.status(404).json({error: "Not found"});
})

app.post('/api/users/forums/:id', (req, res) => {
    for (let i = 0; i < users.length; i++) {
        if (users[i].id == req.params.id) {
            users[i].favorites.push(req.body.add);
            return res.status(200).json(users[i]);
        }
    }
    return res.status(404).json({error: "Not found"});
})

app.delete('/api/users/forums/:id', (req, res) => {
    for (let i = 0; i < users.length; i++) {
        if (users[i].id == req.params.id) {
            users[i].favorites.splice(users[i].favorites.indexOf(req.query.favorite), 1);
            return res.status(200).json(users[i]);
        }
    }
    return res.status(404).json({error: "Not found"});
})

app.delete('/api/users/:id', (req, res) => {
    for (let i = 0; i < users.length; i++) {
        if (users[i].id == req.params.id) {
            users.splice(i, 1);
            return res.status(200).json(users);
        }
    }
    return res.status(404).json({error: "Not found"});
})

app.put('/api/users/:id', (req, res) => {
    for (let i = 0; i < users.length; i++) {
        if (users[i].id == req.params.id) {
            for (let prop in req.body) {
                users[i][prop] = req.body[prop];
            }
            return res.status(200).json(users[i]);
        }
    }
    return res.status(404).json({error: "Not found"});
})


app.listen(port, () => {console.log(`Listening on port ${port}`)});

module.exports = app;