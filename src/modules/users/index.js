const usersRoutes = [
  {
    // ====================================
    // USER ROUTES
    // ====================================
    path: "/users/manage-users",
    component: () =>
      import(/* webpackChunkName: "base-layout" */ "@/layouts/layout-base"),

    children: [
      {
        path: "",
        name: "VesicashManageUsers",
        component: () =>
          import(
            /* webpackChunkName: "users-module" */
            "@/modules/users/pages"
          ),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "/users/moderators",
        name: "VesicashModerators",
        component: () =>
          import(
            /* webpackChunkName: "users-module" */
            "@/modules/users/pages/moderators"
          ),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
];

export default usersRoutes;
