const request = require('supertest');
const URL = 'http://localhost:3000';

// Initilize database before running tests
describe('API Endpoints', () => {
    let token;
    test('POST /auth/login - Success', async () => {
        const userData = {
            "username": "Admin",
            "password": "P@ssword2023"
        }

        const { body } = await request(URL)
            .post('/auth/login')
            .send(userData)
        
        expect(body.status).toBe('success')
        expect(body.data).toHaveProperty('token')
        token = body.data.token
    })

    let categoryId;
    test('POST /categories - Success', async () => {
        const categoryData = {
            "name": "TEST_CATEGORY"
        }
        const { body } = await request(URL)
            .post('/categories')
            .set('Authorization', `Bearer ${token}`)
            .send(categoryData)
        
        expect(body.status).toBe('success')
        expect(body.statusCode).toEqual(201)

        categoryId = body.data.category.id
    })

    let brandId;
    test('POST /brands - Success', async () => {
        const brandData = {
            "name": "TEST_BRAND"
        }
        const { body } = await request(URL)
            .post('/brands')
            .set('Authorization', `Bearer ${token}`)
            .send(brandData)
        
        expect(body.status).toBe('success')
        expect(body.statusCode).toEqual(201)

        brandId = body.data.brand.id
    })

    let productId;
    test('POST /products - Success', async () => {
        const productData = {
            "imgurl": "temp",
            "name": "TEST_PRODUCT",
            "description": "temp",
            "price": 99.99,
            "quantity": 10,
            "categoryId": categoryId,
            "brandId": brandId
        }
        const { body } = await request(URL)
            .post('/products')
            .set('Authorization', `Bearer ${token}`)
            .send(productData)

        expect(body.status).toBe('success')
        expect(body.statusCode).toEqual(201)
        
        productId = body.data.product.id
    })

    test('GET /products/:id - Success', async () => {
        const { body } = await request(URL)
            .get(`/products/${productId}`)

        console.log(body)
        expect(body.status).toBe('success')
        expect(body.statusCode).toEqual(200)
    })

    test('PUT /categories/:id / - Success', async () => {
        const categoryName = {
            "name": "TEST_CATEGORY2"
        };
        const { body } = await request(URL)
            .put(`/categories/${categoryId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(categoryName)
        
        expect(body.status).toBe('success')
        expect(body.statusCode).toEqual(200)
    })

    test('PUT /brands/:id / - Success', async () => {
        const brandName = {
            "name": "TEST_BRAND2"
        };
        const { body } = await request(URL)
            .put(`/brands/${brandId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(brandName)
        
        expect(body.status).toBe('success')
        expect(body.statusCode).toEqual(200)
    })

    test('GET /products/:id - Success', async () => {
        const { body } = await request(URL)
            .get(`/products/${productId}`)

        console.log(body)
        expect(body.status).toBe('success')
        expect(body.statusCode).toEqual(200)
    })

    test('DELETE /products/:id - Success', async () => {
        const { body } = await request(URL)
            .delete(`/products/${productId}`)
            .set('Authorization', `Bearer ${token}`)

        expect(body.status).toBe('success')
        expect(body.statusCode).toEqual(200)
    })
})