/**
 * Before jump to another route, need to check if user has the permiision
 * so here, use router guard method , .beforeEach: check before jumping, .afterEach: check after jumping
 */

/**
 * beforeEach(to, from, next)
 * where next must be executed,
 * next() means pass
 * nest(false) means stop jumping
 * next(address) means jump to the address
 */

import router from '@/router'
import store from '@/store'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

const whiteList = ['/login', '/404']
// check before jump route
router.beforeEach(async(to, from, next) => {
  // start the progress bar
  nprogress.start()
  /**
   * if user has token
   *   if user wanna go login, then go main page
   *   if user wanna go other page, let it pass
   * if user has no token
   *   if user wanna go whiteList page(login,404), let it pass
   *   if user wanna to other pages, then go to login
   */
  if (store.getters.token) {
    if (to.path === '/login') {
      next('/') // go to main page
    } else {
      if (!store.getters.userId) {
        // if current user already has no id means havent have user information before
        // this getUserInfo func return userInfo obj as result
        const { roles } = await store.dispatch('user/getUserInfo')

        // according to user info, can do routes filler, which is the permission for this user
        // filterRoutes func will return current user async routes array
        const routes = await store.dispatch('permission/filterRoutes', roles.menus)
        console.log('routes...........', routes)

        // add async routes to router
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }])
        next(to.path) // jump to the address I wanna go one more time
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) > -1) {
      next()
    } else {
      next('/login')
    }
  }
  nprogress.done()
})

// check after jump route
router.afterEach(() => {
  nprogress.done()
})
