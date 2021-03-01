(function () {
    console.log("hooked");
    Vue.component("my-component", {
        template: "#childTemplate",
        data: function () {
            return {
                name: "ok",

                img: "",
            };
        },
        props: ["src"],
        mounted: function () {
            console.log("component mounted now");
            console.log(this);
        },
        methods: {
            close: function (e) {
                console.log("closing it");
                this.$emit("zoom-out");
                e.preventDefault();
            },
        },
    });
    new Vue({
        el: "#main",
        data: {
            name: "Pixel Zoo",
            images: [],
            username: "",
            title: "",
            description: "",
            file: "",
            toggle: true,
            itemInfo: null,
        },

        mounted: function () {
            console.log("im mounted");
            var self = this;
            // console.log("upper", this);
            axios
                .get("/gallery")
                .then(function (imagelist) {
                    console.log(imagelist);
                    self.images = imagelist.data;
                })
                .catch(function (err) {
                    console.log("error in axios", err);
                });
        },
        methods: {
            handleClick: function (e) {
                // var file = myFileInput.files[0];
                var formData = new FormData();
                formData.append("title", this.title);
                // formData.append("description", this.description);
                formData.append("file", this.file);
                formData.append("description", this.description);
                formData.append("username", this.username);
                axios
                    .post("/upload", formData)
                    .then((response) => {
                        console.log(response);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            },
            handleChange: function (e) {
                console.log(e.target.files);
                this.file = e.target.files[0];
            },

            zoomIn: function (info) {
                this.itemInfo = info;
            },
            zoomOut: function () {
                this.itemInfo = null;
            },
            // close: function () {
            //     this.toggle = false;
            // },
        },
    });
})();
