import crypto from 'crypto'
import supabase from '../../utils/supabaseClient';

const secret = process.env.SECRET_KEY

export default async function webhooks(req, res) {
    if (req.method === 'POST') {
        const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
        if (hash == req.headers['x-paystack-signature']) {
            // Retrieve the request's body
            const event = req.body;
            if (event.event === 'charge.success') {
                await supabase.from('my_users').update({ subscribed: true }).eq('email', event.data.customer.email)
            } else if (event.event === 'subscription.not_renew') {
                await supabase.from('my_users').update({ subscribed: false }).eq('email', event.data.customer.email)
            }
            // Do something with event  
        }
    }
    res.send(200);
}