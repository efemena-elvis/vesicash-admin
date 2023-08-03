const morRoutes = [
  {
    // ====================================
    // MOR ROUTES
    // ====================================
    path: "/mor",
    component: () =>
      import(/* webpackChunkName: "base-layout" */ "@/layouts/layout-base"),

    children: [
      {
        path: "",
        component: () =>
          import(
            /* webpackChunkName: "mor-module" */
            "@/modules/mor/layouts/mor-layout"
          ),
        meta: {
          requiresAuth: true,
        },

        children: [
          {
            name: "MORTransactions",
            path: "transactions",
            component: () =>
              import(
                /* webpackChunkName: "mor-module" */
                "@/modules/mor/pages/mor-transactions"
              ),
            meta: {
              requiresAuth: true,
              name: "MOR Transactions",
            },
          },
          {
            name: "MORPayouts",
            path: "payouts",
            component: () =>
              import(
                /* webpackChunkName: "mor-module" */
                "@/modules/mor/pages/mor-payouts"
              ),
            meta: {
              requiresAuth: true,
              name: "MOR Payouts",
            },
          },

          {
            name: "MORWithdrawals",
            path: "withdrawals",
            component: () =>
              import(
                /* webpackChunkName: "mor-module" */
                "@/modules/mor/pages/mor-withdrawals"
              ),
            meta: {
              requiresAuth: true,
              name: "MOR Withdrawals",
            },
          },
        ],
      },
    ],
  },
];

export default morRoutes;
