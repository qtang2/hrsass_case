import store from '@/store'

export default {
  methods: {
    checkPermission(key) {
      // key is the action permission name we wanna check
      // all action permission will be stored in userInfo.roles.points
      const { userInfo } = store.state.user
      if (userInfo.roles && userInfo.roles.points) {
        return userInfo.roles.points.some(item => item === key)
      }
      // which means no permission
      return false
    }
  }
}
