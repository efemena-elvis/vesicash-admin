const paymentsRoutes = [
  {
    // ====================================
    // PAYMENTS ROUTES
    // ====================================
    path: "/payments",
    component: () =>
      import(/* webpackChunkName: "base-layout" */ "@/layouts/layout-base"),

    children: [
      {
        path: "",
        name: "VesicashPayments",
        component: () =>
          import(
            /* webpackChunkName: "payments-module" */
            "@/modules/payments/pages"
          ),
        meta: {
          requiresAuth: true,
          name: "Transactions",
        },
      },
    ],
  },
];

export default paymentsRoutes;
