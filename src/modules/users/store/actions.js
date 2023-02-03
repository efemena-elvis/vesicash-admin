// import $api from "@/services/service-api";

// const routes = {
// connected_users:"/users"
// };

export default {
    fetchConnectedUsers: async({ commit }) => {
        const mockUsers = [{
                account_id: "541123462",
                account_type: "Personal",
                email: "adekunleade@gmail.com",
                first_name: "Moses",
                last_name: "Adekunle ",
                status: "verified",
            },
            {
                account_id: "751123463",
                account_type: "Personal",
                email: "bnxn@gmail.com",
                first_name: "Benson",
                last_name: "Drizzy",
                status: "pending",
            },
            {
                account_id: "941023462",
                account_type: "Business",
                email: "oladipo@gmail.com",
                first_name: "Ajao",
                last_name: "Yeizoos",
                status: "verified",
            },
            {
                account_id: "541123462",
                account_type: "Personal",
                email: "adekunleade@gmail.com",
                first_name: "Chaffeur",
                last_name: "Thompson",
                status: "pending",
            },

            {
                account_id: "541123462",
                account_type: "Personal",
                email: "adekunleade@gmail.com",
                first_name: "Chaffeur",
                last_name: "Thompson",
                status: "pending",
            },
        ];

        return new Promise((res) => {
            setTimeout(() => {
                commit("SAVE_CONNECTED_USERS", mockUsers);
                res({ data: mockUsers, code: 200 });
            }, 1500);
        });
    },
};