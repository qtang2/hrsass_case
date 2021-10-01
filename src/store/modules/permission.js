import { constantRoutes, asyncRoutes } from '@/router'
const state = {
  // each user need to have access to all static routes
  routes: constantRoutes
}
const mutations = {
  setRoutes(state, newRoutes) {
    // when adding routes, need to based on static routes, not the state.routes
    // because state.routes could be someone else's routes
    // TODO: but why cant u clear state.routes when u logged out???
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {
  // menus is current user permission names array
  // menus be like: ['setings', 'employees']
  // asyncRoutes is an array [{path:'/',name:'permission',children},{path:'/',name:'permission',children}]
  filterRoutes(context, menus) {
    const routes = []
    menus.forEach(key => {
      routes.push(...asyncRoutes.filter(item => item.name === key))
    })
    // this will set routes in state, which will be used for sidebars
    context.commit('setRoutes', routes)

    // this return routes will be used for addRoutes function
    return routes
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
