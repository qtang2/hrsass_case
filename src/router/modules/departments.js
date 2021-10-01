// departments router rules
import Layout from '@/layout'
export default {
  path: '/departments',
  name: 'departments',
  component: Layout,
  children: [
    {
      path: '', // when path is empty, it will show 1st level router and second level router
      component: () => import('@/views/departments'),
      name: 'departments',
      // save info for routers, can be anything
      meta: {
        title: '组织架构',
        icon: 'tree'
      }
    }
  ]
}
