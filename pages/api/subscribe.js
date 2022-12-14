import paystack from "paystack";

const Paystack = paystack(process.env.SECRET_KEY)
let response;

export default async function subscribe(req, res) {
    if (req.method === 'POST') {
        const subscribe = await Paystack.transaction.initialize({
            amount: 10000,
            email: req.body.userEmail,
            plan: 'PLN_oeub7atz20dxeno'
        })
        response = subscribe
    }
    res.status(200).json(response)
}