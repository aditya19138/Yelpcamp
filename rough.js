const express = require('express');
const app = express();
const session = require('express-session');

app.use(session({ secret: 'Hello' }))

app.get("/viewcount", (req, res) => {
    if (req.session.count) req.session.count += 1;
    else req.session.count = 1;

    res.send(`You have viewd this page ${req.session.count} times`)
})

app.listen(3000, () => {
    console.log("listening on port 3000")
})
