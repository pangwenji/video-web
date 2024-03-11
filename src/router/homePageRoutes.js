const homePageRoutes = [
  {
    name: 'Home',
    path: '/home',
    meta: {
      title: '主页',
      icon: 'icon-dashboard',
      type: 'M',
      affix: true
    },
    component: () => import('@/views/HomeView.vue'),
  }
]

export const homePage = {
  name: 'home',
  path: '/home',
  meta: { title: '首页', icon: 'icon-home', hidden: false, type: 'M' }
}

export default homePageRoutes
