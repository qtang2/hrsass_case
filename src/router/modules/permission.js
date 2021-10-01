// permission router rules
import Layout from '@/layout'
export default {
  path: '/permission',
  name: 'permissions',
  component: Layout,
  children: [
    {
      path: '', // when path is empty, it will show 1st level router and second level router
      component: () => import('@/views/permission'),
      name: 'permissions',
      // save info for routers, can be anything
      meta: {
        title: '权限管理',
        icon: 'lock'
      }
    }
  ]
}
