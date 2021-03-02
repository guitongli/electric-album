(function () {
    console.log("hooked");
    Vue.component("your-component", {
        template: "#yourTemplate",
        data: function () {
            return {
                username: "",
                comments: "",
                comment: "",
            };
        },
        props: ["id"],
        mounted: function () {
            var self = this;
            // console.log("sub component mounted now");
            console.log("id", this.id.id);
            axios
                .get(`/comments/${self.id.id}`)
                .then(function (commentlist) {
                    self.comments = commentlist.data;
                    console.log(commentlist);
                })
                .catch(function (err) {
                    console.log("error in axios", err);
                });
        },
        methods: {
            sendComment: function (e) {
                e.preventDefault();
                var self = this;
                var name = this.username;
                var id = this.id.id;
                var content = this.comment;
                var newEntry = {
                    username: name,
                    image_id: id,
                    comment: content,
                };

                axios
                    .post(`/comment`, newEntry)
                    .then(function (commentlist) {
                        console.log(commentlist);
                        self.comments = commentlist.data;
                        axios
                            .get("self.id")
                            .then((commentlist) => {
                                self.comments = commentlist.data.rows;
                                console.log(self.comments);
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    })
                    .catch(function (err) {
                        console.log("error in axios", err);
                    });
            },
        },
    });
    Vue.component("my-component", {
        template: "#myTemplate",
        data: function () {
            return {};
        },
        props: ["src"],

        mounted: function () {
            console.log("component mounted now");
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
