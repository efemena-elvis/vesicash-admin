const dashboardRoutes = [
  {
    // ====================================
    // DASHBOARD ROUTES
    // ====================================
    path: "/dashboard",
    component: () =>
      import(/* webpackChunkName: "base-layout" */ "@/layouts/layout-base"),

    children: [
      {
        path: "",
        name: "VesicashDashboard",
        component: () =>
          import(
            /* webpackChunkName: "dashboard-module" */
            "@/modules/dashboard/pages"
          ),
        meta: {
          requiresAuth: true,
          name: "dashboard",
        },
      },
    ],
  },
];

export default dashboardRoutes;
