export default class UserDTO {
    constructor (user) {
        this.email = user.email.toLowerCase()
        this.role = user.role.toUpperCase()
        this.cart = user.cart
    }
}