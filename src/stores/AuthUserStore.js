import { defineStore} from "pinia";

export const useAuthUserStore = defineStore("AuthUserStore", {
    state: () => ({
        userAuthenticated: false
    }),
    getters: {
        authenticated: state => state.userAuthenticated,
    },
    actions: {
        grantUserAccess() {
            this.userAuthenticated = true;
        }
    },
    persist: true,
});