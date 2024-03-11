const routes = [
  {
    name: 'main',
    path: '/',
    component: () => import('@/layout/indexMain.vue'),
  },
  {
    name: "room",
    path: "/room",
    component: ()=> import('@/layout/videoRoom.vue')
  },
  {
    name: 'testPage',
    path: '/testPage',
    component: () => import('@/layout/testPage.vue'),
  },
  {
    path: "/:pathMatch(.*)*",
    hidden: true,
    meta: { title: '访问的页面不存在' },
    component: () => import('@/layout/404.vue'),
  }
]

export default routes
