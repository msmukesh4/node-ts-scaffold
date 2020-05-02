class BaseError extends Error {
    code: number = 0;
    message: string = "";

    constructor(code: number, message: string) {
        super(message);
        this.message = message;
        this.code = code;
        Error.captureStackTrace(this, BaseError);
    }

    toJSON() {
        let alt : any = {};

        Object.getOwnPropertyNames(this).forEach(function (key) {
            if (key !== 'stack') {
                alt[key] = key;
            }
        }, this);

        return alt;
    }
}

class EntityNotFound extends BaseError {
    constructor(message: string) {
        super(0, message);
        Object.setPrototypeOf(this, EntityNotFound.prototype);
    }
}

class WrongInput extends BaseError {
    constructor(message: string) {
        super(0, message);
        Object.setPrototypeOf(this, WrongInput.prototype);
    }
}

class SocialAuthError extends BaseError {
    constructor(code: number, message: string) {
        super(code, message);
        Object.setPrototypeOf(this, SocialAuthError.prototype);
    }
}

const errors = {
    wrongInput: WrongInput,
    entityNotFound: EntityNotFound
};

export {WrongInput, EntityNotFound, SocialAuthError, errors};