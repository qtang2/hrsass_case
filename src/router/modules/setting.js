// setting router rules
import Layout from '@/layout'
export default {
  path: '/setting',
  name: 'settings',
  component: Layout,
  children: [
    {
      path: '', // when path is empty, it will show 1st level router and second level router
      component: () => import('@/views/setting'),
      name: 'settings',
      // save info for routers, can be anything
      meta: {
        title: '设置',
        icon: 'setting'
      }
    }
  ]
}
