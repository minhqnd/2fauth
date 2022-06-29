const firebaseConfig = {
    apiKey: "AIzaSyCGEHoXghlRJeqgCM-VBy2FvMFS750ifWg",
    authDomain: "fa2-stromez.firebaseapp.com",
    databaseURL: "https://fa2-stromez-default-rtdb.firebaseio.com",
    projectId: "fa2-stromez",
    storageBucket: "fa2-stromez.appspot.com",
    messagingSenderId: "19656982461",
    appId: "1:19656982461:web:6bfdd1930d45f0a29edcd4"
};
firebase.initializeApp(firebaseConfig);

let params = new URLSearchParams(location.search);
var keyedit = params.get('key');

function register() {
    document.querySelector('#register').addEventListener('click', () => {
        createuser()
    })
}

function editacc() {
	if (keyedit==null) {
		console.log('return to accs');
		window.open('/accounts', "_self");
	}
	document.querySelector('#save').addEventListener('click', () => {
        editfa()
    })
	document.querySelector('#cancel').addEventListener('click', () => {
		window.open('/accounts', "_self");
    });
	document.querySelector('#signout').addEventListener('click', () => {
        signout();
    })
	document.querySelector('#remove').addEventListener('click', () => {
        removekey()
    })
}


function showedit() {
	var uid = firebase.auth().currentUser.uid;
	firebase.database().ref("otp/"+uid+"/"+keyedit).once("value", snapshot => {
		if (snapshot.exists()) {
		var key = snapshot.val().key;
		var name = snapshot.val().name;
		var account = snapshot.val().account;
		$('#name').val(name);
		$('#account').val(account);
		$('#key').val(key);
		$('#name').attr('placeholder',name);
		$('#account').attr('placeholder',account);
		$('#key').attr('placeholder',key);
		} else {
			window.open('/accounts', "_self");
		}
	})
}

function create() {
    document.querySelector('#create').addEventListener('click', () => {
        createfa()
    })
    document.querySelector('#cancel').addEventListener('click', () => {
        window.open('/accounts', "_self");
    })
	document.querySelector('#signout').addEventListener('click', () => {
        signout();
    })
}

function signout() {
	firebase.auth().signOut().then(() => {
		window.open('/login', "_self");
}).catch((error) => {
});
}

function login() {
    document.querySelector('#login').addEventListener('click', () => {
        signin()
    })
}

function reset() {
	document.querySelector('#reset').addEventListener('click', () => {
		if (document.getElementById('email').value !== '') {
			sendreset(document.getElementById('email').value);
		} else {
			document.getElementById('reset-help').innerHTML = 'The email field is required.';
		}
    })
}

function sendreset(email) {
firebase.auth().sendPasswordResetEmail(email)
  .then(() => {
	document.getElementById('reset-help').innerHTML = 'Password reset email sent!'
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    document.getElementById('reset-help').innerHTML = errorMessage;
  });
}

function accounts() {
    document.querySelector('#create').addEventListener('click', () => {
        window.open('/create', "_self");
    });
	
    document.querySelector('#close').addEventListener('click', () => {
		$('#sc').html('');	
        $('#otp').removeClass('is-active');	
		updatetotp();	
		$('#copyer').val('------');
    });
	// document.querySelector('#manage').addEventListener('click', () => {
		// manage()
    // });
	setInterval(timer, 1000);
	document.querySelector("#searchacc").onkeyup = _=>{
		searchacc();
	}
	document.querySelector('#signout').addEventListener('click', () => {
        signout();
    })
	document.querySelector('#otp-code').addEventListener('click', () => {
        $('#copyer').select()
        document.execCommand('copy');
		$('#vuecopy').html(vuetext.replace('%TEXT%', 'Copied to clipboard'))
		setTimeout(()=>{
			$('#copyer').blur();
    }, 50);
		setTimeout(()=>{
		$('#vuecopy').html('')
	}, 1500);
    })	
		setTimeout(()=>{
		$('#loading').html('');
	}, 2000);
	
}


function manage() {
	$('.tfa-container').append(edit)
}

function loadaccounds() {
	var uid = firebase.auth().currentUser.uid;
	firebase.database().ref("otp/"+uid).on("child_added", function (snapshot) {
	$('#loading').html('');
    var key = snapshot.val().key;
	var name = snapshot.val().name;
	var account = snapshot.val().account;
	var bigkey = snapshot.key;
	var div = template.replaceAll('%KEY%', bigkey);
	var div = div.replace('%ACCOUNT%', account);
	var div = div.replace('%NAME%', name);
	var div = div.replace('%ICON%', name.toLowerCase().replace(' ', ''));
	$('#list').append(div)
})
}

// check signed in
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    var uid = user.uid;
    console.log(uid + ' Signed in...');
	if (page=='accounts') {
		loadaccounds()
	} else if (page=='edit') {
		showedit()
	} else if (page=='login') {
		window.open('/accounts', "_self");
	} else if (page=='register') {
		window.open('/accounts', "_self");
	} else if (page=='reset') {
		window.open('/accounts', "_self");
	} else if (page=='index') {
		window.open('/accounts', "_self");
	}
  } else {
    console.log('User is signed out, redirect to login page...');
	if (page=='accounts') {
		window.open('/login', "_self");
	} else if (page=='edit') {
		window.open('/login', "_self");
	} else if (page=='index') {
		window.open('/login', "_self");
	}
	}
  }
);

function sendcreateuser(email, password) {
	firebase.auth().createUserWithEmailAndPassword(email, password)
	  .then((userCredential) => { 
		var user = userCredential.user;
		console.log(user)
	  })
	  .catch((error) => {
		var errorCode = error.code;
		var errorMessage = error.message;
		console.log(errorCode);
		console.log(errorMessage);
		document.getElementById('password-help').innerHTML = errorMessage;
	  });
}

function sendsignin(email, password) {
	firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    var user = userCredential.user;
    console.log(user)
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
	console.log(errorCode);
	console.log(errorMessage);
	document.getElementById('password-help').innerHTML = errorMessage;
  });
}



function createuser() {
    if (document.getElementById('email').value !== '') {
        document.getElementById('email-help').innerHTML = '';
            if (document.getElementById('password').value.length >= 6) {
                document.getElementById('password-help').innerHTML = '';
                    if (document.getElementById('password').value == document.getElementById('re-password').value) {
						document.getElementById('re-password-help').innerHTML = '';
                        sendcreateuser(document.getElementById('email').value, document.getElementById('password').value);
                    } else {
                        if (document.getElementById('re-password').value == '') {
                            document.getElementById('re-password-help').innerHTML = 'The re-enter password field is required.';
                        } else {
                            document.getElementById('re-password-help').innerHTML = 'The password is not the same.';
                        }
                    }
            } else {
				if (document.getElementById('password').value == '') {
                document.getElementById('password-help').innerHTML = 'The password field is required.';
				} else {
					document.getElementById('password-help').innerHTML = 'Password should be at least 6 characters.';
				}
            }
    } else {
        document.getElementById('email-help').innerHTML = 'The account field is required.';
    }
}

function signin() {
	if (document.getElementById('email').value !== '') {
		document.getElementById('email-help').innerHTML = '';
		if (document.getElementById('password').value !== '') {
			document.getElementById('password-help').innerHTML = '';
			sendsignin(document.getElementById('email').value, document.getElementById('password').value)			
		} else {
			document.getElementById('password-help').innerHTML = 'The password field is required.';
		}
	} else { 
	document.getElementById('email-help').innerHTML = 'The email field is required.';
	}
}


function editfa() {
	if (document.getElementById('account').value !== '') {
		document.getElementById('account-help').innerHTML = '';
		if (document.getElementById('key').value !== '') {
			document.getElementById('key-help').innerHTML = '';
			if (document.getElementById('name').value !== '') {
				editkey(document.getElementById('name').value, document.getElementById('account').value, document.getElementById('key').value)			
			} else {
				editkey('- no service -', document.getElementById('account').value, document.getElementById('key').value)			
			}
		} else {
			document.getElementById('key-help').innerHTML = 'The secret field is required.';
		}
	} else { 
	document.getElementById('account-help').innerHTML = 'The account field is required.';
	}
}

function editkey(name, account, key) {
	var uid = firebase.auth().currentUser.uid;
firebase.database().ref().child('otp').child(uid).child(keyedit).update({
  'name': name,
  'account': account,
  'key': key,
});
window.open('/accounts', "_self");
console.log('done')
}


function removekey() {
let text = "Are you sure you want to remove this account?";
  if (confirm(text) == true) {
	var uid = firebase.auth().currentUser.uid;
	firebase.database().ref().child('otp').child(uid).child(keyedit).remove();
	window.open('/accounts', "_self");
  } else {
  }
}

function createfa() {
	if (document.getElementById('account').value !== '') {
		document.getElementById('account-help').innerHTML = '';
		if (document.getElementById('key').value !== '') {
			document.getElementById('key-help').innerHTML = '';
			if (document.getElementById('key').value !== '') {
			sendkey(document.getElementById('name').value, document.getElementById('account').value, document.getElementById('key').value.replace(' ', ''));	
			} else {
				sendkey('- no service -', document.getElementById('account').value, document.getElementById('key').value.replace(' ', ''));
			}
		} else {
			document.getElementById('key-help').innerHTML = 'The secret field is required.';
		}
	} else { 
	document.getElementById('account-help').innerHTML = 'The account field is required.';
	}
}

function sendkey(name, account, key) {
	var uid = firebase.auth().currentUser.uid;
	firebase.database().ref().child('otp').child(uid).push({
		'name': name,
		'account': account,
		'key': key,
	});
	window.open('/accounts', "_self");
}

function fashow(clicked_id) {
	var uid = firebase.auth().currentUser.uid;
	$('#otp').addClass('is-active');
	firebase.database().ref("otp/"+uid+"/"+clicked_id).once("value", snapshot => {
		var key = snapshot.val().key;
		var name = snapshot.val().name;
		var account = snapshot.val().account;
		$('#name').html(name);
		$('#account').html(account);
		$('#name').html(name);
		$('#sc').html(key);
		$('figure').html(icon.replace('%ICON%', name.toLowerCase().replace(' ', '')));
		updatetotp();
	})
  }
  
var template = `<div id='%KEY%' onclick='fashow(this.id)' class="column is-narrow has-text-white tfa-list"><div class="tfa-container"><div class="tfa-cell tfa-content is-size-3 is-size-4-mobile"><div class="tfa-text has-ellipsis"><img src="https://raw.githubusercontent.com/therealstromez/icons/e333d8a74f1a703b14140d2902fc26dc298a95b2/icons/%ICON%.svg" onerror="this.style.display='none';" style="filter: invert(1);"> %NAME%<span class="is-family-primary is-size-6 is-size-7-mobile has-text-grey">%ACCOUNT%</span></div></div><div class="tfa-cell tfa-edit has-text-grey"><a href='/edit?key=%KEY%' class="tag is-dark is-rounded mr-1">Edit</a></div></div></div>`

// The secret must be in byte increments.
// - no service -


firebase.database().ref("Om6wi1Ef9UffEoCCEq3I18sMdCs1/otp").on("child_added", function (snapshot) {
    console.log(snapshot.val().key)
})

function dec2hex(s) {
	return (s < 15.5 ? "0" : "") + Math.round(s).toString(16);
}

function hex2dec(s) {
	return parseInt(s, 16);
}

function base32tohex(base32) {
	var base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
	var bits = "";
	var hex = "";

	for (var i = 0; i < base32.length; i++) {
		var val = base32chars.indexOf(base32.charAt(i).toUpperCase());
		bits += leftpad(val.toString(2), 5, "0");
	}

	for (var i = 0; i + 4 <= bits.length; i += 4) {
		var chunk = bits.substr(i, 4);
		hex = hex + parseInt(chunk, 2).toString(16);
	}
	return hex;
}

function leftpad(str, len, pad) {
	if (len + 1 >= str.length) {
		str = Array(len + 1 - str.length).join(pad) + str;
	}
	return str;
}
// var cc = secret.value.match(/[^\r\n]+/g)

function totp(sk) {
	var key = base32tohex(sk);
	var epoch = Math.round(new Date().getTime() / 1000.0);
	var time = leftpad(dec2hex(Math.floor(epoch / 30)), 16, "0");
	let success = true;
	try {
		var shaObj = new jsSHA("SHA-1","HEX");
		shaObj.setHMACKey(key, "HEX");
		shaObj.update(time);
		var hmac = shaObj.getHMAC("HEX");
	} catch (err) {
		success = false;
	}

	if (success) {
		var offset = hex2dec(hmac.substring(hmac.length - 1));
		var otp = (hex2dec(hmac.substr(offset * 2, 8)) & hex2dec("7fffffff")) + "";
		otp = otp.substr(otp.length - 6, 6);
		return otp;
	} else {
		return "error";
	}
}

function timer() {
	var epoch = Math.round(new Date().getTime() / 1000.0);
	var countDown = 30 - epoch % 30;
	// if (epoch % 30 == 0) {	
		updatetotp()
	// }


	setProgress = percent=>{
		$('#count').html(count[Math.floor(percent/3)])
	};
	setProgress(countDown);
}



function updatetotp() {
	var code = document.getElementById('sc').innerHTML
	if ($('#sc').html() == '') {
		$('#otp-code').html('--- ---')
	} else {
		if (totp(code)=='error') {
			$('#otp-code').html('error key');
		} else {
		$('#copyer').val(totp(code));
		$('#otp-code').html(totp(code).slice(0,3) + ' ' +  totp(code).slice(3,6));
		}
	}
	
}

var count = [
`<li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li data-is-active="true"></li>`, //0
`<li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li data-is-active="true"></li>`, //10
`<li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li data-is-active="true"></li><li></li>`, //9
`<li></li><li></li><li></li><li></li><li></li><li></li><li></li><li data-is-active="true"></li><li></li><li></li>`, //8
`<li></li><li></li><li></li><li></li><li></li><li></li><li data-is-active="true"></li><li></li><li></li><li></li>`, //7
`<li></li><li></li><li></li><li></li><li></li><li data-is-active="true"></li><li></li><li></li><li></li><li></li>`, //6
`<li></li><li></li><li></li><li></li><li data-is-active="true"></li><li></li><li></li><li></li><li></li><li></li>`, //5
`<li></li><li></li><li></li><li data-is-active="true"></li><li></li><li></li><li></li><li></li><li></li><li></li>`, //4
`<li></li><li></li><li data-is-active="true"></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li>`, //3
`<li></li><li data-is-active="true"></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li>`, //2
`<li data-is-active="true"></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li>`, //1
];

// search
function searchacc() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("searchacc");
    filter = input.value.toUpperCase();
    ul = document.getElementById("list");
    li = ul.getElementsByClassName("tfa-list");
    for (i = 0; i < li.length; i++) {
        a = li[i]
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

var icon = `<img src="https://raw.githubusercontent.com/therealstromez/icons/e333d8a74f1a703b14140d2902fc26dc298a95b2/icons/%ICON%.svg" onerror="this.style.display='none';" style="filter: invert(1);">`

var vuetext = `<span><div class="vue-notification-wrapper" style="transition: all 0ms ease 0s;"><div class="vue-notification-template notification is-radiusless is-success"><div class="notification-content">%TEXT%</div></div></div></span>`
// Copied to clipboard
