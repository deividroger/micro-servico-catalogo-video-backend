const yup = require('yup')

const schema = yup.object().shape({
    name: yup
            .string()
            .required()
});

schema.isValid({name:'Deivid'}).then(isValid=> console.log(isValid));
