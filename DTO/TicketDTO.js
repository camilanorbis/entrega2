export default class TicketDTO {

    constructor (ticket) {
        this.ticketNumber = ticket.ticketNumber
        this.products = ticket.products.map(p => ({
            title: p.productId.title,
            quantity: p.quantity
        }))
        this.user = {
            first_name: ticket.userId.first_name,
            last_name: ticket.userId.last_name
        }

        this.date = this.formatDate(ticket.date)
        this.totalAmount = '$' + ticket.totalAmount
    }

    formatDate(date) {
        const formatted = new Date(date).toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
        })

        return formatted.charAt(0).toUpperCase() + formatted.slice(1)
    }

}