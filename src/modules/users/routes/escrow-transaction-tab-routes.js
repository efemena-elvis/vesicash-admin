export default [
  {
    path: ":userID/escrow-transaction/:transactionID",
    name: "UserEscrowTransactionDetails",
    component: () =>
      import(
        /* webpackChunkName: "users-module" */
        "@/modules/users/layouts/user-escrow-transaction-layout"
      ),
    meta: {
      requiresAuth: true,
    },

    children: [
      {
        path: "payment-rules",
        name: "UserEscrowTransactionPaymentRules",
        component: () =>
          import(
            /* webpackChunkName: "users-module" */
            "@/modules/users/pages/escrow-transaction/user-escrow-transaction-payment-rules"
          ),
        meta: {
          requiresAuth: true,
          name: "Escrow Payment Rules",
        },
      },

      {
        path: "payments",
        component: () =>
          import(
            /* webpackChunkName: "users-module" */
            "@/modules/users/layouts/user-escrow-transaction-payment-layout"
          ),
        meta: {
          requiresAuth: true,
        },

        children: [
          {
            path: "",
            name: "UserEscrowTransactionPayments",
            component: () =>
              import(
                /* webpackChunkName: "users-module" */
                "@/modules/users/pages/escrow-transaction/user-escrow-transaction-payments"
              ),
            meta: {
              requiresAuth: true,
              name: "Escrow Payments",
            },
          },
          {
            path: "disbursements",
            name: "UserEscrowTransactionDisbursements",
            component: () =>
              import(
                /* webpackChunkName: "users-module" */
                "@/modules/users/pages/escrow-transaction/user-escrow-transaction-disbursements"
              ),
            meta: {
              requiresAuth: true,
              name: "Escrow Disbursements",
            },
          },
        ],
      },

      {
        path: "parties",
        name: "UserEscrowTransactionParties",
        component: () =>
          import(
            /* webpackChunkName: "users-module" */
            "@/modules/users/pages/escrow-transaction/user-escrow-transaction-parties"
          ),
        meta: {
          requiresAuth: true,
          name: "Escrow Parties",
        },
      },

      {
        path: "activity",
        name: "UserEscrowTransactionActivity",
        component: () =>
          import(
            /* webpackChunkName: "users-module" */
            "@/modules/users/pages/escrow-transaction/user-escrow-transaction-activity"
          ),
        meta: {
          requiresAuth: true,
          name: "Escrow Activities",
        },
      },
    ],
  },
];
