/*******************************************************************************
 bannerstat - Version: 0.1
 Website: http://wap7.ru/folio/bannerstat/
 Author: L.Savranskiy <lfs2008@yandex.ru>
 *******************************************************************************/

// common  functions
function debug(data) {
    if (!!window.console && !!console.log) {
        console.log(data);
    }
}


DATETOOL = {


    getDateTime :  function () {
        var date = new Date();
        var h = date.getHours();
        var m = date.getMinutes();
        var s = date.getSeconds();

        m = this.checkTime(m);
        s = this.checkTime(s);
        return h + ":" + m + ":" + s;

    },

    getEpochTime: function () {
        var date = new Date();
        return date.getTime();
    },

    // add a zero in front of numbers<10
    checkTime: function (i) {
        return i < 10 ? "0" + i : i;
    }


};




APP = {


    active : true,
    moe:   0,
    containerid : '#container',
    delay : 1000,  //( msec, for idle check)
    elid : '#banner',
    inView : 0  ,
    interVal:   1, //(sec, for status update)
    startedat: DATETOOL.getEpochTime(),
    dataUrl: 'http://example.com',



    setActive : function() {
        this.active = true;
        // debug('set APP.active to TRUE');
    },

    setInactive : function() {
        this.active = false;
        // debug('set APP.active to TRUE');
    },

    getActive : function() {
        return this.active;
    },

    checkInView: function(elem) {
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();

        var elemTop = $(elem).offset().top;
        var elemBottom = elemTop + $(elem).height();



     //  debug(docViewTop);
     //  debug(docViewBottom);


        return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom));
    },



    updateStatus:  function () {
         $("#status").html('');
        var statusText = 'Updated at: ' + DATETOOL.getDateTime();
        var isInView = this.checkInView(this.elid);
        var isActive = this.getActive();
        var timeonpage = Math.round(( DATETOOL.getEpochTime() - this.startedat ) / 1000);
        var inviewtime = this.inView * this.interVal;
        var atf = isInView ? 'Y' : 'N';
        var uia = isActive ? 'Y' : 'N';
        var moe = this.moe;


        statusText += '<p>Page view time: ' + timeonpage + ' seconds</p>';
        statusText += '<p>Banner inView time: ' + inviewtime + ' seconds</p>';
        statusText += '<p>mouseover count: ' + moe + '</p>';
        statusText += '<p class="' + isInView + '">Banner is visible: ' + isInView + '</p>';
        statusText += '<p class="' + isActive + '">User is active: ' + isActive  + '</p>';



        var  link = this.dataUrl + "?pid=XXX&timeonpage=" + timeonpage +"&inviewtime=" + inviewtime +"&moe="+ moe + "&atf=" + atf + "&uia=" + uia;
        
        $.get(link, function(data){
        debug("Data Loaded to: " + link);
        });


        $("#status").html(statusText);
        //.css('border-color', 'red');

    },

    addMouseover: function() {
        ++this.moe;
    },


    addTime: function() {
      ++this.inView;
    },

    collectData: function() {
        //         debug(this.active);
        //         debug(this.checkInView(this.elid));
        /*
        Visible | User Active | Add Time spent (bool)
        =============================
        true | true | Y
        true | false | Y
        false | true | N
        false | false | N
         */
        if (this.checkInView(this.elid) === true) {

            this.addTime();
        }


    },
    
    init: function() {

        setInterval("APP.collectData()", APP.interVal * 1000);
        setInterval("APP.updateStatus()", APP.interVal * 1000);
        APP.updateStatus();
       // setTimeout("setInactive()", 1);
        //$('#input1').focus();

    }



};


$(document).ready(function() {

    $(APP.elid).mouseover(function() {
        APP.addMouseover();
    });

    $(window).idle(
            function() {
                // When idle
                APP.setInactive();
                //debug('inactive ' );
            },
            function() {
                // When active again
                 APP.setActive();
                //  debug('active again ' );
            },
             { after: APP.delay }
            );
//
//    $(APP.containerid).bind(
//            'mousemove click mouseup mousedown keydown keypress keyup submit change mouseenter scroll resize dblclick',
//            setActive
//            );

  APP.init();

});

