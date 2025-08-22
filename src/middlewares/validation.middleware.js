export const isValid = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate({ ...req.body, ...req.params, ...req.query }, { abortEarly: false })

        if (error) {
            throw new Error(error, { cause: 400 })
        }

        next()
    }
}