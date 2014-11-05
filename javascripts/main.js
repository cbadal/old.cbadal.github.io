(function() {
  $(document).ready(function() {
    return CB.initialize();
  });

  window.CB = {
    initialize: function() {
      this.state = 'home';
      $('body').css({
        'font-size': (screen.width / 137) + 'px'
      });
      $('#back_home').hide();
      this.back_home();
      return this.assign_events();
    },
    assign_events: function() {
      var that;
      that = this;
      $('#back_home').click(function() {
        return that.back_home();
      });
      $('.menu_item').click(function() {
        var type;
        $('#back_home').fadeIn();
        $('.menu_item').not(this).show();
        $(this).fadeOut();
        type = $(this).attr('id');
        return that[type]();
      });
      that = this;
      return $('#content').scroll(function(e) {
        console.log('content scroll');
        if ($(this).innerHeight() + $(this).scrollTop() >= this.scrollHeight) {
          console.log('made it past first if');
          if (that.state === 'tumblr') {
            return that.load_more_tumblr();
          } else if (that.state === 'instagram') {
            return that.load_more_instagram();
          }
        }
      });
    },
    back_home: function() {
      this.state = 'home';
      $('#content').load('ajax/home.html');
      $('#back_home').fadeOut();
      return $('.menu_item').fadeIn();
    },
    linkedin_menu_item: function() {
      this.state = 'linkedin';
      return $('#content').load('ajax/linkedin.html');
    },
    contact_menu_item: function() {
      return $('#content').load('ajax/contact.html');
    },
    showImages: function() {
      var image, img, result, _i, _len, _ref, _results;
      console.log(this);
      _ref = this.options.custom.images;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        image = _ref[_i];
        console.log(image);
        result = $(document.createElement('a')).attr('href', image.link);
        img = $(document.createElement('img')).attr('src', image.images[this.options.resolution].url);
        result.append(img);
        _results.push($('#instagram_content').append(result));
      }
      return _results;
    },
    instagram_menu_item: function() {
      var div;
      this.state = 'instagram';
      div = $(document.createElement('div')).attr('id', 'instagram_content');
      $('#content').html(div);
      this.feed = new Instafeed({
        get: 'user',
        userId: 182230830,
        accessToken: '182230830.467ede5.bf3d2dfe5c164195ae679e3fab22d56e',
        limit: 15,
        template: '<a href="" target="_blank"><img src=""/></a>',
        resolution: 'standard_resolution',
        links: true,
        mock: true,
        runAgain: false,
        custom: {
          currentUrl: '',
          previous: [],
          images: [],
          currentImage: 14,
          showImages: window.CB.showImages
        },
        success: function(data) {
          this.options.custom.images = data.data;
          return this.options.custom.showImages.call(this);
        }
      });
      return this.feed.run();
    },
    load_more_instagram: function() {
      if (this.feed.options.custom.currentUrl !== this.feed.nextUrl) {
        this.feed.options.custom.currentUrl = this.feed.nextUrl;
        return this.feed.next();
      }
    }
  };

}).call(this);
