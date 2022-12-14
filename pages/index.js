import { useEffect, useState } from 'react'
import supabase from '../utils/supabaseClient'
import { useRouter } from 'next/router'

export default function Home() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [user, setUser] = useState('')
  const [id, setId] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  async function subscribe() {
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userEmail: user
      })
    })
    const { data } = await res.json()
    router.push(data.authorization_url)
  }
  async function sendLogin(e) {
    e.preventDefault()
    let { data, error } = await supabase.auth.signInWithOtp({ email })
    if (error) {
      console.log(error)
    }
    setMessage(`Email sent to ${email}`)
  }
  useEffect(() => {
    async function getUser() {
      let { data } = await supabase.auth.getUser()
      if (data.user) {
        setUser(data.user.email)
        setId(data.user.id)
      } else { return }
      await getSubcribed()
    }
    async function getSubcribed() {
      let { data, error } = await supabase.from('my_users').select('subscribed').eq('id', id)
      if (data) {
        setSubscribed(data[0].subscribed)
      }
    }
    getUser()
    setLoading(false)
  }, [id])
  return (
    <>
      {
        loading ? (
          <p className="flex flex-col justify-center items-center h-screen text-4xl lg:text-8xl">Please be patient ...</p>
        ) : (
            <div className="flex flex-col justify-center items-center h-screen">
              <h1 className='text-4xl text-gray-700 font-extrabold mb-10 lg:text-6xl'>Hello {user}</h1>
      {user ? (
        <div>
          <p>Welcome {user}</p>
          {!subscribed ? (
            <p>You are not subscribed</p>
          ) : (
            <p>You are subscribed</p>
          )}
          {subscribed ? (
            <p className='mt-5'>Thanks for subscribing</p>
          ) : (
            <button className='bg-green-700 text-white py-3 px-5 rounded mt-5' onClick={subscribe}>SUBSCRIBE</button>
          )}
        </div>
      ) : (
        <div>
          <form onSubmit={sendLogin}>
            <input type="email" placeholder='enter your email' value={email} onChange={(e) => setEmail(e.target.value)} />
            <button type="submit" className='bg-green-700 text-white py-3 px-5 rounded ml-5'>SEND EMAIL</button>
          </form>
          <p className='mt-5'>{message}</p>
        </div>
      )
      }
    </div>
        )}
    </>
  )
}