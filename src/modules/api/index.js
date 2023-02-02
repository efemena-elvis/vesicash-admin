const apiRoutes = [
  {
    // ====================================
    // API ROUTES
    // ====================================
    path: "/api/api-overview",
    component: () =>
      import(/* webpackChunkName: "base-layout" */ "@/layouts/layout-base"),

    children: [
      {
        path: "",
        name: "VesicashAPI",
        component: () =>
          import(
            /* webpackChunkName: "api-module" */
            "@/modules/api/pages"
          ),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "/api/api-transactions",
        name: "VesicashAPITransactions",
        component: () =>
          import(
            /* webpackChunkName: "api-module" */
            "@/modules/api/pages/api-transactions"
          ),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
];

export default apiRoutes;
