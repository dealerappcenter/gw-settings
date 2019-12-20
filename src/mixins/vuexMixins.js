import { mapGetters } from "vuex";

export default {
    computed: {
        ...mapGetters("KANVAS/Company", ["currentCompanyId"])
    },
    watch: {
        currentCompanyId() {
            if (this.initialize) {
                this.initialize();
            } else {
                console.warn("Component expects a defined initialize() method to respond properly to a currentCompanyId change");
            }
        }
    }
}
