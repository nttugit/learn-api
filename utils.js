const response = {
    ok: (data) => ({
        data: data || {},
        message: 'success',
        status: 200,
    }),
    created: (data) => ({
        data: data || {},
        message: 'success',
        status: 201,
    }),
    badRequest: (message) => ({
        data: null,
        message,
        status: 400,
    }),
    unauthorized: (message) => ({
        data: null,
        message: message || 'unauthorized',
        status: 401,
    }),
    notfound: (message) => ({
        data: null,
        message: message || 'not found',
        status: 404,
    })
}

module.exports = {
    response
}