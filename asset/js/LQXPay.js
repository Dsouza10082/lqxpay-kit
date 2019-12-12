const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}

const isEmpty = (obj) => {

    if(obj) {
        return Object.keys(obj).length === 0;
    } else {
        return true;
    }
    
}

let payloadKit = {};

const insert = (num) => {
    document.form.textview.value = document.form.textview.value + num;
}

const c = () => {
    document.form.textview.value = "";
}

const del = () => {
    let exp = document.form.textview.value;
    document.form.textview.value = exp.substring(0, exp.length - 1);
}


const generatePayment = async () => {
    try {

        const isPublic = false;
        const acceptLQX = $('#acceptLQX').prop('checked');
        const acceptBTC = $('#acceptBTC').prop('checked');
        const acceptUSDT = $('#acceptUSDT').prop('checked');
        const acceptEURT = $('#acceptEURT').prop('checked');
        const acceptPaymentSlip = $('#acceptPaymentSlip').prop('checked');
        const isRecurring = false;
        const typeSelect = $("#typeSelect option:selected").val();
        const currencySelect = 'usd';
        const name = $('#name').val();
        const amount = $('#amount').val();
        const desc = $('#description').val();
        const img = $('#img').val();
        const price = $('#totalAmount').val();
        const to = $('#to').val();
        let qty = 1;
        const side = 'SELL';
        const token = await getSession('token');

        if (!$.trim(typeSelect)) {
            alert('Please add the type of this receipt.');
            return;
        }

        if (!$.trim(currencySelect)) {
            alert('We need to get the coin that you is using.');
            return;
        }

        if (typeSelect === 'Exchange' && !$.trim(amount)) {
            alert('For Exchange type we need the amount.');
            return;
        }

        if (!$.trim(name)) {
            alert('Name is required.');
            return;
        }

        const body = {
            name,
            type: typeSelect,
            imgUrl: img,
            price: parseFloat(price.replace(/,/g, '')),
            to,
            currency: currencySelect,
            description: desc,
            isRecurring,
            qty: parseFloat(qty),
            isPublic,
            acceptBTC,
            acceptLQX,
            acceptUSDT,
            acceptEURT,
            amount,
            side,
        }

        const header = {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }

        console.log('headers-->',JSON.stringify(headers));

        const response = await axios.post('https://api.lqxpay.com/receipts/create', body, { headers: header });
        console.log('tinnyResponse-->',JSON.stringify(response.data));

        if (tinnyResponse.error) {
            alert('Error when create Receipt.');
        } else {
            console.log('tinnyResponse-->',JSON.stringify(response));
        }

    } catch (err) {
        alert( err.message);
    }
}

const login = async () => {
    try {

        const email = $('#email').val();
        const password = $('#password').val();

        if (!$.trim(email)) {
            alert('Please check email, is your username, is empty or invalid.');
            return;
        }

        if (!$.trim(password)) {
            alert('Please check password, is empty.');
            return;
        }

        const loginDTO = {
            email,
            password
        }


        const request = await axios.post('https://api.lqxpay.com/auth/login', loginDTO, headers);

        console.log('request-->', JSON.stringify(request.data.response));

        if (request.data && request.data.response.success == true) {

            setObjectSession('payloadKit', request.data.response.data.payload);
            setSession('token', request.data.response.data.token);
            $('#main').show();
            $('#login').hide();

        } else {
            alert('User not found');
        }


    } catch (err) {
        alert('Error on login', err);
    }

}

const setSession = async (key, item) => {
    return localStorage.setItem(key, item);
}

const getSession = async (key) => {
    return localStorage.getItem(key);
}

const setObjectSession = async (key, object) => {
    localStorage.setItem(key, JSON.stringify(object));
}

const getObjectSession = async (key) => {
    return JSON.parse(localStorage.getItem(key));
}

const logout = async () => {
    await setObjectSession('payloadKit', null);
}

const checkPayload = async () => {

    payloadKit = await getObjectSession('payloadKit');

    if (!isEmpty(payloadKit)) {

        $('#userName').html(`Welcome back <strong>${payloadKit.name}</strong>`);
        $('#main').show();
        $('#login').hide();
    } else {
        $('#login').show();
        $('#main').hide();
    }

}

const openScanMultiCard = () => {
    window.open("./scan.html");
}

(async () => {
    try {
        await checkPayload();
    } catch (e) {
        console.error(e);
    }
})();