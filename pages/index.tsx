import type { NextPage } from 'next'
import Head from 'next/head'
import React from 'react'
import LoginForm from '../components/LoginForm'
import LogoutButton from '../components/LogoutButton'
import Room from '../components/Room'
import useUser from '../lib/useUser'

const Home: NextPage = () => {
  const { user } = useUser()

  return (
    <>
      <Head>
        <title>Web Remote Desktop</title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </Head>

      {user?.isLoggedIn === true && (user?.loginPasswordIsExist ?? false) &&
        <LogoutButton />
      }

      <div className="container">
        {
          user && (
            <>
              {user.isLoggedIn
                ? <Room />
                : <LoginForm />}
            </>
          )
        }
      </div>
    </>
  )
}

export default Home
