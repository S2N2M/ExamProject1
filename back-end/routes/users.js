const express = require('express');
const router = express.Router();
const db = require('../models');
const UserService = require('../services/UserService')
const userService = new UserService(db);
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { authenticate, isAdmin } = require('../middleware/authMiddleware');


function validateUserData(data, fieldsRequired = []) {
    const errors = [];
    const { firstname, lastname, username, email, password, address, phone, membershipId, roleId } = data;

    const checkFields = {
        firstname: !firstname,
        lastname: !lastname,
        username: !username,
        email: !email,
        password: !password,
        address: !address,
        phone: !phone,
        membershipId: !membershipId,
        roleId: !roleId
    }

    // Validate fields passed in function
    fieldsRequired.forEach(field => {
        if (checkFields[field]) {
            errors.push(`Missing property: ${field}`)
        }
    })

    // Membership, role validation for updating
    if (membershipId !== undefined && roleId !== undefined) {
        if (isNaN(membershipId) || isNaN(roleId)) {
            errors.push('Invalid membership/role format')
        }
    }

    // Email format validation
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('Invalid email format');
    }

    return errors;
}

// POST /auth/register - Guests can register a new account
router.post('/register', async (req, res) => {
    /*
        #swagger.tags = ['Auth']
        #swagger.summary = 'Register new user'
        #swagger.description = 'Guests can register a new account'
        #swagger.parameters['body'] = {
            'in': 'body',
            'description': 'Register a new user',
            'required': 'true',
            'schema': {
                $ref: '#/definitions/CreateUser'
            }
        }
        #swagger.responses[201] = {
            'schema': {
                $ref: '#/definitions/UserCreated'
            }
        }
    */

    const userData = req.body;
    const errors = validateUserData(userData, ['firstname', 'lastname', 'username', 'email', 'password', 'address', 'phone']);

    if (errors.length) {
        return res.status(400).json({
            status: 'error',
            statusCode: 400,
            data: {
                result: errors.join(', ')
            }
        });
    }

    try {
        // Check if email/username exists
        const existingUser = await userService.verifyUser(userData);

        if (existingUser) {
            return res.status(409).json({
                status: 'error',
                statusCode: 409,
                data: {
                    result: 'Email or username already in use.'
                }
            });
        }

        // Hash password with salt
		const salt = crypto.randomBytes(16)
		const hashedPassword = await new Promise((resolve, reject) => {
			crypto.pbkdf2(userData.password, salt, 310000, 32, "sha256", (err, hash) => {
				if (err) return reject(err)
				resolve(hash)
			})
		})

        // Create a new user
        await userService.create(userData, hashedPassword, salt);

        res.status(201).json({
            status: 'success',
            statusCode: 201,
            data: {
                result: 'User successfully created.'
            }
        });
    } catch (err) {
        console.error('Error signing up:', err.message);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            data: {
                result: 'An error occurred while trying to sign up.'
            }
        })
    }
});

// POST /auth/login - Login for registered users
router.post('/login', async (req, res) => {
    /*
        #swagger.tags = ['Auth']
        #swagger.summary = 'Login for registred users'
        #swagger.description = 'Users can log in with their registered account'
        #swagger.parameters['body'] = {
            'in': 'body',
            'description': 'Login for users',
            'required': 'true',
            'schema': {
                $ref: '#/definitions/LoginUser'
            }
        }
        #swagger.responses[200] = {
            'schema': {
                $ref: '#/definitions/UserLoggedIn'
            }
        }
    */
    const { username, password } = req.body;
    
    // Validate username and password
    if (!username || !password) {
        return res.status(400).json({
            status: 'error',
            statusCode: 400,
            data: {
                result: 'Username and password are required.'
            }
        })
    }

    try {
        // Get user by username
        const user = await userService.getOne(username);

        if (!user) {
            return res.status(401).json({
                status: 'error',
                statusCode: 401,
                data: {
                    result: 'Incorrect username or password.'
                }
            })
        }

        // Hash input password
        const hashedPassword = await new Promise((resolve, reject) => {
			crypto.pbkdf2(password, user.Salt, 310000, 32, "sha256", (err, hash) => {
				if (err) return reject(err);
				resolve(hash);
			});
		});

        // Match the two passwords
		if (!crypto.timingSafeEqual(user.EncryptedPassword, hashedPassword)) {
			return res.status(401).json({
                status: 'error', 
				statusCode: 401,
				data: {
                    result: 'Incorrect username or password.' 
                }
			});
		}

        // Generate JWT Token
        const token = jwt.sign(
            { id: user.id, username: user.Username, role: user.RoleId},
            process.env.TOKEN_SECRET,
            { expiresIn: '2h' } // Token expires in 2 hours
        )

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            data: {
                result: 'Successfully logged in.',
                id: user.id,
                role: user.RoleId,
                username: user.Username,
                email: user.Email,
                token
            }
        })
    } catch (err) {
        console.error('Error logging in:', err.message);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            data: {
                result: 'An error occurred while trying to login.'
            }
        })
    }
});

// GET /auth/users - Fetch all users (Admin only)
router.get('/users', authenticate, isAdmin, async (req, res) => {
    /*
        #swagger.tags = ['Auth']
        #swagger.summary = 'Fetch all users'
        #swagger.description = 'Fetch all registered users. Required admin authentication.'
        #swagger.responses[200] = {
            'schema': {
                $ref: '#/definitions/UsersFetched'
            }
        }
    */
    try {
        const users = await userService.users()

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            data: {
                result: 'Showing all users:',
                users: users
            }
        })
    } catch (err) {
        console.error('Error getting users:', err.message);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            data: {
                result: 'An error occurred while trying to fetch users.'
            }
        })
    }
})

// GET /auth/users/id - Fetch user by ID (Admin only)
router.get('/users/:id', authenticate, isAdmin, async (req, res) => {
    /*
        #swagger.tags = ['Auth']
        #swagger.summary = 'Fetch a user'
        #swagger.description = 'Fetch a user by ID. Required admin authentication.'
        #swagger.parameters['id'] = {
            'in': 'path',
            'description': 'ID of the user to fetch'
            'required': 'true',
            type: 'integer'
        }
        #swagger.responses[200] = {
            'schema': {
                $ref: '#/definitions/UserFetched'
            }
        }
    */

    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(422).json({
            status: 'error',
            statusCode: 422,
            data: {
                result: 'ID is not in correct format.'
            }
        })
    }

    if (!id) {
        return res.status(400).json({
            status: 'error',
            statusCode: 400,
            data: {
                result: 'ID is required.'
            }
        })
    }
    try {
        const result = await userService.getUser(id);

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            data: {
                result: 'User found:',
                user: result
            }
        });


    } catch (err) {
        console.error('Error getting user:', err.message);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            data: {
                result: 'An error occurred while trying to fetch user.'
            }
        })
    }
})

// PUT /auth/users/id - Update an existing user (Admin only)
router.put('/users/:id', authenticate, isAdmin, async (req, res) => {
    /*
        #swagger.tags = ['Auth']
        #swagger.summary = 'Update a user'
        #swagger.description = 'Update a user by ID. Required admin authentication.'
        #swagger.parameters['id'] = {
            'in': 'path',
            'description': 'ID of the user to update'
            'required': 'true',
            type: 'integer'
        }
        #swagger.parameters['body'] = {
            'in': 'body',
            'description': 'Login for users',
            'required': 'true',
            'schema': {
                $ref: '#/definitions/UpdateUser'
            }
        }
        #swagger.responses[200] = {
            'schema': {
                $ref: '#/definitions/UserUpdated'
            }
        }
    */

    // Validate of requst body is empty
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
            status: 'error',
            statusCode: 400,
            data: {
                result: 'User data is required for update.'
            }
        });
    }
    const userData = req.body;
    const errors = validateUserData(userData, ['firstname', 'lastname', 'username', 'email', 'membershipId', 'roleId']);
    const id = parseInt(req.params.id);
    const userExists = await userService.verifyUser(userData);

    if (errors.length) {
        return res.status(400).json({
            status: 'error',
            statusCode: 400,
            data: {
                result: errors.join(', ')
            }
        });
    }

    if (userExists && userExists.id !== id) {
        return res.status(409).json({
            status: 'error',
            statusCode: 409,
            data: {
                result: 'User with this username or email already exists.'
            }
        });
    }

    if (isNaN(id)) {
        return res.status(422).json({
            status: 'error',
            statusCode: 422,
            data: {
                result: 'ID is not in correct format.'
            }
        })
    }

    if (!id) {
        return res.status(400).json({
            status: 'error',
            statusCode: 400,
            data: {
                result: 'ID is required.'
            }
        })
    }

    try {
        const user = await userService.getUser(id);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                statusCode: 404,
                data: {
                    result: 'User not found.'
                }
            })
        };

        const result = await userService.update(userData, id);

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            data: {
                result: 'User is updated:',
                user: result
            }
        })

    } catch (err) {
        console.error('Error updating user:', err.message);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            data: {
                result: 'An error occurred while trying to update user.'
            }
        })
    }
})

module.exports = router;