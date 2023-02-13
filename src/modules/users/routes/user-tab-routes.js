export default [{
        path: "profile",
        name: "UserProfile",
        component: () =>
            import (
                /* webpackChunkName: "users-module" */
                "@/modules/users/pages/user-profile"
            ),
        meta: {
            requiresAuth: true,
            name: 'Profile'
        },
    },
    {
        path: "escrow-transaction",
        name: "UserEscrowTransactions",
        component: () =>
            import (
                /* webpackChunkName: "users-module" */
                "@/modules/users/pages/escrow-transaction/user-escrow-transactions"
            ),
        meta: {
            requiresAuth: true,
            name: 'Escrow Transactions'
        },
    },
    {
        path: "wallet-transactions",
        name: "UserWalletTransactions",
        component: () =>
            import (
                /* webpackChunkName: "users-module" */
                "@/modules/users/pages/user-wallet-transactions"
            ),
        meta: {
            requiresAuth: true,

        },
    },
    {
        path: "verification",
        name: "UserVerification",
        component: () =>
            import (
                /* webpackChunkName: "users-module" */
                "@/modules/users/pages/user-verification"
            ),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: "exchange-transactions",
        name: "UserExchangeTransactions",
        component: () =>
            import (
                /* webpackChunkName: "users-module" */
                "@/modules/users/pages/user-exchange-transactions"
            ),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: "bank-accounts",
        name: "UserBankAccounts",
        component: () =>
            import (
                /* webpackChunkName: "users-module" */
                "@/modules/users/pages/user-bank-accounts"
            ),
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: "api",
        name: "UserAPI",
        component: () =>
            import (
                /* webpackChunkName: "users-module" */
                "@/modules/users/pages/user-api"
            ),
        meta: {
            requiresAuth: true,
        },
    },
];