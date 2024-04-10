import {RouteLocationNormalized, NavigationGuardNext} from 'vue-router'
import {Identity} from 'zemit-sdk'

const authGuard = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {

  // If user is already logged in
  if (Identity.isLoggedIn()) {

    // Dispatch to the Home View
    return next({name: 'Home'})
  }

  return next()
}

export default authGuard
