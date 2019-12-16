
 export const bluetooth_actions = {

    connect(message,device){
        return{
            type:'device_connected',
            payload:{message,device}
        }
    },
    update_pulse(pulse){
        return {
            type:'pulse_updated',
            payload:pulse
        }
    }

};



