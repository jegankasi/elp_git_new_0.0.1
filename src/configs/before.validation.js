const _ = require("underscore");

const validate = (formField, requiredField, field) => {
    let error = {};
    if (requiredField[0] === "required") {
        // error[field] = requiredField[0] === "required" && !formField ? `${field} is required` : typeof formField != requiredField[1] ? `${field} should be ${requiredField[1]}` : undefined;

        //accept zero
        if (formField === 0 || formField === true || formField === false) {
            //error[field] = `${field} is required`;
        }
        else if (!formField) {
            error[field] = `${field} is required`;
        } else if (typeof requiredField[1] !== 'function' && typeof formField != requiredField[1]) {
            error[field] = `${field} should be ${requiredField[1]}`;
        } else if (typeof requiredField[1] === 'function') {
            let enumItm = requiredField[1](formField).find(element => element == formField);

            // error[field] = `${field} should be ${requiredField[1]}`;
        } else if (typeof requiredField[2] !== 'undefined' && typeof requiredField[3] !== 'undefined') {
            if (formField.length < requiredField[2] || formField.length > requiredField[3]) {
                error[field] = `minimum string length ${requiredField[2]} and maximum ${requiredField[3]}`;
            }
        }
    }
    else if ((requiredField[0] === "noRequired" && formField)) {
        if (typeof formField != requiredField[1]) {
            error[field] = `${field} should be ${requiredField[1]}`;
        } else if (typeof requiredField[2] !== 'undefined' && typeof requiredField[3] !== 'undefined') {
            if (formField.length < requiredField[2] || formField.length > requiredField[3]) {
                error[field] = `minimum string length ${requiredField[2]} and maximum ${requiredField[3]}`;
            }
        }
    }
    return error;
};

const formValidation = (requiredFields, formData) => {
    return new Promise((resolve, reject) => {
        let error = {};
        requiredFields.forEach(data => {
            const field = Object.keys(data)[0];
            const requiredField = data[field];
            const formField = formData && formData[field];
            const validError = validate(formField, requiredField, field);
            if (!_.isEmpty(validError)) {
                error = { ...error, ...validError }
            }
        })
        Object.keys(error).length > 0 ? reject(error) : resolve("valid object");
    })
}

module.exports = {
    formValidation
}