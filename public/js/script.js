(function() {
    console.log('hooked');
    Vue.component('your-component', {
        template: '#yourTemplate',
        data: function() {
            return {
                username: '',
                comments: '',
                comment: '',
                success:null
            };
        },
        props: ['show'],
        mounted: function() {
            var self = this;
            console.log('comment mounted now');
            console.log('id', this.show);
            axios
                .get(`/comments/${self.show.id}`)
                .then(function(commentlist) {
                    self.comments = commentlist.data;
                    console.log('got comments', commentlist);
                })
                .catch(function(err) {
                    console.log('error in axios', err);
                });
        },
        methods: {
            sendComment: function(e) {
                e.preventDefault();
                var self = this;
                var name = this.username;
                var id = this.show.id;
                var content = this.comment;
                var body = {
                    username: name,
                    image_id: id,
                    comment: content,
                    
                };

                axios
                    .post('/comment', body)
                    .then(function() {
                        //  var existingList = self.comments;
                        axios
                            .get(`/comments/${id}`)
                            .then((result) => {
                                self.username = null;
                                self.comment = null;
                                self.success = true
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    })
                    .catch(function(err) {
                        console.log('error in axios', err);
                    });
            }
        },
        watch: {
            imageId: function() {
                if (this.imageId) {
                    console.log('detected url change');
                    axios
                        .get(`/gallery/${this.imageId}`)
                        .then(function(result) {
                            self.itemInfo = result.data[0];
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }
            }
        }
    });
    Vue.component('my-component', {
        template: '#myTemplate',
        data: function() {
            return {};
        },
        props: ['src'],

        mounted: function() {
            console.log('component mounted now', this.src);
        },
        methods: {
            close: function(e) {
                console.log('closing it');
                this.$emit('zoom-out');
                e.preventDefault();
                history.pushState('', document.title, window.location.pathname + window.location.search);
            }
        }
    });

    new Vue({
        el: '#main',
        data: {
            name: '',
            images: [],
            username: '',
            title: '',
            description: '',
            file: '',
            toggle: null,
            itemInfo: null,
            available: true,
            imageId: location.hash.slice(1)
        },

        mounted: function() {
            console.log('im mounted');
            var self = this;
            var topImgInd;
           
            console.log('exist or moy', this.itemInfo);
            if (this.imageId) {
                console.log('im in direct root');
                axios
                    .get(`/gallery/${this.imageId}`)
                    .then(function(result) {
                        self.itemInfo = result.data[0];
                        console.log('inside?', self.itemInfo);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
            console.log('exist or not', this.itemInfo);
            axios
                .get('/gallery')
                .then(function(imagelist) {
                    console.log(imagelist);
                    self.images = imagelist.data;
                    // console.log( "staying outside", imagelist.data);
                    topImgInd = imagelist.data[0].id;
                    console.log( "staying outside", topImgInd);
                    checkNew(topImgInd);
                })
                .catch(function(err) {
                    console.log('error in axios', err);
                });
            function checkNew(id) {  
                var timer = setTimeout(() => {
                    
                    axios
                        .get('/count')
                        .then((result) => {
                            // console.log(result)
                            if (result.data.rows[0].id <= id) {
                                console.log('nothing new');
                                self.name = null;
                                checkNew(id);
                            } else {
self.name = true;
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }, 6000);
            }
            

            window.addEventListener('hashchange', function() {
                self.imageId = location.hash.slice(1);
            });
        },

        watch: {
            imageId: function() {
                this.itemInfo = null;
                var self = this;

                console.log('detected url change');
                axios.get(`/gallery/${this.imageId}`).then(function(result) {
                    self.itemInfo = result.data[0];
                    console.log('no idea', self.itemInfo);
                }).catch((err)=>{console.log(err)});
            }
        },
        methods: {
            handleClick: function(e) {
                // var file = myFileInput.files[0];
                var formData = new FormData();
                var self = this;
                formData.append('title', this.title);
                // formData.append("description", this.description);
                formData.append('file', this.file);
                formData.append('description', this.description);
                formData.append('username', this.username);
                axios
                    .post('/upload', formData)
                    .then((response) => {
                        console.log('got renewed');
                        self.toggle = true;
                        self.description= null;
                        self.description = null;
                        self.username = null;
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            handleChange: function(e) {
                console.log(e.target.files);
                this.file = e.target.files[0];
            },

            zoomOut: function() {
                this.imageId = null;
                this.itemInfo = null;
            },
            // close: function () {
            //     this.toggle = false;
            // },
            getMore: function() {
                var lowestId = this.images[this.images.length - 1].id;
                console.log('lowest', lowestId);
                var currentList = this.images;
                var self = this;

                axios
                    .post(`/more/${lowestId}`)
                    .then(result => {
                        console.log(result.data);
                        console.log(currentList);
                        var addList = result.data;
                        var newList = currentList.concat(addList);
                        console.log(newList);
                        self.images = newList;
                        if (this.images[this.images.length - 1].id == this.images[this.images.length - 1].lowestId) {
                            self.available = null;
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        }
    });
})();
