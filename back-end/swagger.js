const swaggerAutogen = require('swagger-autogen')()
const doc = {
    info: {
        version: "1.0.0",
        title: "Noroff EP e-commerce",
        description: "APIs and a database to showcase their products for customers to purchase. Admin front-end, which uses the back-end system to manage the data."
    },
    host: "localhost:3000",
    definitions: {
        BrandsFetched: {
            $status: 'success',
            $statusCode: 200,
            $data: {
                $result: 'Viewing all brands',
                $brands: ['List of all brands']
            }
        },
        CreateBrand: {
            $name: 'Microsoft'
        },
        BrandCreated: {
            $status: 'success',
            $statusCode: 201,
            $data: {
                $result: 'Created new brand',
                $brand: 'Microsoft'
            }
        },
        UpdateBrand: {
            $name: 'Amazon'
        },
        BrandUpdated: {
            $status: 'success',
            $statusCode: 200,
            $data: {
                $result: 'Brand is updated',
                $brand: 'Amazon'
            }
        },
        BrandDeleted: {
            $status: 'success',
            $statusCode: 200,
            $data: {
                $result: ['Brand is deleted']
            }
        },
        CategoriesFetched: {
            $status: 'success',
            $statusCode: 200,
            $data: {
                $result: 'Viewing all categories',
                $categories: ['List of all categories']
            }
        },
        CreateCategory: {
            $name: 'Monitors'
        },
        CategoryCreated: {
            $status: 'success',
            $statusCode: 201,
            $data: {
                $result: 'Created new category',
                $category: 'Monitors'
            }
        },
        UpdateCategory: {
            $name: 'Keyboards'
        },
        CategoryUpdated: {
            $status: 'success',
            $statusCode: 200,
            $data: {
                $result: 'Category is updated',
                $category: 'Keyboards'
            }
        },
        CategoryDeleted: {
            $status: 'success',
            $statusCode: 200,
            $data: {
                $result: ['Category is deleted']
            }
        },
        GetCart: {
            $status: 'success',
            $statusCode: 200,
            $data: {
                $result: 'Products in cart:',
                $cart: [
                    {
                        $ProductId: 8,
                        $ProductName: 'Samsung S20',
                        $Price: '900',
                        $Quantity: 2,
                        $TotalPrice: 1800 
                    }
                ]
            }
        },
        AddToCart: {
            $productId: 1,
            $quantity: 2
        },
        CartSuccess: {
            $status: 'success',
            $statusCode: 201,
            $data: {
                $result: 'Product added to cart',
                $cart: [
                    {
                        $id: 10,
                        $CartId: 1,
                        $ProductId: 8,
                        $Quantity: 2,
                        $updatedAt: 'Cart last updated',
                        $createdAt: 'Cart created'
                    }
                ]
            }
        },
        CheckoutOrder: {
            $status: 'success',
            $statusCode: 201,
            $data: {
                $result: 'Order created.',
                $cart: [
                    {
                        $id: 5,
                        $UserId: 2,
                        $OrderNumber: 'j8a72g31',
                        $Status: 'In Progress',
                        $MembershipStatus: 'Bronze',
                        $TotalPrice: '1800',
                        $updatedAt: 'Order update',
                        $createdAt: 'Ordered created'
                    }
                ]
            }
        },
        RemoveProduct: {
            $productId: 1,
            $quantity: 1
        },
        ProductRemoved: {
            $status: 'success',
            $statusCode: 200,
            $data: {
                $result: 'Product removed from cart.'
            }
        },
        MembershipsFetched: {
            $status: 'success',
            $statusCode: 200,
            $data: {
                $result: 'Viewing all memberships.',
                $memberships: [
                    {
                        $id: 1,
                        $Status: 'Bronze',
                        $MinItems: 0,
                        $MaxItems: 15,
                        $DiscountPercent: 0
                    },
                ]
            }
        },
        UsersMembership: {
            $status: 'success',
            $statusCode: 200,
            $data: {
                $result: 'Viewing all users membership',
                $memberships: [
                    {
                        $Gold: {
                            $Firstname: 'John',
                            $Lastname: 'Doe',
                            $Username: 'JohnDoe1',
                            $Email: 'Johndoe@example.com',
                            $Membership: {
                                $Status: 'Gold'
                            }
                        }
                    }
                ]
            }
        },
        UserOrder: {
            $status: 'success',
            $statusCode: 200,
            $data: {
                $result: 'Viewing all orders from user:',
                $orders: [
                    {
                        $id: 1,
                        $OrderNumber: 'j8a72g31',
                        $Status: 'In Progress',
                        $MembershipStatus: 'Bronze',
                        $TotalPrize: '650.00',
                        $createdAt: 'Purchase date',
                        $updatedAt: 'Last status update',
                        $UserId: 2,
                        $OrderItems: ['List of products ordered']
                    }
                ]
            }
        },
        AllOrders: {
            $status: 'success',
            $statusCode: 200,
            $data: {
                $result: 'Viewing all orders:',
                $orders: [
                    {
                        $id: 1,
                        $OrderNumber: 'j8a72g31',
                        $Status: 'In Progress',
                        $MembershipStatus: 'Bronze',
                        $TotalPrize: '650.00',
                        $createdAt: 'Purchase date',
                        $updatedAt: 'Last status update',
                        $UserId: 2,
                        $OrderItems: ['List of products ordered']
                    }
                ]
            }
        },
        OrderStatus: {
            $status: ['In Progress', 'Ordered', 'Completed']
        },
        UpdateOrder: {
            $status: 'success',
            $statusCode: 200,
            $data: {
                $result: 'Order has been updated',
                $orders: ['In Progress', 'Ordered', 'Completed']
            }
        },
        Initilize: {
            $status: 'success',
            $statusCode: 200,
            $data: {
                $result: ['Created products in the database', 'Created memberships in the database.', 'Created roles in the database.']
            }
        },
        ProductsFetched: {
            $status: 'success',
            $statusCode: 200,
            $data: {
                $result: 'Viewing all products:',
                $products: ['List of all products. Admin authentication for deleted products']
            }
        },
        ProductFetched: {
            $status: 'success',
            $statusCode: 200,
            $data: {
                $result: 'Product found:',
                $products: [
                    {
                        $id: 1,
                        $Name: 'iPhone 16 128GB',
                        $Price: '1299.00',
                        $Quantity: 3,
                        $Brand: 'Apple',
                        $BrandId: 1,
                        $Category: 'Phones',
                        $CategoryId: 1,
                        $Imgurl: 'imgurl',
                        $IsDeleted: '0/1(BOOLEAN: false(0), true(1))',
                        $DataAdded: 'Date product added',
                        $updatedAt: 'Last update to product'
                    }
                ]
            }
        },
        CreateProduct: {
            $imgurl: 'imgurl',
            $name: 'Product Name',
            $description: 'Product description',
            $price: 499,
            $quantity: 10,
            $categoryId: 2,
            $brandId: 4,
        },
        ProductCreated: {
            $status: 'success',
            $statusCode: 201,
            $data: {
                $result: 'Created a new product:',
                $product: [
                    {
                        $name: 'Product Name',
                        $description: 'Product description',
                        $price: 499,
                        $quantity: 10,
                        $categoryId: 2,
                        $brandId: 4,
                        $imgurl: 'imgurl',
                        $DataAdded: 'Date product got added',
                        $updatedAt: 'Last update to the product',
                        $IsDeleted: 'Default value 0 (false) BOOLEAN'
                    }
                ]
            }
        },
        UpdateProduct: {
            $imgurl: 'imgurl',
            $name: 'New Product Name',
            $description: 'New Product description',
            $price: 699,
            $quantity: 15,
            $categoryId: 2,
            $brandId: 4,
        },
        ProductUpdated: {
            $status: 'success',
            $statusCode: 200,
            $data: {
                $result: 'Product is updated:',
                $product: {
                    $Imgurl: 'imgurl',
                    $Name: 'New Product Name',
                    $Description: 'New Product description',
                    $Price: 699,
                    $DataAdded: 'Date product got added',
                    $IsDeleted: 'Default value 0 (false) BOOLEAN',
                    $UpdatedAt: 'Last update to the product',
                    $Quantity: 15,
                    $CategoryId: 2,
                    $BrandId: 4,
                }
            }
        },
        ProductDeleted: {
            $status: 'success',
            $statusCode: 200,
            $data: {
                $result: 'Product is deleted.'
            }
        },
        ProductRestored: {
            $status: 'success',
            $statusCode: 200,
            $data: {
                $result: 'Product is restored.'
            }
        },
        RolesFetched: {
            $status: 'success',
            $statusCode: 200,
            $data: {
                $result: 'View all roles:',
                $roles: [
                    {
                        $id: 1,
                        $Name: 'Role Name'
                    }
                ]
            }
        },
        CreateUser: {
            $firstname: 'John',
            $lastname: 'Doe',
            $username: 'john123',
            $email: 'johndoe@example.com',
            $password: 'S3CUR3P455W0RD',
            $address: 'Lake tahoe 301',
            $phone: '901894712',
        },
        UserCreated: {
            $status: 'success',
            $statusCode: 201,
            $data: {
                $result: 'User successfully created.'
            }
        },
        LoginUser: {
            $username: 'john123',
            $password: 'S3CUR3P455W0RD'
        },
        UserLoggedIn: {
            $status: 'success',
            $statusCode: 200,
            $data: {
                $result: 'Successfully logged in.',
                $id: 4,
                $role: 2,
                $username: 'john123',
                $email: 'johndoe@example.com',
                $token: 'SECRET JWT TOKEN'
            }
        },
        UsersFetched: {
            $status: 'success',
            $statusCode: 200,
            $data: {
                $result: 'Showing all users:',
                $users: ['List of all users']
            }
        },
        UserFetched: {
            $status: 'success',
            $statusCode: 200,
            $data: {
                $result: 'User found:',
                $users: [
                    {
                        $id: 4,
                        $Firstname: 'John',
                        $Lastname: 'Doe',
                        $Username: 'john123',
                        $Email: 'johndoe@example.com',
                        $Address: 'Lake tahoe 301',
                        $Phone: '901894712',
                        $createdAt: 'Date user account got created',
                        $updatedAt: 'Last update to user',
                        $MembershipId: 2,
                        $RoleId: 2
                    }
                ]
            }
        },
        UpdateUser: {
            $firstname: 'Johnny',
            $lastname: 'Doi',
            $username: 'johnny321',
            $email: 'johnnydoe@example.com',
            $membershipId: 3,
            $roleId: 2
        },
        UserUpdated: {
            $status: 'success',
            $statusCode: 200,
            $data: {
                $result: 'User is updated:',
                $user: [
                    {
                        $Firstname: 'Johnny',
                        $Lastname: 'Doi',
                        $Username: 'johnny321',
                        $Email: 'johnnydoe@example.com',
                        $Address: 'Lake tahoe 301',
                        $Phone: '901894712',
                        $MembershipId: 3,
                        $RoleId: 2
                    }
                ]
            }
        },
        Search: {
            
        }
    }
}

const outputFile = './swagger-output.json'
const endpointsFiles = ['./app.js']

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./bin/www')
})

