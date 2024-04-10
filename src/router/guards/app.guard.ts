import {RouteLocationNormalized, NavigationGuardNext} from 'vue-router'
import {Identity} from 'zemit-sdk'

const appGuard = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {

  // If user is not logged in
  if (!Identity.isLoggedIn()) {

    // Dispatch to the Login View
    next({
      name: 'Login',
      params: to.name === 'error' ? {} : {redirect: to.fullPath},
    })

    // if (Main.$vue) {
    //   d.d('beforeEnter:render', 'Auth');
    //   Main.render(Auth, (vue: Vue) => {
    //     if (to.name === 'error') {
    //       vue.$route.params.redirect = to.fullPath;
    //     }
    //   });
    // }

    return
  }

  return next()
}

export default appGuard
