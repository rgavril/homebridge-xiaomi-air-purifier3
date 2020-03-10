var miio = require('miio');

class MIoTDevice {
    constructor(did, token, ip) {
        this.did   = did;
        this.ip    = ip;
        this.token = token;
        this.properties = [];
        this.onChangeCallbacks  = [];
        this.isResponding = false;

        this.connect();
    }

    trackProperty(siid, piid) {
        if (! this.isPropertyTracked(siid, piid)) {
            this.properties.push({
                "did" : this.did,
                "siid": siid,
                "piid": piid,
                "value": null
            });
        }
    }

    isPropertyTracked(siid, piid) {
        var tracked = false;

        for (var i = 0; i < this.properties.length; i++) {
            if (this.properties[i].siid == siid && this.properties[i].piid == piid) {
                tracked = true;
                break;
            }
        }

        return tracked;
    }

    getProperty(siid, piid) {
        if (! this.isResponding) {
            throw 'MIOTDevice is not responding';
        }

        if (! this.isPropertyTracked(siid, piid)) {
            throw 'MIOTDevice property is not tracked.';
        }

        var value = null;

        for (var i = 0; i < this.properties.length; i++) {
            if (this.properties[i].siid == siid && this.properties[i].piid == piid) {
                value = this.properties[i].value;
                break;
            }
        }

        if (value == null) {
            throw 'MIOTDevice property has unknown value.';
        }

        return value;
    }

    setProperty(siid, piid, targetValue) {
        if (! this.isResponding) {
            throw 'MIOTDevice is not responding';
        }
        var value = null;

        for (var i = 0; i < this.properties.length; i++) {
            if (this.properties[i].siid == siid && this.properties[i].piid == piid) {
                value = this.properties[i].value;
                break;
            }
        }

        if (value == targetValue) {
            return;
        }

        this.device
            .miioCall('set_properties', [{
                    'did'  : this.did,
                    'siid' : siid,
                    'piid' : piid,
                    'value': targetValue
            }])
            .then(response => {
                this.pollProperties();
            });
    }

    onChangeProperty(siid, piid, callback) {
        var onChangeCallback = {
            siid: siid,
            piid: piid,
            callback: callback
        }

        this.onChangeCallbacks.push(onChangeCallback);
    }

    triggerOnChangeCallbacks(siid, piid, newValue) {
        this.onChangeCallbacks.forEach(onChangeCallback => {
            if (onChangeCallback.siid == siid && onChangeCallback.piid == piid) {
                onChangeCallback.callback(newValue);
            }
        });
    }

    pollProperties(){
        if (! this.device) {
            throw 'MIOTDevice is not connected';
        }

        var that = this;

        this.device
            .miioCall('get_properties', this.properties)
            .then(response => {
                this.isResponding = true;
                var changedIndexes = [];

                response.forEach(responseProperty => {
                    this.properties.forEach((trackedProperty, i) => {
                        if (responseProperty.siid != trackedProperty.siid) { return; }
                        if (responseProperty.piid != trackedProperty.piid) { return; }
                        if (responseProperty.code != 0) { return; }
                        if (responseProperty.value != trackedProperty.value) {
                            changedIndexes.push(i);
                        }
                    });
                });

                this.properties = response;

                changedIndexes.forEach(i => {
                    var property = that.properties[i];
                    that.triggerOnChangeCallbacks(property.siid, property.piid, property.value);
                });
            })
            .catch(error => {
                console.log('MIoT Device (did: '+that.did+') poll error : ' + error);
                this.isResponding = false;
            });
    }

    connect() {
        var that = this;

        miio.device({ address: this.ip, token: this.token })
            .then(device => {
                console.log('MIoT Device (did: '+that.did+') is now connected');
                that.device = device;
                this.pollProperties();
            })
            .catch(error => {
                console.log('MIoT Device (did: '+that.did+') failed to connect:' + error);
                setTimeout(function() {
                    that.connect();
                }, 30000);
            });
    }
}

module.exports = MIoTDevice