let ct_hours = 0,
    ct_minutes = 0, 
    ct_seconds = 0,
    ct_storage = (localStorage.getItem('storage_count') || 0 ), // checking for local storage value
    ct_interval,
    count_timer_array = [],
    ct_sec,

    ct_form_div = document.querySelector('.count-timer'),
    ct_form_inputs = ct_form_div.querySelectorAll('div.form-div > input'),

    ct_count_btns = document.querySelector('.count-buttons'),
    ct_count_btns_sr = ct_count_btns.querySelector('div.btns_start_reset'),
    ct_count_btns_others = ct_count_btns.querySelector('div.btns_others'),

    neg_flag = false;

    document.getElementById('ct_minus').style.display = 'none';

    // start count down timer
    let ct_countDown = () => {
      return function() {
        if (ct_sec > 0 && !neg_flag) {
            formatSeconds(ct_sec);
            ct_sec--;
        } else if(ct_sec == 0){
            neg_flag = true;
            document.getElementById('ct_minus').style.display = 'block';
            formatSeconds(ct_sec);
            ct_sec++;
        } else if(ct_sec > 0 && neg_flag ){
            document.getElementById('ct_minus').style.display = 'block';
            formatSeconds(ct_sec);
            ct_sec++;
        }
      };
    };

    //converting and adding hours, minutes and seconds to input fields
    let formatSeconds = (secs) => {

        var h = Math.floor(secs / 3600);
        var m = Math.floor(secs / 60) - (h * 60);
        var s = Math.floor(secs - h * 3600 - m * 60);

        document.getElementById('count_timer').className = (h === 0 && m === 0 && s <= 30 && !neg_flag) ? 'count-timer ct_alert_bg' : 'count-timer';

        ct_hours = document.getElementById('ct_usr_hours').value = ("0" + h).slice(-2);
        ct_minutes = document.getElementById('ct_usr_minutes').value = ("0" + m).slice(-2);
        ct_seconds = document.getElementById('ct_usr_seconds').value = ("0" + s).slice(-2);

    };

    // let ct_countDown = () => {

    //     let ct_timer = (ct_hours || ct_minutes || ct_seconds || 0);
        
    //     if(ct_timer) {  
            
    //         if(ct_seconds > 0 && !neg_flag) {
    //             ct_seconds--;
    //         } else if(ct_minutes > 0 && ct_seconds == 0) {
    //             ct_minutes--;
    //             ct_seconds = 59;
    //             if(ct_minutes == 0 && ct_hours > 0) {
    //                 ct_hours--;
    //                 ct_minutes = 59;
    //             }
    //         } else if (ct_hours > 0) {
    //             ct_hours--;
    //             ct_seconds = 59;
    //             ct_minutes = 59;
    //         } else if(ct_seconds > 0 && neg_flag){
    //             ct_seconds--;
    //             if(ct_minutes >=0 && ct_seconds==0) {
    //                 ct_minutes++;
    //                 ct_seconds = 59;
    //                 if (ct_minutes == 60 && ct_hours >= 0) {
    //                     ct_hours++;
    //                     ct_minutes=0;
    //                     ct_seconds = 59;
    //                 }
    //             }
    //         }
    //     } else if(ct_seconds == 0 && !neg_flag){
    //         document.getElementById('ct_minus').style.display = 'block';
    //         neg_flag = true;
    //         ct_seconds = 59;
    //     } else {
    //         console.log('else');
    //         ct_stop();
    //     }

    //     document.getElementById('ct_usr_hours').value = ("0" + ct_hours).slice(-2);
    //     document.getElementById('ct_usr_minutes').value = ("0" + ct_minutes).slice(-2);
    //     document.getElementById('ct_usr_seconds').value = ("0" + ct_seconds).slice(-2);
    // };

    //get local storage value
    getLocalStorageValue = () => {
        let ls_obj = localStorage.getItem('storage_count');
        if(ls_obj) {
            document.getElementById('ct_usr_hours').value = JSON.parse(ls_obj)["hours"] || ct_hours;
            document.getElementById('ct_usr_minutes').value = JSON.parse(ls_obj)["minutes"] || ct_minutes;
            document.getElementById('ct_usr_seconds').value = JSON.parse(ls_obj)["seconds"] || ct_seconds;

            document.getElementById('ct_minus').style.display = ( JSON.parse(ls_obj)["negflag"] == 'ct_lap_msg') ? 'block' : 'none';

            btns_show_hide();
        }
    };

    //set local storage value
    setLocalStorageValue = (ctVal) => {
        localStorage.setItem('storage_count', JSON.stringify(ctVal));
    };

    //Start timer
    let ct_start = () => {
        ct_hours = parseInt(document.getElementById('ct_usr_hours').value) || ct_hours;
        ct_minutes = parseInt(document.getElementById('ct_usr_minutes').value) || ct_minutes;
        ct_seconds = parseInt(document.getElementById('ct_usr_seconds').value) || ct_seconds;

        ct_sec = ct_hours * 3600 + ct_minutes * 60 + ct_seconds;
        neg_flag = false;
        set_input_readonly(true);
        btns_show_hide('start');

        ct_interval = setInterval(ct_countDown(), 1000);
    };

    //Stop timer
    let ct_stop = () => {
        let neg_bool = (document.getElementById('ct_minus').style.display == 'block') ? 'ct_lap_msg' : '';

        create_laps(ct_hours, ct_minutes, ct_seconds, neg_bool);
        ct_reset();
        clearInterval(ct_interval);
        btns_show_hide('stop');
    };

    //Pause timer
    let ct_pause = () => {
        set_input_readonly(false);
        clearInterval(ct_interval);
    };

    //Resume timer
    let ct_resume = () => {
        ct_interval = setInterval(ct_countDown(), 1000);
    }

    //Reset timer
    let ct_reset = () => {
        ct_hours = 0;
        ct_minutes = 0; 
        ct_seconds = 0;
        set_input_readonly();
        document.getElementById('ct_minus').style.display = 'none';
    };

    // set input to read-only when timer is running or value of input to '0' when reset btn pressed
    let set_input_readonly = (readBool) => {
        
        if(typeof(readBool) === "boolean") {
            ct_form_inputs.forEach(function(usrInputs) {
                usrInputs.readOnly = readBool;
            });
        } else {
            ct_form_inputs.forEach(function(usrInputs) {
                usrInputs.value = '';
                usrInputs.readOnly = false;
            });
        }
    };

    //user input validation -- user is allowed to enter only numbers
    let usr_input_isNum = (evt) => {
        evt = (evt) ? evt : window.event;
        let charCode = (evt.which) ? evt.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        btns_show_hide();
        return true;
    };

    //buttons show and hide
    let btns_show_hide = (val) => {
        if (val === 'start') {
            ct_count_btns_sr.style.display = 'none';
            ct_count_btns_others.style.display = 'block';
        } else if(val === "stop") {
            ct_count_btns.style.display = 'none';
        } else {
            ct_count_btns.style.display = 'block';
            ct_count_btns_sr.style.display = 'block';
            ct_count_btns_others.style.display = 'none';
        }
    };

    //creating laps object
    let create_laps = (h, m, s, c) => {
        let ct_laps_obj = {
            hours:h,
            minutes:m,
            seconds:s,
            negflag:c
        }
        if(count_timer_array.length < 5) {
            setLocalStorageValue(ct_laps_obj);
            count_timer_array.push(ct_laps_obj);
            ct_all_laps();
        } else {
          document.getElementById('ct_msg').innerHTML = "<p class='ct_lap_msg'>You can only add maximum 5 laps.</p>";  
        }
        
    };

    //show each lap item
    let ct_all_laps = () => {
        
        document.getElementById('count-timer-laps').innerHTML='';

        count_timer_array.forEach(function(timer, ind){
            document.getElementById('count-timer-laps').innerHTML += "<p class='ct-lap-cont " + timer.negflag+"'> Lap - " + (ind+1) + " :: " + ("0" + timer.hours).slice(-2) + " HH : " + ("0" + timer.minutes).slice(-2) + " MM : " + ("0" + timer.seconds).slice(-2) + " SS </p>";
        });
        
    };

    // actions when space key is pressed
    window.addEventListener('keypress',function(evt){
        evt = (evt) ? evt : window.event;
        let charCode = (evt.which) ? evt.which : event.keyCode;

        if(charCode == 32 && document.activeElement.tagName == "INPUT") {
            getLocalStorageValue();
            return false;
        }

        if(charCode == 32 && ct_seconds != 0){
            ct_stop();
        }
    });

    //On page load if set count timer from local storage
    window.onload = function() {
        getLocalStorageValue();
    };
