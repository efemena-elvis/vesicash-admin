import escrowTransactionRoutes from "./routes/escrow-transaction-routes";

const escrowRoutes = [
  {
    // ====================================
    // ESCROW ROUTES
    // ====================================
    path: "/escrow-transactions",
    component: () =>
      import(/* webpackChunkName: "base-layout" */ "@/layouts/layout-base"),

    children: [
      {
        path: "",
        name: "VesicashEscrow",
        component: () =>
          import(
            /* webpackChunkName: "escrow-module" */
            "@/modules/escrow/pages"
          ),
        meta: {
          requiresAuth: true,
          name: "Escrow Transactions",
        },
      },

      ...escrowTransactionRoutes,
    ],
  },
];

export default escrowRoutes;
