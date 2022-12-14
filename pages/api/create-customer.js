import paystack from "paystack";
import supabase from "../../utils/supabaseClient";
const Paystack = paystack(process.env.SECRET_KEY)


export default async function createCustomer(req, res) {
    const customers = await Paystack.customer.create({
        email: req.body.record.email
    })
    await supabase.from('my_users').update({ customer: customers.data.customer_code }).eq('id', req.body.record.id)
    res.send({ message: `Customer created ${customers.data.customer_code}` })
}