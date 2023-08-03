const apiRoutes = [
  {
    // ====================================
    // API ROUTES
    // ====================================
    path: "/api/overview",
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
          name: "API Overview",
        },
      },
      {
        path: "/api/feature-requests",
        name: "VesicashAPITransactions",
        component: () =>
          import(
            /* webpackChunkName: "api-module" */
            "@/modules/api/pages/api-transactions"
          ),
        meta: {
          requiresAuth: true,
          name: "API Feature Requests",
        },
      },
    ],
  },
];

export default apiRoutes;
