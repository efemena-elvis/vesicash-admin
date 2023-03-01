const fxRoutes = [
  {
    // ====================================
    // FX ROUTES
    // ====================================
    path: "/foreign-exchange",
    component: () =>
      import(/* webpackChunkName: "base-layout" */ "@/layouts/layout-base"),

    children: [
      {
        path: "",
        component: () =>
          import(
            /* webpackChunkName: "fx-module" */
            "@/modules/foreign-exchange/layouts/fx-layout"
          ),
        meta: {
          requiresAuth: true,
        },

        children: [
          {
            name: "FXTransactions",
            path: "transactions",
            component: () =>
              import(
                /* webpackChunkName: "fx-module" */
                "@/modules/foreign-exchange/pages/fx-transactions"
              ),
            meta: {
              requiresAuth: true,
              name: "Fx Transactions",
            },
          },
          {
            name: "FXRateHistory",
            path: "rate-history",
            component: () =>
              import(
                /* webpackChunkName: "fx-module" */
                "@/modules/foreign-exchange/pages/fx-rate-history"
              ),
            meta: {
              requiresAuth: true,
              name: "Fx Rate History",
            },
          },
        ],
      },
    ],
  },
];

export default fxRoutes;
