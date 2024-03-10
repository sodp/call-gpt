function getOrderStatus(model) {
    // [6696470263, 4219478205, 5393929867, 9769938204, 3095625052, 2232255825, 2076479365, 3510223215, 7668469616,
    //     2965124014, 3097789472, 5293203657, 3275311671, 9670906997, 7716296839, 7581255641, 9372279450, 6056521985,
    //     7025078125, 8847824390, 9971628110]
    fetch('http://103.55.104.168:5002/get_orders/' + model)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => console.log(data))
        .catch(error => console.error('There was a problem with your fetch operation:', error));
    }

module.exports = getOrderStatus;