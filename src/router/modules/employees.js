// employees router rules
import Layout from '@/layout'
export default {
  path: '/employees',
  name: 'employees',
  component: Layout,
  children: [
    {
      path: '', // when path is empty, it will show 1st level router and second level router
      component: () => import('@/views/employees'),
      name: 'employees',
      // save info for routers, can be anything
      meta: {
        title: '员工管理',
        icon: 'people'
      }
    },
    {
      // dynamic param id, add ? means can have or no have
      path: 'detail/:id',
      hidden: true, // means not show in side bar
      component: () => import('@/views/employees/detail'),
      meta: {
        title: 'Employee Detail'
      }
    },
    {
      path: 'print/:id',
      hidden: true,
      component: () => import('@/views/employees/print'),
      meta: {
        title: 'Print',
        icon: 'people'
      }
    }
  ]
}
