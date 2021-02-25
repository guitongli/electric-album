console.log("hooked");
new Vue({
    el: "#main",
    data: {
        name: "Pixel Zoo",
        images: [],
    },

    mounted: function () {
        console.log("im mounted");
        var self = this;
        console.log("upper", this);
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
});
