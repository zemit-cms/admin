import {RouteLocationNormalized, NavigationGuardNext} from 'vue-router'
import {Identity} from 'zemit-sdk'
import {nestedArrayOr} from 'zemit-sdk'

const roleGuard = (role: nestedArrayOr<string>) => {

  return (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {

    // User logged in
    if (Identity.isLoggedIn()) {

      // User not authorized
      if (!Identity.hasRole(role)) {

        // Dispatch to the Error View (Forbidden)
        return next({name: 'error', params: {type: 'forbidden'}})
      }
    }

    // User not logged in
    else {

      const rewrite = {name: 'login', params: {redirect: to.fullPath}}
      next(rewrite)

      // if (Main.$vue) {
      //   d.d('beforeEnter:render', 'Auth');
      //   Main.render(Auth, (vue: Vue) => {
      //     vue.$route.params.redirect = rewrite.params.redirect;
      //   });
      // }
      return
    }

    return next()
  }
}

export default roleGuard
