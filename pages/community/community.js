Page({
  data: {
    posts: [],
    page: 1,
    pageSize: 10,
    isLoading: false,
    hasMore: true,
    showCommentPopup: false,
    currentPostId: '',
    commentContent: '',
    canClosePopup: true,
    maxCommentLength: 200 // 最大评论字数
  },
  onLoad: function () {
    const that = this;
    // 监听帖子集合数据变化
    const observer = wx.cloud.database().collection('posts').where({}).watch({
      onChange: function (snapshot) {
        snapshot.docChanges.forEach((change) => {
          if (change.type === 'added') {
            that.setData({
              posts: [change.doc, ...that.data.posts]
            });
          } else if (change.type === 'modified') {
            const newPosts = that.data.posts.map((post) => {
              if (post._id === change.doc._id) {
                return change.doc;
              }
              return post;
            });
            that.setData({ posts: newPosts });
          }
        });
      },
      onError: function (err) {
        console.error(err);
      }
    });
    this.setData({ observer });
    // 模拟获取用户信息，实际需从登录逻辑完善
    this.loadPosts();
  },
  onUnload: function () {
    const { observer } = this.data;
    if (observer) {
      observer.close();
    }
  },
  loadPosts: function () {
    const { page, pageSize, isLoading, hasMore } = this.data;
    if (isLoading || !hasMore) return;
    this.setData({ isLoading: true });
    wx.cloud.callFunction({
      name: 'getPosts',
      data: {
        page,
        pageSize
      },
      success: (res) => {
        if (res.result.success) {
          const newPosts = res.result.data;
          const formattedPosts = newPosts.map((post) => {
            const date = new Date(post.postTime);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            post.postTime = `${year}-${month}-${day}`;
            return post;
          });
          if (newPosts.length < pageSize) {
            this.setData({ hasMore: false });
          }
          this.setData({
            posts: [...this.data.posts, ...formattedPosts],
            page: page + 1,
            isLoading: false
          });
        } else {
          console.error(res.result.error);
          this.setData({ isLoading: false });
        }
      },
      fail: (err) => {
        console.error(err);
        this.setData({ isLoading: false });
      }
    });
  },
  onReachBottom: function () {
    this.loadPosts();
  },
  handleLike: function (e) {
    const postId = e.currentTarget.dataset.postid;
    const { posts } = this.data;
    const postIndex = posts.findIndex((post) => post._id === postId);
    if (postIndex !== -1) {
      const post = posts[postIndex];
      if (!post.isLiked) {
        wx.cloud.callFunction({
          name: 'likePost',
          data: {
            postId,
            userId: user._id
          },
          success: (res) => {
            post.likeNum++;
            post.isLiked = true;
            this.setData({ posts });
          },
          fail: (err) => {
            console.error(err);
          }
        });
      } else {
        // 取消点赞逻辑类似，需云函数支持
      }
    }
  },
  handleComment: function (e) {
    const postId = e.currentTarget.dataset.postid;
    this.setData({
      showCommentPopup: true,
      currentPostId: postId,
      commentContent: e.detail.value
    });
    console.log(this.commentContent);
  },
  handleCommentInput(e) {
    this.setData({
      commentContent: e.detail.value
    });
  },
  submitComment: function () {
    const { currentPostId, commentContent } = this.data;
    if (commentContent.trim() === '') {
      wx.showToast({
        title: '评论内容不能为空',
        icon: 'none'
      });
      return;
    }
    const userInfo=wx.getStorageSync('token')
    wx.cloud.callFunction({
      name: 'commentPost',
      data: {
        postId: currentPostId,
        userInfo: userInfo,
        commentContent
      },
      success: (res) => {
        if (res.result.success) {
          wx.showToast({
            title: '评论提交成功',
            icon: 'success'
          });
          this.setData({
            showCommentPopup: false,
            commentContent: ''
          });
        } else {
          wx.showToast({
            title: '评论提交失败',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '评论提交失败',
          icon: 'none'
        });
        console.error(err);
      }
    });
  },
  closeCommentPopup() {
    if (!this.data.isInputFocused) {
      this.setData({
        showCommentPopup: false
      });
    }
  },
  goToAddPostPage: function () {
    wx.navigateTo({
      url: '/pages/addPostPage/addPostPage'
    });
  },
  goToPostDetail: function (e) {
    const post = e.currentTarget.dataset.post;
    const postData = encodeURIComponent(JSON.stringify(post)); // 对数据进行编码
    wx.navigateTo({
      url: `/pages/postDetail/postDetail?postData=${postData}`
    });
  },
  openCommentPopup() {
    this.setData({
      showCommentPopup: true,
      canClosePopup: true
    });
  },
  preventPopupClose() {
    this.setData({
      canClosePopup: false
    });
  },
  allowPopupClose() {
    this.setData({
      canClosePopup: true
    });
  },
});