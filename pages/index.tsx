import type { NextPage } from 'next'
import Head from 'next/head'
import React from 'react'
import Layout from '../components/Layout'
import LoginForm from '../components/LoginForm'
import Room from '../components/Room'
import useUser from '../lib/useUser'

const Home: NextPage = () => {
  const { user } = useUser()

  return (
    <Layout IS_PLACE_LOGOUT_BUTTON={user?.loginPasswordIsExist ?? false}>
      <Head>
        <title>Web Remote Desktop</title>
      </Head>

      {user && (
        <>
          {user.isLoggedIn
            ? <Room />
            : <LoginForm />}
        </>
      )}
    </Layout>
  )
}

export default Home
