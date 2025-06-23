export class NotFoundError extends Error {
    constructor(message = 'Not Found') {
        super(message);
        this.name = 'NotFoundError';
        this.statusCode = 404;
    }
}

export class ValidationError extends Error {
    constructor(message = 'Validation Error') {
        super(message);
        this.name = 'ValidationError';
        this.statusCode = 400;
    }
}