let client = new Paho.MQTT.Client(
    'd57a0d1c39d54550b147b58411d86743.s2.eu.hivemq.cloud',
    8884,
    'letni-skola' + Math.random()
)


client.connect({
    onSuccess: onConnect,
    userName: "robot",
    password: "P@ssW0rd!",
    useSSL: true
});

function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("onConnect");

    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    client.subscribe("devices/papago/");
    client.subscribe("devices/netio/messages/events/");
}

function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
    }
}

function onMessageArrived(message) {

    console.log("onMessageArrived:" + message.destinationName);
    console.log("onMessageArrived:" + message.payloadString);
    // document.getElementById("temperature").innerText = message.payloadString;


    let obj = JSON.parse(message.payloadString);

    if ("devices/papago/" === message.destinationName) {

        let vypisTyp = document.querySelector("#typ");
        vypisTyp.textContent = obj.type;

        let vypisTeplA = document.querySelector("#teplotaA");
        vypisTeplA.textContent = obj.T1V1_value;

        let vypisVlhkost = document.querySelector("#vlhkost");
        vypisVlhkost.textContent = obj.H1V2_value;

        let vypisRosny = document.querySelector("#rosnyBod");
        vypisRosny.textContent = obj.D1V3_value;

        let vypisTeplB = document.querySelector("#teplotaB");
        vypisTeplB.textContent = obj.T2V1_value;
    }

    else if ("devices/netio/messages/events/" === message.destinationName) {
        for (let i = 0; i < obj.Outputs.length; i++) {
            var cisloZasuvky = obj.Outputs[i];

            var vypisID = document.querySelector("#ID" + cisloZasuvky.ID);
            vypisID.textContent = cisloZasuvky.ID;

            var vypisJmeno = document.querySelector("#jmeno" + cisloZasuvky.ID);
            vypisJmeno.textContent = cisloZasuvky.Name;

            var vypisStav = document.querySelector("#stav" + cisloZasuvky.ID);
            vypisStav.textContent = cisloZasuvky.State;

            var vypisPrikon = document.querySelector("#prikonW" + cisloZasuvky.ID);
            vypisPrikon.textContent = cisloZasuvky.Load;

            var vypisSpotreba = document.querySelector("#SpotrebaWh" + cisloZasuvky.ID);
            vypisSpotreba.textContent = cisloZasuvky.Energy;
        }
    }
}

function sendMessage() {
    message = new Paho.MQTT.Message(document.getElementById("payload").value);
    message.destinationName = "/row/6/text";
    client.send(message);

}

/* "/row/" + row + "/" + property*/





