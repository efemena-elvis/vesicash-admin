export default [{
    path: ":userID/escrow-transaction/:transactionID",
    name: "UserEscrowTransactionDetails",
    component: () =>
        import (
            /* webpackChunkName: "users-module" */
            "@/modules/users/layouts/user-escrow-transaction-layout"
        ),
    meta: {
        requiresAuth: true,
    },

    children: [{
            path: "payment-rules",
            name: "UserEscrowTransactionPaymentRules",
            component: () =>
                import (
                    /* webpackChunkName: "users-module" */
                    "@/modules/users/pages/escrow-transaction/user-escrow-transaction-payment-rules"
                ),
            meta: {
                requiresAuth: true,
            },
        },
        {
            path: "payments",
            component: () =>
                import (
                    /* webpackChunkName: "users-module" */
                    "@/modules/users/layouts/user-escrow-transaction-payment-layout"
                ),
            meta: {
                requiresAuth: true,
            },

            children: [{
                    path: "",
                    name: "UserEscrowTransactionPayments",
                    component: () =>
                        import (
                            /* webpackChunkName: "users-module" */
                            "@/modules/users/pages/escrow-transaction/user-escrow-transaction-payments"
                        ),
                    meta: {
                        requiresAuth: true,
                    },
                },
                {
                    path: "disbursements",
                    name: "UserEscrowTransactionDisbursements",
                    component: () =>
                        import (
                            /* webpackChunkName: "users-module" */
                            "@/modules/users/pages/escrow-transaction/user-escrow-transaction-disbursements"
                        ),
                    meta: {
                        requiresAuth: true,
                    },
                },
            ],
        },
        {
            path: "activity",
            name: "UserEscrowTransactionActivity",
            component: () =>
                import (
                    /* webpackChunkName: "users-module" */
                    "@/modules/users/pages/escrow-transaction/user-escrow-transaction-activity"
                ),
            meta: {
                requiresAuth: true,
            },
        },
    ],
}, ];