const express = require('express');
const router = express.Router();
const axios = require('axios');
const { isAdmin } = require('../middleware/authMiddleware');
router.use(isAdmin);

const API = 'http://localhost:3000'

// GET /admin/users - Fetch all users
router.get('/', async (req, res) => {
    const token = req.session.token
    try {


        const [usersResponse, rolesResponse, membershipsResponse] = await Promise.all([
            await axios.get(`${API}/auth/users`, {
                headers: { Authorization: `Bearer ${token}` }
            }),
            await axios.get(`${API}/roles`, {
                headers: { Authorization: `Bearer ${token}` }
            }),
            await axios.get(`${API}/memberships`, {
                headers: { Authorization: `Bearer ${token}` }
            })
        ])

        const users = usersResponse.data.data.users
        const memberships = membershipsResponse.data.data.memberships
        const roles = rolesResponse.data.data.roles

        res.render('users', { users, memberships, roles, error: null, success: null })
    } catch (err) {
        console.error('Failed to get users:', err);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            data: {
                result: 'An error occured getting users.',
            }
        });
    }
});

// POST /admin/users/edit/id - Update user
router.post('/edit/:id', async (req, res) => {
    const token = req.session.token;
    const { id } = req.params;
    const { firstname, lastname, username, email, membershipId, roleId } = req.body;

    try {
        
        const [usersResponse, rolesResponse, membershipsResponse] = await Promise.all([
            await axios.get(`${API}/auth/users`, {
                headers: { Authorization: `Bearer ${token}` }
            }),
            await axios.get(`${API}/roles`, {
                headers: { Authorization: `Bearer ${token}` }
            }),
            await axios.get(`${API}/memberships`, {
                headers: { Authorization: `Bearer ${token}` }
            })
        ])

        const users = usersResponse.data.data.users;
        const roles = rolesResponse.data.data.roles;
        const memberships = membershipsResponse.data.data.memberships;

        const response = await axios.put(`${API}/auth/users/${id}`, 
            { firstname, lastname, username, email, membershipId, roleId  },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        return res.render('users', {
            users,
            roles,
            memberships,
            success: response.data.data.result,
            error: null
        })
    } catch (err) {
        console.error('Failed to update product:', err.message);
        const [usersResponse, rolesResponse, membershipsResponse] = await Promise.all([
            await axios.get(`${API}/auth/users`, {
                headers: { Authorization: `Bearer ${token}` }
            }),
            await axios.get(`${API}/roles`, {
                headers: { Authorization: `Bearer ${token}` }
            }),
            await axios.get(`${API}/memberships`, {
                headers: { Authorization: `Bearer ${token}` }
            })
        ])

        const users = usersResponse.data.data.users;
        const roles = rolesResponse.data.data.roles;
        const memberships = membershipsResponse.data.data.memberships;
        return res.render('users', {
            users,
            roles,
            memberships,
            success: null,
            error: err.response.data.data.result || 'An error occured updating user.'
        })
    }
});

module.exports = router;