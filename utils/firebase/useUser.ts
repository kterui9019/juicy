import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import {
  removeUserCookie,
  setUserCookie,
  getUserFromCookie,
} from './userCookies'
import { mapUserData } from './mapUserData'

const useUser = () => {
  const [user, setUser] = useState()
  const router = useRouter()

  const logout = async () => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        // Sign-out successful.
        router.push('/login')
      })
      .catch((e) => {
        console.error(e)
      })
  }

  useEffect(() => {
    // Firebase updates the id token every hour, this
    // makes sure the react state and the cookie are
    // both kept up to date
    const cancelAuthListener = firebase.auth().onIdTokenChanged((user) => {
      if (user) {
        mapUserData(user).then(userData => {
          console.log('useUser', userData)
          setUserCookie(userData)
          setUser(userData)
        })
      } else {
        removeUserCookie()
        setUser(null)
      }
    })

    const userFromCookie = getUserFromCookie()
    if (!userFromCookie) {
      router.push('/')
      return
    }
    setUser(userFromCookie)

    return () => {
      cancelAuthListener()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { user, logout }
}

export { useUser }
