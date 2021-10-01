import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { getToken, removeToken, setTimeStamp, setToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  // get token when initialize vuex
  token: getToken(),
  userInfo: {} // set as an empty obj
}

const mutations = {
  setToken(state, token) {
    state.token = token

    // save token to cookie
    setToken(token)
  },
  removeToken(state) {
    state.token = null

    // clear token from cookie
    removeToken()
  },
  setUserInfo(state, result) {
    // this means userInfo obj changed, the view layer can get updated
    state.userInfo = result
  },
  removeUserInfo(state) {
    state.userInfo = {}
  }
}

const actions = {
  // login action
  // data should be {username, password}
  async login(context, data) {
    // result is the token
    const result = await login(data)

    context.commit('setToken', result)

    setTimeStamp()
  },
  async getUserInfo(context) {
    const result = await getUserInfo()
    const baseInfo = await getUserDetailById(result.userId)

    context.commit('setUserInfo', { ...result, ...baseInfo })

    return result // for later access control
  },
  logout(context) {
    context.commit('removeToken')
    context.commit('removeUserInfo')

    // reset router
    resetRouter()

    // reset permission
    // need to call other son-level module which has namespace
    // this can be fullfilled by set 3rd param of commit func, and need to set module name at the first param
    context.commit('permission/setRoutes', [], { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
