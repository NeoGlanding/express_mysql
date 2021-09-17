const {promisify} = require('util')
const express = require('express');
const mysql = require('mysql');

const app = express();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'skilvuljaya',
    password: 'Sk1lvulJ@y@',
    database: 'address_book'
});

connection.connect(err => {
    if (err) {
        console.log(errr)
    } else {
        console.log('Connected')
    }
})

app.use(express.urlencoded({extended: true}));




// CRUD Contacts
app.get('/contacts', (req, res) => {
    connection.query('SELECT * FROM contacts', (err, results) => {
        if (err) {
            res.status(500).json({
                msg: err || 'internal server error'
            })
        } else {
            res.status(200).json({
                status: 'success',
                results
            })
        }
    })
});

app.get('/contacts/:id', (req, res) => {
    connection.query(`SELECT * FROM contacts WHERE id=${req.params.id}`, (err, result) => {
        if (err) {
            res.status(500).json({
                message: err || 'internal server error'
            });
        } else {
            res.status(200).json({
                status: 'success',
                result
            })
        }
    })
})

app.post('/contacts', (req, res) => {
    const {nama, perusahaan, email, nomor_telefon} = req.body;
    if (!nama.length) {
        return res.status(400).json({
            message: 'Please fill the name'
        })
    }

    const data = {
        nama,
        perusahaan,
        email,
        nomor_telefon
    }

    connection.query('INSERT INTO contacts SET ?', data, (err, results) => {
        if (err) {
            res.status(500).json({
                message: err | 'internal server error'
            })
        } else {
            res.status(201).json({
                status: 'success',
                data
            })
        }
    })
});

app.patch('/contacts/:id', (req, res) => {
    const {id} = req.params;

    const {nama, perusahaan, email, nomor_telefon} = req.body;

    let data = {
        nama,
        perusahaan,
        email,
        nomor_telefon
    }

    for (let undef in data) {
        if (!data[undef]) delete data[undef]
    }

    connection.query('UPDATE contacts SET ?', data, (err) => {
        if (err) {
            res.status(500).json({
                message: err || 'internal server error'
            })
        } else {
            connection.query(`SELECT * FROM contacts WHERE id=${id}`, (err, results) => {
                if (err) {
                    return res.status(500).json({
                        message: err || 'internal server error'
                    });
                } else {
                    res.status(200).json({
                        message: 'success',
                        results
                    })
                }
            })
        }
    })
});

app.delete('/contacts/:id', (req, res) => {
    connection.query(`DELETE FROM contacts WHERE id=${req.params.id}`, (err) => {
        if (err) {
            res.status(500).json({
                message: 'Internal server error',
            })
        } else {
            res.status(204).json({})
        }
    })
});


// CRUD Groups
app.get('/groups', (req, res) => {
    connection.query('SELECT * FROM groups_', (err, results) => {
        if (err) {
            res.status(500).json({
                msg: err || 'internal server error'
            })
        } else {
            res.status(200).json({
                status: 'success',
                results
            })
        }
    })
});

app.get('/contacts/:id', (req, res) => {
    connection.query(`SELECT * FROM contacts WHERE id=${req.params.id}`, (err, result) => {
        if (err) {
            res.status(500).json({
                message: err || 'internal server error'
            });
        } else {
            res.status(200).json({
                status: 'success',
                result
            })
        }
    })
});

app.post('/groups', (req, res) => {
    const {nama} = req.body;
    if (!nama.length) {
        return res.status(400).json({
            message: 'Please fill the name'
        })
    }

    const data = {
        nama
    }

    connection.query('INSERT INTO groups_ SET ?', data, (err, results) => {
        if (err) {
            res.status(500).json({
                message: err | 'internal server error'
            })
        } else {
            res.status(201).json({
                status: 'success',
                data
            })
        }
    })
});

app.patch('/groups/:id', (req, res) => {
    const {id} = req.params;

    const {nama} = req.body;

    if (!nama) {
        return res.status(400).json({
            message: 'Please fill your name'
        })
    }

    const data = {nama}

    connection.query('UPDATE groups_ SET ?', data, (err) => {
        if (err) {
            res.status(500).json({
                message: err || 'internal server error'
            })
        } else {
            connection.query(`SELECT * FROM groups_ WHERE id=${id}`, (err, results) => {
                if (err) {
                    return res.status(500).json({
                        message: err || 'internal server error'
                    });
                } else {
                    res.status(200).json({
                        message: 'success',
                        results
                    })
                }
            })
        }
    })
});

app.delete('/contacts/:id', (req, res) => {
    connection.query(`DELETE FROM groups_ WHERE id=${req.params.id}`, (err) => {
        if (err) {
            res.status(500).json({
                message: err || 'Internal server error',
            })
        } else {
            res.status(204).json({})
        }
    })
});


// CRUD Groups and Contact

app.get('/contacts/:contactsid/groups', (req, res) => {
    connection.query(`SELECT contacts.nama, groups_.nama FROM contacts JOIN groups_contact 
    ON contacts.id=groups_contact.contact_id JOIN groups_ 
    ON groups_.id=groups_contact.group_id WHERE contacts.id = ${req.params.contactsid};`, (err, result) => {
        if (err) {
            res.status(500).json({
                status: err || 'internal server error'
            })
        } else {
            res.status(200).json({
                status: 'success',
                result
            })
        }
    })
})

app.post('/contacts/:contactsid/groups', (req, res) => {
    let {group_id} = req.body
    connection.query(`INSERT INTO groups_contact(group_id, contact_id) 
    VALUES (${group_id}, ${req.params.contactsid});`, (err) => {
        if (err) {
            res.status(500).json({
                status: err || 'internal server error'
            })
        } else {
            res.status(201).json({
                status: 'success',
            })
        }
    })
});

app.patch('/contacts/:contactsid/groups/:groupsid', (req, res) => {
    let {new_group} = req.body;
    connection.query(`UPDATE groups_contact SET group_id = ${new_group} 
    WHERE contact_id=${req.params.contactsid} AND group_id=${req.params.groupsid};`, (err, resu) => {
        if (err) {
            res.status(500).json({
                message: err || 'internal server error'
            })
        } else {
            res.status(200).json({
                status: 'success',
                message: resu
            })
        }
    })
});

app.delete('/contacts/:contactsid/groups/:groupsid', (req, res) => {
    let {contactsid, groupsid} = req.params;
    connection.query(`DELETE FROM groups_contact WHERE group_id = ${groupsid} 
    AND contact_id = ${contactsid};`, (err) => {
        if (err) {
            res.status(500).json({
                message: err || 'internal server error'
            })
        } else {
            res.status(204).json({})
        }
    })
});

app.listen(3000, () => console.log('running at port 3000'));